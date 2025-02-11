import * as React from "react";
import { useState, useEffect } from "react";
import { IInputs } from "./generated/ManifestTypes";
import Flow from "./components/flow/flow";
import { Edge, ReactFlowProvider, Node } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import { ControlContext } from "./context/control-context";
import { initialEdges, initialNodes } from "./utils/mock-data";

const App = ({ context }: { context: ComponentFramework.Context<IInputs> }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(() => {
        setTimeout(() => {
            setNodes(initialNodes);
            setEdges(initialEdges);
            setIsLoading(false);
        }, 750);
    }, [])
    
    return (
        <ControlContext.Provider value={{context}}>
            { isLoading && <p>{context.resources.getString("loading-message")}</p> }
            {
                !isLoading && (
                    <ReactFlowProvider>
                        <Flow initialNodes={nodes} initialEdges={edges} />
                    </ReactFlowProvider>
                )
            }
        </ControlContext.Provider>
    );
}

export default App;
