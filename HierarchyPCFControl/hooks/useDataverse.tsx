import { useMemo, useState, useEffect } from "react";
import { Node, Edge } from "@xyflow/react/dist/esm/types";
import { IInputs } from "../generated/ManifestTypes"

import { Column, EntityMetadata, Form, RelationshipInfo, EntityDefinition } from "../interfaces/entity";
import { extractColumns, generateColumns } from "../utils/form";
import { transformEntityToNodes } from "../utils/transform";
import { XrmService } from "./service";

export const useDataverse = (context: ComponentFramework.Context<IInputs>, entityName?: string, id?: string) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(undefined);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [forms, setForms] = useState<Form[]>([]);
    const [activeForm, setActiveForm] = useState<Form | undefined>(undefined);

    const xrmService = useMemo(() => XrmService.getInstance(), [context]);

    useEffect(() => {
        if(!entityName || !id) return;
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const attributes = await fetchAttributes();
            const [metadata, relationship] = await fetchEntityMetadata();
            const forms = await fetchQuickViewForms(relationship, attributes, metadata);

            const activeForm = forms.find((f) => f.isActive == true);
            setForms(forms);
            setActiveForm(activeForm);

            if(!activeForm)
                throw Error(context.resources.getString("error-selecting-form"));

            const columns = generateColumns(forms);
            const { nodes, edges } = await fetchHierarchy(relationship, metadata, columns)
            setNodes(nodes);
            setEdges(edges);
        } catch (e: any) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchAttributes = async (): Promise <EntityDefinition[]> => {
        const query = `api/data/v9.1/EntityDefinitions(LogicalName='${entityName}')/Attributes?$select=LogicalName,AttributeType,DisplayName&$filter=AttributeOf eq null&$orderby=DisplayName asc`;
        const result = (await xrmService.fetch(query)) as EntityDefinition[];
        return result;
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

    const fetchEntityMetadata = async (): Promise<[EntityMetadata, RelationshipInfo]> => {
        const metadata = await context.utils.getEntityMetadata(entityName!) as EntityMetadata;

        const hierarchicalRelationship = Object.values(metadata._entityDescriptor.OneToManyRelationships)
                .find((rel) => rel.IsHierarchical);

        if (!hierarchicalRelationship) 
            throw new Error(context.resources.getString("error-hierarchical-relationship"));

        return [metadata, hierarchicalRelationship ?? null];
    }

    const fetchHierarchy = async (relationship: RelationshipInfo, metadata: EntityMetadata, columnList: Column[]) => {
        const columns = columnList.map((c) => c.logicalName).join(",");
        const { ReferencedAttribute, ReferencingAttribute } = relationship;

        const parentResult = await context.webAPI.retrieveMultipleRecords(
            entityName!,
            `?$filter=(Microsoft.Dynamics.CRM.Above(PropertyName='${ReferencedAttribute}',PropertyValue='${id}') and _${ReferencingAttribute}_value eq null)&$select=${columns}`
        );

        const topParent = parentResult.entities && parentResult.entities.length > 0 ? parentResult.entities[0][ReferencedAttribute] : id;

        const result = await context.webAPI.retrieveMultipleRecords(
            entityName!,
            `?$filter=Microsoft.Dynamics.CRM.UnderOrEqual(PropertyName='${ReferencedAttribute}',PropertyValue='${topParent}')&$select=${columns}`
        );

        return transformEntityToNodes(id!, result.entities, columnList, relationship, metadata._entityDescriptor.PrimaryNameAttribute);
    }

    return {
        isLoading,
        error,
        nodes,
        edges,
        forms,
        activeForm,
        setActiveForm
    }
}