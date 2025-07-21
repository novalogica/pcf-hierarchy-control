import * as React from "react";
import { memo, useContext, useEffect, useMemo, useState } from "react";
import { ReactFlow, MiniMap, Controls, Background, ConnectionLineType, Panel } from "@xyflow/react";
import { Node, Edge } from "@xyflow/react/dist/esm/types";
import { useReactFlow } from "@xyflow/react";

import { colors, nodeLengthLimit } from "../../utils/constants";
import { FlowDataContext, FlowSelectionContext } from "../../context/flow-context";
import { getNodeColor } from "../../utils/utils";
import useTree from "../../hooks/useTree";
import SidePanel from "../panel/panel";
import NodeCard from "./node/node";
import { ControlContext } from "../../context/control-context";
import useWindowDimensions from "../../hooks/useDimensions";

interface IProps {
    initialNodes: Node[],
    initialEdges: Edge[],
}

const Flow = memo(({ initialNodes, initialEdges }: IProps) => {
    const { context, entityName, entityId } = useContext(ControlContext);
    const { height, width } = useWindowDimensions();
    const [direction, setDirection] = useState('TB');
    const {
        nodes,
        edges,
        selectedPath,
        selectedNode,
        moveToNode,
        onExpandNode,
        getChildrenIds,
        onNodesChange,
    } = useTree(initialNodes, initialEdges, direction);

    const dataContextValue = useMemo(() => ({
        nodes,
        edges,
        moveToNode,
        onExpandNode,
        getChildrenIds,
        onNodesChange
    }), [nodes, edges, moveToNode, onExpandNode, getChildrenIds, onNodesChange]);

    const selectionContextValue = useMemo(() => ({
        selectedPath,
        selectedNode,
        direction,
        setDirection
    }), [selectedPath, selectedNode, direction, setDirection]);

    useEffect(() => {
        const node = nodes.find(n => n.id === entityId);
        if(node)
            document.title = `Hierarchy for ${entityName}: ${node.data.label}`;
    }, [nodes, entityId])

    const nodeList = useMemo(() => nodes.filter((node) => !node.hidden), [nodes]);
    const edgeList = useMemo(() => {
        return edges.map((edge) => {
            const isInPath = selectedPath.length === 0 || (selectedPath.includes(edge.source) && selectedPath.includes(edge.target));
            return {
                ...edge,
                style: {
                    stroke: isInPath && selectedPath.length > 0 ? colors.active85 : colors.inactive,
                    strokeWidth: isInPath ? 4 : 2,
                },
            };
        });
    }, [edges, selectedPath]);

    return (
        <FlowDataContext.Provider value={dataContextValue}>
            <FlowSelectionContext.Provider value={selectionContextValue}>
                <div style={{ width, height, display: 'flex', flexDirection: 'row' }}>
                    <SidePanel />
                    <ReactFlow
                        nodes={nodeList}
                        edges={edgeList}
                        nodeTypes={{ card: NodeCard }}
                        proOptions={{ hideAttribution: true }}
                        connectionLineType={ConnectionLineType.SmoothStep}
                        nodesDraggable={false}
                        edgesFocusable={false}
                        onNodesChange={onNodesChange}
                        minZoom={0.05}
                        fitView
                    >
                        { 
                            initialNodes && initialNodes.length <= nodeLengthLimit && (
                                <MiniMap pannable position="top-right" nodeColor={(node) => getNodeColor(node, selectedPath)} nodeBorderRadius={16} />
                            ) 
                        }
                        <Controls 
                            position="bottom-right" 
                            showInteractive={false} 
                            showFitView={initialNodes && initialNodes.length <= nodeLengthLimit} 
                        />
                        <Background gap={16} />
                        
                    </ReactFlow>
                </div>
            </FlowSelectionContext.Provider>
        </FlowDataContext.Provider>
    );
});

Flow.displayName = "Flow"
export default Flow;

const styles: Record<string, React.CSSProperties> = {
    panel: {
        bottom: 32
    }
};