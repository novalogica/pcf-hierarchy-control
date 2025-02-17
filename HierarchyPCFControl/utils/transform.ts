import { Edge, Node } from "@xyflow/react/dist/esm/types";
import { Column, RelationshipInfo } from '../interfaces/entity';
import { findPath } from './utils';
import { nodeLengthLimit } from './constants';

export const transformEntityToNodes = (currentRecordId: string, data: ComponentFramework.WebApi.Entity[], columns: Column[], relationship: RelationshipInfo, primaryNameAttribute: string) => {
  let nodes: Node[] = [];
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

  if(nodes && nodes.length > nodeLengthLimit) {
    nodes = collapseHierarchyBasedOnNodesLength(currentRecordId, nodes, edges);
  }
    
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
      } else {
        value = entity[`${c.logicalName}@OData.Community.Display.V1.FormattedValue`] ?? entity[`${c.logicalName}`] ?? "-"
      }

      acc[c.logicalName] = {
        displayName: c.displayName,
        value
      };

      return acc;
}, {} as Record<string, { displayName: string; value?: string | number | boolean | ComponentFramework.LookupValue | null }>);

const collapseHierarchyBasedOnNodesLength = (currentRecordId: string, nodes: Node[], edges: Edge[]): Node[] => {
  const path = findPath(currentRecordId, edges);
  const visibleNodes = new Set<string>(path);

  nodes.forEach((node) => {
    if (path.includes(node.id) && node.data.parentId) {
      nodes.forEach((sibling) => {
        if (sibling.data.parentId === node.data.parentId) {
          visibleNodes.add(sibling.id);
        }
      });
    }
  });

  return nodes.map((n) => ({
    ...n,
    hidden: !visibleNodes.has(n.id),
    data: {
      ...n.data,
      expanded: visibleNodes.has(n.id) && path.includes(n.id),
    },
  }));
};
