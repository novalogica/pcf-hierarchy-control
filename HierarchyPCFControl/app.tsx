import * as React from "react";
import { IInputs } from "./generated/ManifestTypes";
import Flow from "./components/flow/flow";
import { ReactFlowProvider } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import { ControlContext } from "./context/control-context";
import { useDataverse } from "./hooks/useDataverse";

interface IProps {
    context: ComponentFramework.Context<IInputs>,
    entityName?: string,
    id?: string
}

const App = ({ context, entityName, id }: IProps) => {
    const { nodes, edges, isLoading, error } = useDataverse(context, entityName, id);
    
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
