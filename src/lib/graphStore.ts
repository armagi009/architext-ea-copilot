import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
export interface GraphState {
  nodes: Node[];
  edges: Edge[];
  version: number;
  setGraphData: (nodes: Node[], edges: Edge[]) => void;
  validateNode: (nodeId: string) => void;
  resetGraph: () => void;
}
export const useGraphStore = create<GraphState>((set) => ({
  nodes: [],
  edges: [],
  version: 1,
  setGraphData: (nodes, edges) => set({ nodes, edges, version: 1 }),
  validateNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, validated: true } }
          : node
      ),
      version: state.version + 1,
    })),
  resetGraph: () => set({ nodes: [], edges: [], version: 1 }),
}));
// Primitive selectors for performance
export const useGraphNodes = () => useGraphStore((state) => state.nodes);
export const useGraphEdges = () => useGraphStore((state) => state.edges);
export const useGraphActions = () => useGraphStore((state) => ({
    setGraphData: state.setGraphData,
    validateNode: state.validateNode,
    resetGraph: state.resetGraph,
}));