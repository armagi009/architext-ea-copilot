import { Node, Edge } from 'reactflow';
import { toast } from 'sonner';
// Mock data for connectors
const mockConfluenceData = {
  title: "Project Phoenix Architecture Overview",
  body: "The core of Project Phoenix is SAP S/4HANA, hosted on AWS EC2 instances in eu-west-1. Customer data is managed via Salesforce. We use a Kafka event mesh for integration between SAP and Salesforce.",
};
const mockJiraData = {
  epics: [
    { key: "PHX-1", summary: "Deploy SAP S/4HANA Infrastructure" },
    { key: "PHX-2", summary: "Integrate Salesforce with ERP" },
  ],
};
const mockAwsData = {
  instances: [
    { id: 'i-12345', type: 't3.large', state: 'running', tags: { Name: 'sap-app-server' } },
    { id: 'i-67890', type: 'r5.xlarge', state: 'running', tags: { Name: 'sap-db-server' } },
  ],
  s3Buckets: [
    { name: 'phoenix-prod-backups', publicAccess: 'Blocked' },
    { name: 'phoenix-public-assets', publicAccess: 'Enabled' },
  ]
};
// Simple text parser to generate graph nodes and edges
export const parseTextToGraph = (text: string, source: string): { nodes: Node[], edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const found = new Map<string, Node>();
  const addNode = (id: string, label: string, type: string, data: any) => {
    if (!found.has(id)) {
      const newNode: Node = {
        id,
        type: 'custom',
        position: { x: Math.random() * 400, y: Math.random() * 300 },
        data: { label, type, confidence: 0.75 + Math.random() * 0.2, validated: false, source, ...data },
      };
      nodes.push(newNode);
      found.set(id, newNode);
    }
    return found.get(id)!;
  };
  if (text.toLowerCase().includes('sap')) {
    const cap = addNode('cap_erp', 'ERP Management', 'Capability', {});
    const app = addNode('app_sap', 'SAP S/4HANA', 'App', {});
    edges.push({ id: `e-${cap.id}-${app.id}`, source: cap.id, target: app.id, animated: true });
  }
  if (text.toLowerCase().includes('aws') || text.toLowerCase().includes('ec2')) {
    const app = found.get('app_sap') || addNode('app_generic', 'Cloud Workload', 'App', {});
    const infra = addNode('infra_aws', 'AWS EC2', 'Infra', {});
    if (app) {
      edges.push({ id: `e-${app.id}-${infra.id}`, source: app.id, target: infra.id });
    }
  }
  if (text.toLowerCase().includes('salesforce')) {
    const cap = addNode('cap_crm', 'CRM', 'Capability', {});
    const app = addNode('app_sfdc', 'Salesforce', 'App', {});
    edges.push({ id: `e-${cap.id}-${app.id}`, source: cap.id, target: app.id, animated: true });
  }
  if (text.toLowerCase().includes('kafka') || text.toLowerCase().includes('event mesh')) {
    const sap = found.get('app_sap');
    const sfdc = found.get('app_sfdc');
    if (sap && sfdc) {
      edges.push({ id: `e-${sap.id}-${sfdc.id}`, source: sap.id, target: sfdc.id, label: 'Kafka Events' });
    }
  }
  return { nodes, edges };
};
// Client-side file reader
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};
// Mock connector functions
export const ingestFromConfluence = async (url: string) => {
  toast.info(`Simulating ingest from Confluence: ${url}`);
  await new Promise(res => setTimeout(res, 1000)); // Simulate network delay
  return parseTextToGraph(mockConfluenceData.body, "Confluence");
};
export const ingestFromJira = async (projectKey: string) => {
  toast.info(`Simulating ingest from Jira project: ${projectKey}`);
  await new Promise(res => setTimeout(res, 1000));
  const combinedText = mockJiraData.epics.map(e => e.summary).join('\n');
  return parseTextToGraph(combinedText, "Jira");
};
export const ingestFromAWS = async () => {
  toast.info(`Simulating ingest from AWS API...`);
  await new Promise(res => setTimeout(res, 1500));
  const combinedText = `AWS resources found: ${mockAwsData.instances.length} EC2 instances and ${mockAwsData.s3Buckets.length} S3 buckets.`;
  return parseTextToGraph(combinedText, "AWS API");
};