import { useCallback, useEffect, useState } from "react";
import ELK from "elkjs/lib/elk.bundled.js";
import { Edge, Node, useReactFlow } from "@xyflow/react";
import { findPath, nodeHeight, nodeWidth } from "../utils/utils";
import { initialEdges, initialNodes } from "../utils/mock-data";

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

const getLayoutedNodes = async (nodes: Node[], edges: Edge[]) => {
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
};

export default function useTree() {
    const { fitView, getZoom, setCenter } = useReactFlow();
    const [nodes, setNodes] = useState(initialNodes);
    const [edges] = useState(initialEdges);
    const [needsAutoLayout, setNeedsAutoLayout] = useState(true);
    const [selectedPath, setSelectedPath] = useState<string[]>([]);

    useEffect(() => {
        const centerNodes = async () => {
            if (needsAutoLayout) {
                await applyAutoLayout(nodes, edges);
                setNeedsAutoLayout(false);
            }
        };

        centerNodes();
    }, [needsAutoLayout]);

    const applyAutoLayout = useCallback(async (nodes: Node[], edges: Edge[]) => {
        const layoutedNodes = await getLayoutedNodes(nodes, edges);
        setNodes(layoutedNodes);
        fitView({ duration: 750, padding: 1 });
    }, [setNodes, fitView]);

    const moveToNode = useCallback((id: string) => {
        const node = nodes.find((n) => n.id === id);

        if(!node)
            return;

        const path = findPath(id, edges);
        setSelectedPath(path);

        const currentZoom = getZoom();
        const nodeCenterX = node.position.x + nodeWidth / 2;
        const nodeCenterY = node.position.y + nodeHeight / 2;

        setCenter(nodeCenterX, nodeCenterY, { zoom: currentZoom, duration: 500 });
    }, [getZoom, setCenter]);

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
        applyAutoLayout,
        moveToNode,
        onExpandNode,
        getChildrenIds
    };
}