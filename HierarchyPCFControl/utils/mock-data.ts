import { type Node, type Edge } from '@xyflow/react';

const initialNodes: Node[] = [
    {
      id: "1",
      position: { x: 0, y: 0 },
      data: { label: "Product Marketing", expanded: true },
      type: 'card'
    },
    {
      id: "2",
      position: { x: 0, y: 150 },
      data: { label: "Advertising", parentId: "1", expanded: true },
      type: 'card'
    },
    {
      id: "3a",
      position: { x: 0, y: 300 },
      data: { label: "Amazon Advertising", parentId: "2", expanded: true },
      type: 'card',
    },
    {
      id: "3b",
      position: { x: 0, y: 450 },
      data: { label: "Google Advertising", parentId: "2", expanded: true },
      type: 'card',
    },
    {
      id: "4b",
      position: { x: 0, y: 450 },
      data: { label: "Google Advertising 2", parentId: "3b", expanded: true },
      type: 'card'
    },
];

const initialEdges: Edge[] = [
    { id: "e1-2", source: "1", target: "2", animated: true, type: 'smoothstep' },
    { id: "e1-3", source: "2", target: "3a", animated: true, type: 'smoothstep' },
    { id: "e1-4", source: "2", target: "3b", animated: true, type: 'smoothstep' },
    { id: "e1-5", source: "3b", target: "4b", animated: true, type: 'smoothstep' },
]

export {
    initialNodes,
    initialEdges,
}