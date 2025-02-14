import * as React from "react";
import { IInputs } from "./generated/ManifestTypes";
import Flow from "./components/flow/flow";
import { ReactFlowProvider } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import { ControlContext } from "./context/control-context";
import { useDataverse } from "./hooks/useDataverse";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";

interface IProps {
    context: ComponentFramework.Context<IInputs>,
    entityName?: string,
    entityId?: string
}

const App = ({ context, entityName, entityId }: IProps) => {
    const { nodes, edges, isLoading, error, forms, activeForm, setActiveForm } = useDataverse(context, entityName, entityId);

    if(!entityName || !entityId) {
        return <p>Error compiling entity name or record id</p>
    }

    if(error) {
        return (
            <div style={styles.boundaryContainer}>
                {error}
            </div>
        )
    }

    if(isLoading && !error) {
        return (
            <div style={styles.boundaryContainer}>
                <Spinner label={context.resources.getString("loading-message")} size={SpinnerSize.large} />
            </div>
        ) 
    }

    return (
        <ControlContext.Provider value={{context, entityName, entityId, forms, activeForm, setActiveForm}}>
            <ReactFlowProvider>
                <Flow initialNodes={nodes} initialEdges={edges}/>
            </ReactFlowProvider>
        </ControlContext.Provider>
    );
}

export default App;

const styles: { [key: string]: React.CSSProperties } = {
    boundaryContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16
    }
}
