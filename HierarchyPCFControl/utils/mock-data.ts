import { type Node, type Edge } from '@xyflow/react';

const generateNodesAndEdges = (levels: number, childrenPerNode: number) => {
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];
  let idCounter = 1;
  let previousLevelIds = [];
  
  const rootNode = { id: "1", position: { x: 0, y: 0 }, data: { label: "Root" }, type: 'card' };

  initialNodes.push(rootNode);
  previousLevelIds.push("1");
  idCounter++;

  for (let level = 1; level <= levels; level++) {
      const currentLevelIds: string[] = [];
      const yPos = level * 150;

      previousLevelIds.forEach(parentId => {
          for (let i = 0; i < childrenPerNode; i++) {
              const newId = idCounter.toString();
              const node = {
                  id: newId,
                  position: { x: 0, y: 0 },
                  data: { label: `Node ${newId}` },
                  type: 'card'
              };
              initialNodes.push(node);
              initialEdges.push({ id: `e${parentId}-${newId}`, source: parentId, target: newId, animated: true, type: 'smoothstep' });
              currentLevelIds.push(newId);
              idCounter++;
          }
      });

      previousLevelIds = currentLevelIds;
  }
  return { initialNodes, initialEdges };
}

const { initialNodes, initialEdges } = generateNodesAndEdges(5, 2)

export {
    initialNodes ,
    initialEdges
}