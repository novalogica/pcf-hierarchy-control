import { useMemo } from "react";
import { IInputs } from "../generated/ManifestTypes"
import EntityDefinition from "../interfaces/entity/definition";
import { XrmService } from "./service";

export const useDataverse = (context: ComponentFramework.Context<IInputs>, entityName: string, id: string) => {
    const xrmService = useMemo(() => XrmService.getInstance(), [context]);
    
    const fetchAttributes = async (): Promise <EntityDefinition[]> => {
        const result = await xrmService.fetch(
            `api/data/v9.1/EntityDefinitions(LogicalName='${entityName}')/Attributes?$select=LogicalName,AttributeType,DisplayName&$filter=AttributeOf eq null&$orderby=DisplayName asc`,
        ) as EntityDefinition[];

        return result
    }

    return {
        
    }
}