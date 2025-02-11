import { useCallback, useEffect, useMemo, useState } from "react";
import ELK from "elkjs/lib/elk.bundled.js";
import { useReactFlow } from "@xyflow/react";
import { Node } from "@xyflow/react/dist/esm/types/nodes";
import { Edge } from "@xyflow/react/dist/esm/types/edges";

import { findPath } from "../utils/utils";
import { nodeWidth, nodeHeight } from "../utils/constants";

const layoutOptions = {
    "elk.algorithm": "layered",
    "elk.direction": "DOWN",
    "elk.edgeRouting": "ORTHOGONAL",
    "elk.layered.spacing.nodeNodeBetweenLayers": "50",
    "elk.layered.spacing.edgeNodeBetweenLayers": "10",
    "elk.layered.cycleBreaking.strategy": "DEPTH_FIRST",
    "spacing.componentComponent": "50",
    spacing: "50",
};

const elk = new ELK();

export default function useTree(initialNodes: Node[], initialEdges: Edge[]) {
    const { fitView, getZoom, setCenter } = useReactFlow();
    const [nodes, setNodes] = useState(initialNodes);
    const [edges] = useState(initialEdges);
    const [isAdjustingLayout, setIsAdjustingLayout] = useState(true);
    const [selectedPath, setSelectedPath] = useState<string[]>([]);
    
    useEffect(() => {
        const centerNodes = async () => {
            if (isAdjustingLayout) {
                applyAutoLayout();
                setIsAdjustingLayout(false);
            }
        };

        centerNodes();
    }, [isAdjustingLayout]);

    const selectedNode = useMemo(() => {
        return nodes?.find(n => n.id == selectedPath[selectedPath.length - 1]);
    }, [selectedPath])

    const getLayoutedNodes = useCallback(async () => {
        const validEdges = edges.filter((edge) =>
            nodes.some((node) => node.id === edge.source) &&
            nodes.some((node) => node.id === edge.target)
        );
    
        const graph = {
            id: "root",
            layoutOptions,
            children: nodes.map((n) => ({
                id: n.id,
                width: nodeWidth,
                height: nodeHeight,
            })),
            edges: validEdges.map((e) => ({
                id: e.id,
                sources: [e.source],
                targets: [e.target],
            })),
        };
    
        const layoutedGraph = await elk.layout(graph);
    
        return nodes.map((node) => {
            const layoutedNode = layoutedGraph.children?.find((n) => n.id === node.id);
            return {
                ...node,
                position: {
                    x: layoutedNode?.x ?? 0,
                    y: layoutedNode?.y ?? 0,
                },
            };
        });
    }, [nodes, edges]);

    const applyAutoLayout = useCallback(async () => {
        const layoutedNodes = await getLayoutedNodes();
        setNodes(layoutedNodes);
        fitView({ duration: 750, padding: 1 });
    }, [setNodes, fitView]);

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
        isAdjustingLayout,
        nodes,
        edges,
        selectedPath,
        selectedNode,
        getChildrenIds,
        moveToNode,
        onExpandNode,
    };
}