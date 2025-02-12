import * as React from "react";
import { useLayoutEffect, useMemo } from "react";
import { ReactFlow, MiniMap, Controls, Background } from "@xyflow/react";
import { Node } from "@xyflow/react/dist/esm/types/nodes";
import { Edge } from "@xyflow/react/dist/esm/types/edges";
import { FlowContext } from "../../context/flow-context";
import useTree from "../../hooks/useTree";
import NodeCard from "./node/node";
import SidePanel from "../panel/panel";
import { colors } from "../../utils/constants";
import { getNodeColor } from "../../utils/utils";

interface IProps {
    initialNodes: Node[],
    initialEdges: Edge[]
}

const Flow = ({ initialNodes, initialEdges }: IProps) => {
    const { nodes, edges, selectedPath, selectedNode, moveToNode, onExpandNode, getChildrenIds, onNodesChange, onEdgesChange, onLayout } = useTree(initialNodes, initialEdges);

    const edgeList = useMemo(() => {
        return edges?.map((edge) => {
            const isInPath = selectedPath.length === 0 || (selectedPath.includes(edge.source) && selectedPath.includes(edge.target));
            return {
                ...edge,
                style: {
                    stroke: isInPath && selectedPath.length > 0 ? colors.active85 : colors.inactive,
                    strokeWidth: isInPath ? 3 : 1,
                },
            };
        }) ?? [];
    }, [edges, selectedPath])

    const nodeList = useMemo(() => nodes?.filter((node) => !node.hidden) ?? [], [nodes]);

    useLayoutEffect(() => {
        onLayout({ useInitialNodes: true });
    }, []);

    return (
        <FlowContext.Provider value={{nodes, edges, selectedPath, selectedNode, moveToNode, onExpandNode, getChildrenIds}}>
            <div style={styles.main}>
                <ReactFlow
                    nodes={nodeList}
                    edges={edgeList}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={{ card: NodeCard }}
                    proOptions={{ hideAttribution: true }}
                    nodesDraggable={false}
                    edgesFocusable={false}
                    fitView
                >
                    <MiniMap position="top-right" nodeColor={(node) => getNodeColor(node, selectedPath)} nodeBorderRadius={16} />
                    <Controls position="bottom-right"/>
                    <Background gap={16} />
                </ReactFlow>
                <SidePanel />
            </div>
        </FlowContext.Provider>
    );
};

export default Flow;

const styles: Record<string, React.CSSProperties> = {
    main: {
        width: "100%",
        height: "95vh",
    },
};