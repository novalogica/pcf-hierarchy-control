import { useMemo, useState, useEffect } from "react";
import { IInputs } from "../generated/ManifestTypes"
import EntityDefinition from "../interfaces/entity/definition";
import { XrmService } from "./service";
import { EntityMetadata, Form, RelationshipInfo } from "../interfaces/entity";
import { Node } from "@xyflow/react/dist/esm/types/nodes";
import { Edge } from "@xyflow/react/dist/esm/types/edges";
import { initialEdges, initialNodes } from "../utils/mock-data";
import { extractColumns } from "../utils/form";

export const useDataverse = (context: ComponentFramework.Context<IInputs>, entityName?: string, id?: string) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<unknown | undefined>(undefined);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [forms, setForms] = useState<Form[]>([]);
    const [activeForm, setActiveForm] = useState<Form | undefined>(undefined);
    const [metadata, setMetadata] = useState<EntityMetadata | null>(null);
    const [relationship, setRelationship] = useState<RelationshipInfo | null>(null);
    const [attributes, setAttributes] = useState<EntityDefinition[] | null>(null);

    const xrmService = useMemo(() => XrmService.getInstance(), [context]);

    useEffect(() => {
        if(!entityName || !id)
            return;

        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const attributes = await fetchAttributes();
            setAttributes(attributes);

            const [metadata, relationship] = await fetchEntityMetadata();
            setMetadata(metadata);
            setRelationship(relationship);

            const forms = await fetchQuickViewForms(relationship!, attributes, metadata);
            setForms(forms);

            const activeForm = forms.find((f) => f.isActive == true);
            setActiveForm(activeForm);
        } catch (e: unknown) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    }

    useMemo(() => {
        const columns = activeForm?.columns.map((c) => c.logicalName).join(",");

        if(!columns)
            throw new Error("Form does not contain any column.");

        fetchHierarchy(columns);
    }, [activeForm])

    const fetchAttributes = async (): Promise <EntityDefinition[]> => {
        const query = `api/data/v9.1/EntityDefinitions(LogicalName='${entityName}')/Attributes?$select=LogicalName,AttributeType,DisplayName&$filter=AttributeOf eq null&$orderby=DisplayName asc`;
        const result = (await xrmService.fetch(query)) as EntityDefinition[];
        return result
}

    const fetchQuickViewForms = async (relationship: RelationshipInfo, attributes: EntityDefinition[], metadata: EntityMetadata): Promise<Form[]> => {
        const result = (await context.webAPI.retrieveMultipleRecords("systemform", `?$filter=objecttypecode eq '${entityName}' and type eq 6`));

        if (!result.entities || result.entities.length <= 0) 
            throw new Error("No card form found for this entity.");

        const forms: Form[] = result.entities.map((f, index) => {
            return {
                formId: f.formid,
                label: f.name,
                columns: extractColumns(f.formxml, relationship, attributes, metadata),
                isActive: (f.name.includes("Hierarchy") || index == 0)
            }
        })

        return forms;
    }

    const fetchEntityMetadata = async (): Promise<[EntityMetadata, RelationshipInfo | null]> => {
        const metadata = await context.utils.getEntityMetadata(entityName!) as EntityMetadata;

        const hierarchicalRelationship = Object.values(metadata._entityDescriptor.OneToManyRelationships)
                .find((rel) => rel.IsHierarchical);

        if (!hierarchicalRelationship) 
            throw new Error("Hierarchical relationship not found.");

        return [metadata, hierarchicalRelationship ?? null];
    }

    const fetchHierarchy = async (columns: string): Promise<ComponentFramework.WebApi.Entity> => {
        if(!relationship)
            return [];

        const { ReferencedAttribute, ReferencingAttribute } = relationship;

        const parentResult = await context.webAPI.retrieveMultipleRecords(
            entityName!,
            `?$filter=(Microsoft.Dynamics.CRM.Above(PropertyName='${ReferencedAttribute}',PropertyValue='${id}') and _${ReferencingAttribute}_value eq null)&$select=${columns}`
        );

        const topParent = parentResult.entities[0];

        const result = await context.webAPI.retrieveMultipleRecords(
            entityName!,
            `?$filter=Microsoft.Dynamics.CRM.UnderOrEqual(PropertyName='${ReferencedAttribute}',PropertyValue='${topParent[ReferencedAttribute]}')&$select=${attributes}`
        );

        const nodes = [topParent, ...result.entities];
        console.log(nodes);
        return nodes;
    }

    return {
        nodes,
        edges,
        isLoading,
        error
    }
}