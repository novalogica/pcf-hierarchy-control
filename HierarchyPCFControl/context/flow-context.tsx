import { createContext } from "react";
import { type Node, type Edge, OnNodesChange } from '@xyflow/react';

interface IFlowContext {
    nodes: Node[],
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
    edges: Edge[],
    onNodesChange: OnNodesChange<Node>,
    selectedPath: string[],
    setSelectedPath: React.Dispatch<React.SetStateAction<string[]>>
}

export const FlowContext = createContext<IFlowContext>(undefined!);