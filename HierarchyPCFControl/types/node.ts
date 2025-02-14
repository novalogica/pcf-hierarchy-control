import { Node } from "@xyflow/react/dist/esm/types/nodes";

type NodeData = { 
    parentId: string | null,
    expanded: boolean,
    label: string
    attributes?: Attribute;
}

type Attribute = {
    [key: string]: any;
}

export type NodeRecord = Node<NodeData>;