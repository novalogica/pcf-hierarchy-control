import { Node } from "@xyflow/react/dist/esm/types/nodes";

type NodeData = { 
    parentId: string | null,
    expanded: boolean,
    label: string
};

export type NodeRecord = Node<NodeData>;