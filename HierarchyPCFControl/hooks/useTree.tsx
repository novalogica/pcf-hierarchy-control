import { useCallback, useEffect, useMemo, useState } from "react";
import { Edge, Node, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { findPath } from "../utils/utils";
import {layout, graphlib} from '@dagrejs/dagre';
import { nodeHeight, nodeWidth } from "../utils/constants";

const dagreGraph = new graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
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
};

export default function useTree(initialNodes: Node[], initialEdges: Edge[]) {
    const { fitView, getZoom, setCenter } = useReactFlow();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [nodes, setNodes, onNodesChange] = useNodesState<any>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedPath, setSelectedPath] = useState<string[]>([]);

    useEffect(() => {
        onLayout('TB');
    }, [initialNodes, initialEdges]);

    const onLayout = useCallback((direction) => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);
        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
        fitView({ duration: 750, padding: 1 });
    }, [nodes, edges]);

    const selectedNode = useMemo(() => {
        return nodes?.find(n => n.id == selectedPath[selectedPath.length - 1]);
    }, [selectedPath])

    const moveToNode = useCallback((id: string) => {
        const node = nodes.find((n) => n.id === id);

        if(!node)
            return;

        const path = findPath(id, edges);
        setSelectedPath(path);

        const currentZoom = getZoom();
        const nodeCenterX = node.position.x;
        const nodeCenterY = node.position.y;

        setCenter(nodeCenterX, nodeCenterY, { zoom: currentZoom, duration: 750 });
    }, [getZoom, setCenter, nodes]);

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
        moveToNode,
        onExpandNode,
        getChildrenIds,
        onNodesChange,
        onEdgesChange
    };
}