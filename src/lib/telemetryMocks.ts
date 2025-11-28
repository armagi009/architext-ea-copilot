export const mockIncidents = [
  { id: 1, severity: 'Critical', component: 'SAP S/4HANA', status: 'Investigating', summary: 'Order processing API returning 503 errors' },
  { id: 2, severity: 'High', component: 'AWS EC2 (eu-central-1)', status: 'Investigating', summary: 'High CPU utilization on app-server-1' },
  { id: 3, severity: 'Medium', component: 'Salesforce Connector', status: 'Resolved', summary: 'Increased API call latency' },
  { id: 4, severity: 'Medium', component: 'S3 Bucket (public-assets)', status: 'Resolved', summary: 'Drift detected: Public access enabled' },
];
export const getHealthMetrics = () => ({
  maturity: 78, // Overall architecture maturity score
  uptime: 99.95,
  compliance: 95,
});
export const getDriftSummary = () => ({
  totalComponents: 50,
  driftingComponents: 2,
  drifting: 4, // 2/50 * 100
});
// Mock policy scanner
export const scanInitiative = (initiative: any) => {
  // Example policy: High-risk initiatives cannot be in Wave 1.
  if (initiative.risk === 'High' && initiative.wave === 'Wave 1') {
    return { isCompliant: false, reason: 'High-risk items not allowed in first wave.' };
  }
  return { isCompliant: true };
};