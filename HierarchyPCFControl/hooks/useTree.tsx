import { useCallback, useEffect, useMemo, useState } from "react";
import { useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { Node } from "@xyflow/react/dist/esm/types/nodes";
import { Edge } from "@xyflow/react/dist/esm/types/edges";

import { findPath } from "../utils/utils";
import { nodeWidth, nodeHeight } from "../utils/constants";
import { initialTree, treeRootId } from "../utils/mock-data";
import { layoutElements } from "../utils/layout";

export default function useTree(initialNodes: Node[], initialEdges: Edge[]) {
    const { nodes: layoutedNodes, edges: layoutedEdges } = layoutElements(initialTree, treeRootId, 'TB');
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
    const { getZoom, setCenter } = useReactFlow();
    const [selectedPath, setSelectedPath] = useState<string[]>([]);
    
    const onLayout = useCallback((direction) => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = layoutElements(
            initialTree,
            treeRootId,
            direction,
        );
        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
    }, [nodes, edges]);

    const selectedNode = useMemo(() => {
        return nodes?.find(n => n.id == selectedPath[selectedPath.length - 1]);
    }, [selectedPath])

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
        onNodesChange,
        onEdgesChange,
        selectedPath,
        selectedNode,
        getChildrenIds,
        moveToNode,
        onExpandNode,
    };
}