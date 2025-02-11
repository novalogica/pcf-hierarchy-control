import { type Edge } from '@xyflow/react';

export const nodeWidth = 350;
export const nodeHeight = 300;

export const findPath = (nodeId: string, edges: Edge[]): string[] => {
    return edges.reduce((path, _) => {
        const edge = edges.find((e) => e.target === (path[0] || nodeId));
        return edge ? [edge.source, ...path] : path;
    }, [nodeId]);
};