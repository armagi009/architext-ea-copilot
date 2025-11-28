import { create } from 'zustand';
import { chatService } from './chat';
import { toast } from 'sonner';
interface Initiative {
  id: string;
  name: string;
  wave: string;
  cost: number; // in thousands
  risk: 'Low' | 'Medium' | 'High';
  dependencies: string[];
  isCompliant: boolean;
}
const mockInitiatives: Initiative[] = [
  { id: '1', name: 'Deploy Core Infra (Wave 1)', wave: 'Wave 1', cost: 150, risk: 'Low', dependencies: [], isCompliant: true },
  { id: '2', name: 'Migrate Non-Critical Apps', wave: 'Wave 1', cost: 200, risk: 'Low', dependencies: ['1'], isCompliant: true },
  { id: '3', name: 'SAP S/4HANA Lift & Shift', wave: 'Wave 2', cost: 500, risk: 'High', dependencies: ['1'], isCompliant: false },
  { id: '4', name: 'Integrate Salesforce', wave: 'Wave 2', cost: 250, risk: 'Medium', dependencies: ['3'], isCompliant: true },
  { id: '5', name: 'Decommission Legacy Systems', wave: 'Wave 3', cost: 100, risk: 'Medium', dependencies: ['2', '4'], isCompliant: true },
];
export interface RoadmapState {
  initiatives: Initiative[];
  version: number;
}
export interface RoadmapActions {
  setInitiatives: (initiatives: Initiative[]) => void;
  optimizeRoadmap: () => Promise<void>;
  exportToJSON: () => void;
  exportToCSV: () => void;
}
export const useRoadmapStore = create<RoadmapState>((set) => ({
  initiatives: mockInitiatives,
  version: 1,
}));
export const useRoadmapActions = (): RoadmapActions => {
  const { initiatives } = useRoadmapStore.getState();
  const setInitiatives = (newInitiatives: Initiative[]) => {
    useRoadmapStore.setState(state => ({ initiatives: newInitiatives, version: state.version + 1 }));
  };
  const optimizeRoadmap = async () => {
    const prompt = `Given these initiatives, optimize the roadmap for quick wins and risk mitigation. Current state: ${JSON.stringify(initiatives)}`;
    // In a real app, we'd parse the AI response. Here we just re-order them as a mock optimization.
    await chatService.sendMessage(prompt);
    const optimized = [...initiatives].sort((a, b) => a.cost - b.cost).sort((a, b) => (a.risk === 'High' ? 1 : -1));
    setInitiatives(optimized);
  };
  const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const exportToJSON = () => {
    downloadFile(JSON.stringify(initiatives, null, 2), 'roadmap.json', 'application/json');
    toast.success("Roadmap exported as JSON.");
  };
  const exportToCSV = () => {
    const headers = 'id,name,wave,cost,risk,dependencies,isCompliant';
    const rows = initiatives.map(i => `${i.id},"${i.name}",${i.wave},${i.cost},${i.risk},"${i.dependencies.join(';')}",${i.isCompliant}`);
    const csv = `${headers}\n${rows.join('\n')}`;
    downloadFile(csv, 'roadmap.csv', 'text/csv');
    toast.success("Roadmap exported as CSV.");
  };
  return { setInitiatives, optimizeRoadmap, exportToJSON, exportToCSV };
};