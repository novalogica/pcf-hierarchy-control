import { type Node } from '@xyflow/react';

type NodeData = { 
    parentId: string | null,
    expanded: boolean,
    label: string
};

export type NodeRecord = Node<NodeData>;