import { createContext } from "react";
import { IInputs } from "../generated/ManifestTypes";

interface IControlContext {
    context: ComponentFramework.Context<IInputs>,
}

export const ControlContext = createContext<IControlContext>(undefined!);