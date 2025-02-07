import { type Node, type Edge } from '@xyflow/react';

type NodeData = { 
    parentId: string | null
    [id: string]: string | number | object | null
};

export type NodeRecord = Node<NodeData>;