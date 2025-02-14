import { createContext } from "react";
import { Node, Edge } from "@xyflow/react/dist/esm/types";

interface IFlowContext {
    nodes: Node[],
    edges: Edge[],
    direction: string,
    setDirection: React.Dispatch<React.SetStateAction<string>>
    selectedPath: string[],
    selectedNode?: Node,
    moveToNode: (nodeId: string) => void,
    onExpandNode: (id: string) => void,
    getChildrenIds: (nodeId: string) => string[]
}

export const FlowContext = createContext<IFlowContext>(undefined!);