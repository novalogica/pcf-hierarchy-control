import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { layout, graphlib } from '@dagrejs/dagre';
import { useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { Node, Edge } from "@xyflow/react/dist/esm/types";

import { ControlContext } from "../context/control-context";
import { nodeHeight, nodeWidth } from "../utils/constants";
import { findPath } from "../utils/utils";

const dagreGraph = new graphlib.Graph().setDefaultEdgeLabel(() => ({}));

export default function useTree(initialNodes: Node[], initialEdges: Edge[], direction: string) {
    const { entityId } = useContext(ControlContext);
    const { getZoom, setCenter } = useReactFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState<any>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedPath, setSelectedPath] = useState<string[]>([]);

    const selectedNode = useMemo(() => {
        return nodes?.find(n => n.id == selectedPath[selectedPath.length - 1]);
    }, [selectedPath])

    useEffect(() => onLayout(), [initialNodes, initialEdges, direction]);

    const onLayout = useCallback(() => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements();
        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);

        const node = layoutedNodes.find((n) => n.id === entityId);
        
        if(node) {
            const path = findPath(entityId, edges);
            setSelectedPath(path);
            setTimeout(() => setCenter(node.position.x, node.position.y, { zoom: 0.75, duration: 500 }), 500);
        }
    }, [entityId, nodes, edges]);

    const moveToNode = useCallback((id: string) => {
        const node = nodes.find((n) => n.id === id);

        if(!node)
            return;

        const path = findPath(id, edges);
        setSelectedPath(path);

        const currentZoom = getZoom();
        const nodeCenterX = node.position.x;
        const nodeCenterY = node.position.y;

        setCenter(nodeCenterX, nodeCenterY, { zoom: currentZoom, duration: 500 });
    }, [getZoom, setCenter, nodes]);

    const getLayoutedElements = useCallback(() => {
        const isHorizontal = direction === 'LR';
        dagreGraph.setGraph({ rankdir: direction });
    
        nodes.forEach((node) => {
            dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
        });
    
        edges.forEach((edge) => {
            dagreGraph.setEdge(edge.source, edge.target);
        });
    
        layout(dagreGraph);
    
        const newNodes = nodes.map((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            const newNode = {
            ...node,
            targetPosition: isHorizontal ? 'left' : 'top',
            sourcePosition: isHorizontal ? 'right' : 'bottom',
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
            };
        
            return newNode;
        });
    
        return { nodes: newNodes, edges };
    }, [nodes, edges, direction]);

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

    const onExpandNode = useCallback((nodeId: string) => {
        const path = findPath(nodeId, edges);
        setSelectedPath(path);

        setNodes((prevNodes) => {
            const updatedNodes = prevNodes.map((n) => {
                if (n.id === nodeId) {
                    const newExpandedState = !n.data.expanded;
                    return { ...n, data: { ...n.data, expanded: newExpandedState } };
                }
                return n;
            });

            const toggleDescendantsVisibility = (parentId: string, isVisible: boolean) => {
                const descendants = getAllDescendantIds(parentId);

                descendants.forEach((id) => {
                    const descendantNode = updatedNodes.find((n) => n.id === id);

                    if (descendantNode) {
                        const nodeVisibility = isVisible && descendantNode.data.parentId == parentId 
                                            ? false 
                                            : isVisible && descendantNode.data.parentId != parentId
                                                ? true
                                                : !isVisible;

                        descendantNode.hidden = nodeVisibility,
                        descendantNode.data = { ...descendantNode.data, expanded: nodeVisibility }
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
        moveToNode,
        onExpandNode,
        getChildrenIds,
        onNodesChange,
        onEdgesChange
    };
}