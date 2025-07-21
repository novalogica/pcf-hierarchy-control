import { createContext } from "react";
import { IInputs } from "../generated/ManifestTypes";
import { Form } from "../interfaces/entity";

interface IControlContext {
    context: ComponentFramework.Context<IInputs>,
    entityName: string
    entityId: string,
    forms: Form[],
    activeForm: Form | undefined,
    setActiveForm: React.Dispatch<React.SetStateAction<Form | undefined>>
}

export const ControlContext = createContext<IControlContext>(undefined!);