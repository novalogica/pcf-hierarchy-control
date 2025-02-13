import { type Node, type Edge, Position } from '@xyflow/react';

import { RelationshipInfo } from '../interfaces/entity';

export const transformEntityToNodes = (data: ComponentFramework.WebApi.Entity[], relationship: RelationshipInfo, primaryNameAttribute: string) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  data.forEach((item, index) => {
    const nodeId = item[relationship.ReferencedAttribute];
    const parentId = item[`_${relationship.ReferencingAttribute}_value`];

    nodes.push({
      id: nodeId,
      
      data: {
        label: item[primaryNameAttribute],
        expanded: true,
        parentId: parentId ?? undefined,
        ...item,
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