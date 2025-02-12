/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edge, Position } from '@xyflow/react';
import { layoutFromMap } from 'entitree-flex';
import { nodeHeight, nodeWidth } from './constants';

enum Orientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

const entitreeSettings = {
  clone: false, // returns a copy of the input, if your application does not allow editing the original object
  enableFlex: false, // has slightly better perfomance if turned off (node.width, node.height will not be read)
  firstDegreeSpacing: 50, // spacing in px between nodes belonging to the same source, eg children with same parent
  nextAfterAccessor: 'spouses', // the side node prop used to go sideways, AFTER the current node
  nextAfterSpacing: 25, // the spacing of the "side" nodes AFTER the current node
  nextBeforeAccessor: 'siblings', // the side node prop used to go sideways, BEFORE the current node
  nextBeforeSpacing: 25, // the spacing of the "side" nodes BEFORE the current node
  nodeHeight, // default node height in px
  nodeWidth, // default node width in px
  orientation: Orientation.Vertical, // "vertical" to see parents top and children bottom, "horizontal" to see parents left and
  rootX: 0, // set root position if other than 0
  rootY: 275, // set root position if other than 0
  secondDegreeSpacing: 100, // spacing in px between nodes not belonging to same parent eg "cousin" nodes
  sourcesAccessor: 'parents', // the prop used as the array of ancestors ids
  sourceTargetSpacing: 15, // the "vertical" spacing between nodes in vertical orientation, horizontal otherwise
  targetsAccessor: 'children', // the prop used as the array of children ids
};

const { Top, Bottom, Left, Right } = Position;

export const layoutElements = (treeData: any, rootId: any, direction = 'TB') => {
  const isTreeHorizontal = direction === 'LR';

  const { nodes: entitreeNodes, rels: entitreeEdges } = layoutFromMap(
    rootId,
    treeData,
    {...entitreeSettings, orientation: isTreeHorizontal ? Orientation.Horizontal : Orientation.Vertical },
  );

  const nodes: any[] = [], edges: any[] = [];

  entitreeEdges.forEach((edge: any) => {
    const sourceNode = edge.source.id;
    const targetNode = edge.target.id;

    const newEdge: Edge = {
      id: 'e' + sourceNode + targetNode,
      source: sourceNode,
      target: targetNode,
      type: 'smoothstep',
      animated: true,
    };

    const isTargetSpouse = !!edge.target.isSpouse;
    const isTargetSibling = !!edge.target.isSibling;

    if (isTargetSpouse) {
      newEdge.sourceHandle = isTreeHorizontal ? Bottom : Right;
      newEdge.targetHandle = isTreeHorizontal ? Top : Left;
    } else if (isTargetSibling) {
      newEdge.sourceHandle = isTreeHorizontal ? Top : Left;
      newEdge.targetHandle = isTreeHorizontal ? Bottom : Right;
    } else {
      newEdge.sourceHandle = isTreeHorizontal ? Right : Bottom;
      newEdge.targetHandle = isTreeHorizontal ? Left : Top;
    }
 
    edges.push(newEdge);
  });
 
  entitreeNodes.forEach((node) => {
    let newNode: any = {};
 
    const isSpouse = !!(node as any)?.isSpouse;
    const isSibling = !!(node as any)?.isSibling;
    const isRoot = (node as any)?.id === rootId;
 
    if (isSpouse) {
      newNode.sourcePosition = isTreeHorizontal ? Bottom : Right;
      newNode.targetPosition = isTreeHorizontal ? Top : Left;
    } else if (isSibling) {
      newNode.sourcePosition = isTreeHorizontal ? Top : Left;
      newNode.targetPosition = isTreeHorizontal ? Bottom : Right;
    } else {
      newNode.sourcePosition = isTreeHorizontal ? Right : Bottom;
      newNode.targetPosition = isTreeHorizontal ? Left : Top;
    }

    newNode = {
      ...newNode,
      id: (node as any).id,
      parentId: (node as any).parentId,
      data: { 
        ...node,
        label: (node as any).name, 
        direction, 
        isRoot,
        expanded: true, 
      },
      type: 'card',
      width: nodeWidth,
      height: nodeHeight,
      position: {
        x: node.x,
        y: node.y,
      }
    }

    nodes.push(newNode);
  });

  return { nodes, edges };
};