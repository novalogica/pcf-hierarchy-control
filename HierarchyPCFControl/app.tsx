import * as React from "react";
import { IInputs } from "./generated/ManifestTypes";
import HierarchyFlow from "./components/flow/flow";
import { useEffect, useMemo, useState } from "react";
import { graphlib, layout } from "@dagrejs/dagre";
import { NodeMouseHandler, ReactFlowInstance, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { type Node, type Edge } from '@xyflow/react';
import { FlowContext } from "./context/flow-context";
import { initialEdges, initialNodes } from "./utils/mock-data";
import { findPath, getLayoutedElements, nodeHeight, nodeWidth } from "./utils/utils";

export const graph = new graphlib.Graph().setDefaultNodeLabel(() => ({})).setGraph({ rankdir: "TB" });

const App = ({ context }: { context: ComponentFramework.Context<IInputs> }) => {
    const [flow, setFlow] = useState<ReactFlowInstance | null>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
    const [edges, setEdges] = useEdgesState([] as Edge[]); 
    const [selectedPath, setSelectedPath] = useState<string[]>([]);
    
    useEffect(() => {
        const {positionedNodes, positionedEdges} = getLayoutedElements(graph, initialNodes, initialEdges);
        setNodes(positionedNodes);
        setEdges(positionedEdges);
    }, [context])

    const visibleNodes = useMemo(() => {
        return nodes?.map((node) => {
            const isVisible = selectedPath.length === 0 || selectedPath.includes(node.id);
            return {
                ...node,
                hidden: !isVisible,
            };
        });
    }, [nodes, selectedPath]);

    const visibleEdges = useMemo(() => {
        return edges?.map((edge) => {
            const isInPath = selectedPath.length === 0 || (selectedPath.includes(edge.source) && selectedPath.includes(edge.target));
            return {
                ...edge,
                hidden: !isInPath,
                style: {
                    stroke: isInPath && selectedPath.length > 0 ? '#0f6cbd' : '#ccc',
                    strokeWidth: isInPath ? 6 : 4
                },
            };
        });
    }, [edges, selectedPath]);

    const onNodeClick: NodeMouseHandler = (event, node) => {
        if (!flow) return;

        const path = findPath(node.id, edges);
        setSelectedPath(path);

        const currentZoom = flow.getZoom();
        const nodeCenterX = node.position.x + nodeWidth / 2;
        const nodeCenterY = node.position.y + nodeHeight / 2;

        flow.setCenter(nodeCenterX, nodeCenterY, {
            zoom: currentZoom,
            duration: 500,
        });
    };

    const onExpandClick = (node: Node, status: 'expanded' | 'collapsed') => {
        
    }

    return (
        <div style={styles.main}>
            <FlowContext.Provider value={{ 
                context, 
                nodes: visibleNodes, 
                edges: visibleEdges, 
                setFlow,
                selectedPath,
                onNodesChange,
                onNodeClick,
                onExpandClick,
            }}>
                <HierarchyFlow />
            </FlowContext.Provider>
        </div>
    );
}

export default App;

const styles: Record<string, React.CSSProperties> = {
    main: { width: '100%' }
}