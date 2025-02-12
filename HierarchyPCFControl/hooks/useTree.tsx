/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from "react";
import ELK, { ElkNode } from "elkjs/lib/elk.bundled.js";
import { Position, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { Node } from "@xyflow/react/dist/esm/types/nodes";
import { Edge } from "@xyflow/react/dist/esm/types/edges";

import { findPath } from "../utils/utils";
import { nodeWidth, nodeHeight } from "../utils/constants";

const elk = new ELK();

const layoutOptions = {
    "elk.algorithm": "layered",
    "elk.direction": "DOWN",
    "elk.edgeRouting": "SPLINES",
    "elk.layered.spacing.nodeNodeBetweenLayers": "25",
    "elk.layered.spacing.edgeNodeBetweenLayers": "25",
    "elk.layered.cycleBreaking.strategy": "DEPTH_FIRST",
    "spacing.componentComponent": "25",
    spacing: "25",
};

const getLayoutedElements = async (nodes: any[], edges: any[], options = {}) => {
    const graph = {
      id: 'root',
      layoutOptions: layoutOptions,
      edges: edges,
      children: nodes.map((node) => ({
        ...node,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
        width: nodeWidth,
        height: nodeHeight,
      })),
    };
  
    const layoutedGraph = await elk.layout(graph);

    return {
        layoutedNodes: layoutedGraph.children?.map((node) => ({
            ...node,
            position: { x: node.x, y: node.y },
        })),
        layoutedEdges: layoutedGraph.edges,
    };
};

export default function useTree(initialNodes: Node[], initialEdges: Edge[]) {
    const { fitView, getZoom, setCenter } = useReactFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedPath, setSelectedPath] = useState<string[]>([]);
    
    const selectedNode = useMemo(() => {
        return nodes?.find(n => n.id == selectedPath[selectedPath.length - 1]);
    }, [selectedPath])

    const onLayout = useCallback(async ({ useInitialNodes = false }) => {
        const ns = useInitialNodes ? initialNodes : nodes;
        const es = useInitialNodes ? initialEdges : edges;
    
        const { layoutedNodes, layoutedEdges} = await getLayoutedElements(ns, es);

        setNodes(layoutedNodes as any[]);
        setEdges(layoutedEdges as any[]);
        window.requestAnimationFrame(() => fitView({ duration: 750, padding: 1 }));
    },  [nodes, edges]);

    const getChildrenIds = useCallback((nodeId: string) => {
        return edges
            .filter((edge) => edge.source === nodeId)
            .map((edge) => edge.target);
    }, [edges]);

    const getAllDescendantIds = useCallback((nodeId: string) => {
        const descendants: string[] = [];
        const stack: string[] = [nodeId];

        while (stack.length > 0) {
            const currentId = stack.pop()!;
            const childrenIds = getChildrenIds(currentId);
            descendants.push(...childrenIds);
            stack.push(...childrenIds);
        }

        return descendants;
    }, [getChildrenIds]);

    const moveToNode = useCallback((id: string) => {
        const node = nodes.find((n) => n.id === id);

        if(!node)
            return;

        const path = findPath(id, edges);
        setSelectedPath(path);

        const currentZoom = getZoom();
        const nodeCenterX = node.position.x + (nodeWidth / 2);
        const nodeCenterY = node.position.y + (nodeHeight / 2);

        setCenter(nodeCenterX, nodeCenterY, { zoom: currentZoom, duration: 500 });
    }, [getZoom, setCenter]);

    const onExpandNode = useCallback((nodeId: string) => {
        setNodes((prevNodes) => {
            const updatedNodes = prevNodes.map((n) => {
                if (n.id === nodeId) {
                    const newExpandedState = !n.data.expanded;
                    return { ...n, data: { ...n.data, expanded: newExpandedState } };
                }
                return n;
            });
    
            const toggleDescendantsVisibility = (parentId: string, isVisible: boolean) => {
                const descendantIds = getAllDescendantIds(parentId);
                descendantIds.forEach((descendantId) => {
                    const descendantNode = updatedNodes.find((n) => n.id === descendantId);
                    if (descendantNode) {
                        descendantNode.hidden = !isVisible;
                    }
                });
            };
    
            const node = updatedNodes.find((n) => n.id === nodeId);
            if (node) {
                toggleDescendantsVisibility(nodeId, node.data.expanded as boolean);
            }
    
            return updatedNodes;
        });
    }, [nodes, edges, getChildrenIds, moveToNode]);

    return {
        nodes,
        edges,
        selectedPath,
        selectedNode,
        getChildrenIds,
        moveToNode,
        onExpandNode,
        onNodesChange,
        onEdgesChange,
        onLayout
    };
}