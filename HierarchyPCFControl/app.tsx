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
    entityId?: string
}

const App = ({ context, entityName, entityId }: IProps) => {
    const { nodes, edges, isLoading, error } = useDataverse(context, entityName, entityId);

    if(!entityName || !entityId) {
        return <p>Error compiling entity name or record id</p>
    }
    
    return (
        <ControlContext.Provider value={{context, entityName, entityId}}>
            { isLoading && !error && <p>{context.resources.getString("loading-message")}</p> }
            {
                !isLoading && !error && (
                    <ReactFlowProvider>
                        <Flow initialNodes={nodes} initialEdges={edges}/>
                    </ReactFlowProvider>
                )
            }
            {
                error && <p>{error}</p>
            }
        </ControlContext.Provider>
    );
}

export default App;
