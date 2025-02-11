import { type Node, type Edge } from '@xyflow/react';

export const transformEntityToNodes = (data: ComponentFramework.WebApi.Entity[]) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const positionMap: { [key: string]: { x: number; y: number } } = {};

  data.forEach((item, index) => {
    const nodeId = item.accountid;
    const parentId = item._parentaccountid_value;

    const x = parentId ? (positionMap[parentId]?.x || 0) + 200 : 0;
    const y = index * 150;

    positionMap[nodeId] = { x, y };

    nodes.push({
      id: nodeId,
      position: { x, y },
      //parentId: parentId ?? undefined,
      data: {
        label: item.name,
        expanded: true,
        ...item,
      },
      type: "card",
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