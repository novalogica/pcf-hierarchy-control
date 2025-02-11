import * as React from "react";
import { IInputs } from "./generated/ManifestTypes";
import Flow from "./components/flow/flow";
import { ReactFlowProvider } from "@xyflow/react";
import '@xyflow/react/dist/style.css';

const App = ({ context }: { context: ComponentFramework.Context<IInputs> }) => {
    return (
        <ReactFlowProvider>
            <Flow />
        </ReactFlowProvider>
    );
}
 
export default App;