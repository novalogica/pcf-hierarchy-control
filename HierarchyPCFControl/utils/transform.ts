import { type Node, type Edge, Position } from '@xyflow/react';

import { Column, RelationshipInfo } from '../interfaces/entity';

export const transformEntityToNodes = (data: ComponentFramework.WebApi.Entity[], columns: Column[], relationship: RelationshipInfo, primaryNameAttribute: string) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  data.forEach((item) => {
    const nodeId = item[relationship.ReferencedAttribute];
    const parentId = item[`_${relationship.ReferencingAttribute}_value`];

    nodes.push({
      id: nodeId,
      
      data: {
        label: item[primaryNameAttribute],
        expanded: true,
        parentId: parentId ?? undefined,
        attributes: createAttributeList(item, columns, relationship.ReferencedAttribute, relationship.ReferencingAttribute, primaryNameAttribute),
      },
      type: "card",
      position: { x: 0, y: 0 }
    });

    if (parentId) {
      edges.push({
        id: `e${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        animated: true,
        type: "smoothstep",
      });
    }
  });

  return { nodes, edges };
}

export const createAttributeList = (entity: any, columns: any[], referencedAttribute: string, referencingAttr: string, primaryKeyColumn: string) => 
  columns
    .filter(c => 
        c.logicalName !== referencedAttribute 
        && c.logicalName !== referencingAttr 
        && c.logicalName !== primaryKeyColumn
        && c.displayName !== referencedAttribute 
        && c.displayName !== referencingAttr 
        && c.displayName !== primaryKeyColumn
    ).reduce((acc, c) => {
      let value;

      if ((c.attributeType === "Lookup" || c.attributeType === "Owner") && entity[c.logicalName]) {
        value = {
          id: entity[c.logicalName] ?? "",
          name: entity[`${c.logicalName}@OData.Community.Display.V1.FormattedValue`] ?? "",
          entityType: entity[`${c.logicalName}@Microsoft.Dynamics.CRM.lookuplogicalname`] ?? ""
        } as ComponentFramework.LookupValue;
      } else if (c.attributeType === "Picklist") {
        value = entity[`${c.logicalName}@OData.Community.Display.V1.FormattedValue`] ?? ""
      } else {
        value = entity[c.logicalName] ?? "-";
      }

      acc[c.logicalName] = {
        displayName: c.displayName,
        value
      };

      return acc;
}, {} as Record<string, { displayName: string; value?: string | number | boolean | ComponentFramework.LookupValue | null }>);