import { createContext } from "react";
import { type Node, type Edge, OnNodesChange, NodeMouseHandler, ReactFlowInstance } from '@xyflow/react';
import { IInputs } from "../generated/ManifestTypes";

interface IFlowContext {
    context: ComponentFramework.Context<IInputs>,
    setFlow: React.Dispatch<React.SetStateAction<ReactFlowInstance | null>>
    nodes: Node[],
    edges: Edge[],
    onNodesChange: OnNodesChange<Node>,
    selectedPath: string[],
    onNodeClick: (event: React.MouseEvent<Element, MouseEvent>, node: Node<Record<string, unknown>, string>) => void
    onExpandClick: (node: Node, status: 'expanded' | 'collapsed') => void
}

export const FlowContext = createContext<IFlowContext>(undefined!);