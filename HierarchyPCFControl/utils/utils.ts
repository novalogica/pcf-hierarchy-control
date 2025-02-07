import { graphlib, layout } from "@dagrejs/dagre";
import { type Node, type Edge, Position } from '@xyflow/react';

export const nodeWidth = 350;
export const nodeHeight = 200;

export const getLayoutedElements = (graph: graphlib.Graph, nodes: Node[], edges: Edge[]): { positionedNodes: Node[], positionedEdges: Edge[]} => {
    nodes.forEach(node => {
        graph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach(edge => {
        if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
            graph.setEdge(edge.source, edge.target, {});
        }
    });

    if (graph.nodeCount() === 0) {
        return { positionedNodes: nodes, positionedEdges: edges };
    }

    try {
        layout(graph);
    } catch (error) {
        return { positionedNodes: nodes, positionedEdges: edges };
    }

    const positionedNodes = nodes.map(node => {
        const nodePositioned = graph.node(node.id);
        if (!nodePositioned || nodePositioned.x === undefined || nodePositioned.y === undefined) {
            return node; 
        }
        return {
            ...node,
            targetPosition: Position.Top,
            sourcePosition: Position.Bottom,
            position: {
                x: nodePositioned.x - nodeWidth / 2,
                y: nodePositioned.y - nodeHeight / 2,
            },
        };
    });

    const positionedEdges = edges.map(edge => {
        const edgeLayout = graph.edge(edge.source, edge.target);
        if (!edgeLayout || !edgeLayout.points) {
            return edge;
        }
        return {
            ...edge,
            points: edgeLayout.points,
        };
    });

    return { positionedNodes, positionedEdges };
};

export const findPath = (nodeId: string, edges: Edge[]): string[] => {
    return edges.reduce((path, _) => {
        const edge = edges.find((e) => e.target === (path[0] || nodeId));
        return edge ? [edge.source, ...path] : path;
    }, [nodeId]);
};