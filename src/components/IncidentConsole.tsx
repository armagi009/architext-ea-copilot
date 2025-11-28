import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';
import { RunbookAssistant } from './RunbookAssistant';
const severityMap: { [key: string]: { icon: React.ElementType, color: string } } = {
  Critical: { icon: ShieldAlert, color: 'text-red-500' },
  High: { icon: AlertTriangle, color: 'text-orange-500' },
  Medium: { icon: Info, color: 'text-yellow-500' },
};
export function IncidentConsole({ incidents }: { incidents: any[] }) {
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Console</CardTitle>
        <CardDescription>Live anomalies and telemetry alerts from your production environment.</CardDescription>
      </CardHeader>
      <CardContent>
        <Drawer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>Component</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Summary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident) => {
                const severity = severityMap[incident.severity] || { icon: Info, color: 'text-gray-500' };
                return (
                  <DrawerTrigger asChild key={incident.id}>
                    <TableRow className="cursor-pointer" onClick={() => setSelectedIncident(incident)}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <severity.icon className={`h-5 w-5 ${severity.color}`} />
                          {incident.severity}
                        </div>
                      </TableCell>
                      <TableCell>{incident.component}</TableCell>
                      <TableCell>
                        <Badge variant={incident.status === 'Resolved' ? 'default' : 'secondary'}>
                          {incident.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{incident.summary}</TableCell>
                    </TableRow>
                  </DrawerTrigger>
                );
              })}
            </TableBody>
          </Table>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Incident: {selectedIncident?.summary}</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <h3 className="font-semibold mb-2">AI-Suggested Mitigation Steps</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm bg-muted p-4 rounded-lg">
                  <li>Isolate the affected EC2 instance from public traffic via its security group.</li>
                  <li>Analyze application logs from the past 15 minutes for error patterns.</li>
                  <li>If a bad deploy is suspected, initiate rollback to the previous stable version.</li>
                </ol>
                <div className="mt-4 flex gap-2">
                  <Button><CheckCircle className="mr-2 h-4 w-4" /> Approve Auto-Mitigation</Button>
                  <Button variant="outline">Acknowledge</Button>
                </div>
              </div>
              <div>
                <RunbookAssistant initialPrompt={`Incident Details: ${selectedIncident?.summary}. Component: ${selectedIncident?.component}. Generate an RCA.`} />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </CardContent>
    </Card>
  );
}