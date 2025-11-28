import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, BrainCircuit, FilePlus2, LayoutTemplate } from 'lucide-react';
import { EAHeader } from '@/components/EAHeader';
import { FooterNote } from '@/components/FooterNote';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
const kpiData = [
  { title: 'Time to Brief', value: '4 hrs', change: '-82%', changeType: 'positive' },
  { title: 'Evidence Coverage', value: '91%', change: '+15%', changeType: 'positive' },
  { title: 'Est. Cost Delta', value: '-18%', change: '-5%', changeType: 'positive' },
];
const actionCards = [
  {
    icon: FilePlus2,
    title: 'New Intake',
    description: 'Start a new engagement by ingesting documents and context.',
    link: '/intake',
    color: 'text-primary',
  },
  {
    icon: LayoutTemplate,
    title: 'Design Canvas',
    description: 'Generate and simulate multi-option target architectures.',
    link: '/design',
    color: 'text-accent',
  },
  {
    icon: BarChart3,
    title: 'View Roadmap',
    description: 'Plan and orchestrate your transformation portfolio.',
    link: '#',
    color: 'text-blue-500',
  },
];
export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="noise-bg"></div>
      <EAHeader />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24 lg:py-32 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <BrainCircuit className="mx-auto h-16 w-16 text-gradient-ea" />
              <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-balance">
                Your Enterprise Architecture <span className="text-gradient-ea">Copilot</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
                Turn McKinsey-grade EA workflows into an AI-native assistant. Discover, design, plan, and operate with evidence-backed confidence.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link to="/intake">
                  <Button size="lg">
                    Start New Intake <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Load Engagement
                </Button>
              </div>
            </motion.div>
          </div>
          <div className="pb-16 md:pb-24 lg:pb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {kpiData.map((kpi) => (
                <Card key={kpi.title}>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{kpi.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className={kpi.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}>
                        {kpi.change}
                      </span>{' '}
                      from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {actionCards.map((action, i) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                >
                  <Link to={action.link} className="block h-full">
                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50">
                      <CardHeader>
                        <action.icon className={`h-8 w-8 mb-2 ${action.color}`} />
                        <CardTitle>{action.title}</CardTitle>
                        <CardDescription>{action.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <FooterNote />
      <Toaster richColors />
    </div>
  );
}