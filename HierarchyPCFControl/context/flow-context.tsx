import { createContext } from "react";
import { Node, Edge } from "@xyflow/react";

interface IFlowContext {
    nodes: Node[],
    edges: Edge[],
    selectedPath: string[],
    moveToNode: (nodeId: string) => void,
    onExpandNode: (id: string) => void
    getChildrenIds: (nodeId: string) => string[]
}

export const FlowContext = createContext<IFlowContext>(undefined!);