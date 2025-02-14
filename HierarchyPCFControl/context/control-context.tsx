import { createContext } from "react";
import { IInputs } from "../generated/ManifestTypes";

interface IControlContext {
    context: ComponentFramework.Context<IInputs>,
    entityName: string
    entityId: string
}

export const ControlContext = createContext<IControlContext>(undefined!);