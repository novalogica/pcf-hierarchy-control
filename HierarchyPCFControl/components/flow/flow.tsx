import * as React from "react";
import { useMemo } from "react";
import { ReactFlow, MiniMap, Controls, Background } from "@xyflow/react";
import useTree from "../../hooks/useTree";
import NodeCard from "./node/node";
import { FlowContext } from "../../context/flow-context";
import SidePanel from "../panel/panel";

const nodeTypes = {
    card: NodeCard,
};

const Flow = () => {
    const { nodes, edges, selectedPath, moveToNode, onExpandNode, getChildrenIds } = useTree();

    const edgeList = useMemo(() => {
        return edges.map((edge) => {
            const isInPath = selectedPath.length === 0 || (selectedPath.includes(edge.source) && selectedPath.includes(edge.target));
            return {
                ...edge,
                style: {
                    stroke: isInPath && selectedPath.length > 0 ? 'rgba(65, 104, 189, 0.85)' : '#ccc',
                    strokeWidth: isInPath ? 3 : 1,
                },
            };
        });
    }, [edges, selectedPath])

    const nodeList = useMemo(() => nodes.filter((node) => !node.hidden), [nodes]);

    return (
        <FlowContext.Provider value={{nodes, edges, selectedPath, moveToNode, onExpandNode, getChildrenIds}}>
            <div style={styles.main} className="flow-container">
                <ReactFlow
                    nodes={nodeList}
                    edges={edgeList}
                    nodesDraggable={false}
                    edgesFocusable={false}
                    nodeTypes={nodeTypes}
                    proOptions={{ hideAttribution: true }}
                    fitView
                >
                    <MiniMap position="top-right"/>
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