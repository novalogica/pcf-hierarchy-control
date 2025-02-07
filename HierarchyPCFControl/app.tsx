import * as React from "react";
import { IInputs } from "./generated/ManifestTypes";
import HierarchyFlow from "./components/flow/flow";
import { useEffect, useState } from "react";
import { graphlib } from "@dagrejs/dagre";
import { useEdgesState, useNodesState } from "@xyflow/react";
import { type Node, type Edge } from '@xyflow/react';
import { FlowContext } from "./context/flow-context";
import { initialEdges, initialNodes } from "./utils/mock-data";
import { getLayoutedElements } from "./utils/utils";
import { } from "@fluentui/react";

export const graph = new graphlib.Graph().setDefaultNodeLabel(() => ({})).setGraph({ rankdir: "TB" });

const App = ({ context }: { context: ComponentFramework.Context<IInputs> }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
    const [edges, setEdges] = useEdgesState([] as Edge[]); 
    const [selectedPath, setSelectedPath] = useState<string[]>([]);
    
    useEffect(() => {
        const {positionedNodes, positionedEdges} = getLayoutedElements(graph, initialNodes, initialEdges);
        setNodes(positionedNodes);
        setEdges(positionedEdges);
    }, [context])

    return (
        <div style={styles.main}>
            <FlowContext.Provider value={{nodes, setNodes, edges, selectedPath, setSelectedPath, onNodesChange}}>
                <HierarchyFlow />
            </FlowContext.Provider>
        </div>
    );
}
 
export default App;

const styles: Record<string, React.CSSProperties> = {
    main: {
      width: '100%', 
      height: '100vh',
    }
}