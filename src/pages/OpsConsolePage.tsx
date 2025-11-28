import { EAHeader } from '@/components/EAHeader';
import { FooterNote } from '@/components/FooterNote';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IncidentConsole } from '@/components/IncidentConsole';
import { RunbookAssistant } from '@/components/RunbookAssistant';
import { mockIncidents, getHealthMetrics, getDriftSummary } from '@/lib/telemetryMocks';
import { Gauge, Zap, GitPullRequestArrow } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
export default function OpsConsolePage() {
  const healthMetrics = getHealthMetrics();
  const driftSummary = getDriftSummary();
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <EAHeader />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Operate & Learn</h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Keep your architecture healthy in production and feed lessons back continuously.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <IncidentConsole incidents={mockIncidents} />
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GitPullRequestArrow className="h-5 w-5 text-primary" />
                      Continuous Learning Feed
                    </CardTitle>
                    <CardDescription>Architectural insights from recent operations.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      <strong>Insight:</strong> High latency in the Order Management service correlates with peak CRM API calls.
                      <br />
                      <strong>Suggestion:</strong> Implement a caching layer for Salesforce data.
                    </div>
                     <div className="p-3 bg-muted rounded-lg text-sm">
                      <strong>Insight:</strong> A recent S3 bucket misconfiguration was manually corrected.
                      <br />
                      <strong>Suggestion:</strong> Add a policy-as-code check to the CI/CD pipeline to prevent recurrence.
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-4 space-y-8">
                <RunbookAssistant />
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-primary" />
                      Health Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="h-24">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[{ value: healthMetrics.maturity }, { value: 100 - healthMetrics.maturity }]}
                              cx="50%" cy="50%" innerRadius={25} outerRadius={35}
                              dataKey="value" startAngle={90} endAngle={-270}
                            >
                              <Cell fill={COLORS[0]} />
                              <Cell fill={COLORS[1]} />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-xl font-bold">{healthMetrics.maturity}%</p>
                      <p className="text-xs text-muted-foreground">Maturity Score</p>
                    </div>
                    <div>
                      <Zap className="h-10 w-10 mx-auto text-primary" />
                      <p className="text-xl font-bold mt-2">{driftSummary.drifting}%</p>
                      <p className="text-xs text-muted-foreground">Drift Detected</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterNote />
    </div>
  );
}