export const treeRootId = "1";

export const initialTree = {
  1: {
    id: "1",
    name: "input",
    type: "input",
    children: ["2", "3", "44t"],
  },
  2: {
    id: "2",
    name: "node 2",
    parentId: "1",
    children: ["2a", "2b", "2c"],
  },
  "2a": {
    id: "2a",
    name: "node 2a",
    parentId: "2",
  },
  "2b": {
    id: "2b",
    name: "node 2b",
    parentId: "2",
  },
  "2c": {
    id: "2c",
    name: "node 2c",
    parentId: "2",
    children: ["2d"],
  },
  "2d": {
    id: "2d",
    name: "node 2d",
    parentId: "2c",
  },
  3: {
    id: "3",
    name: "node 3",
    parentId: "1",
    children: ["4", "5", "6t"],
  },
  4: {
    id: "4",
    name: "node 4",
    parentId: "3",
  },
  5: {
    id: "5",
    name: "node 5",
    parentId: "3",
    children: ["6", "7"],
  },
  6: {
    id: "6",
    name: "output",
    parentId: "5",
  },
  7: {
    id: "7",
    name: "output",
    parentId: "5",
  },
  "6t": {
    id: "6t",
    name: "6t",
    parentId: "3",
  },
  "44t": {
    id: "44t",
    name: "44",
    parentId: "1",
    children: ["44t1"],
  },
  "44t1": {
    id: "44t1",
    name: "44",
    parentId: "44t",
  },
};
