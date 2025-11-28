import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Download, FileCode, FileText } from 'lucide-react';
import { toast } from 'sonner';
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
  toast.success(`${fileName} downloaded.`);
};
const terraformScaffold = {
  "resource": {
    "aws_instance": {
      "app_server": {
        "ami": "ami-0c55b159cbfafe1f0",
        "instance_type": "t2.micro",
        "tags": {
          "Name": "Architext-Generated-Server"
        }
      }
    }
  }
};
const prTemplate = `
---
title: 'feat: Implement Wave 1 Infrastructure'
labels: 'enhancement, infrastructure'
---
## Description
This PR contains the scaffolded Terraform code for the Wave 1 infrastructure as defined in the Architext-generated roadmap.
## Changes
- Added \`main.tf\` for EC2 instance creation.
- Configured basic networking and security groups.
## Next Steps
- [ ] Peer review and approval.
- [ ] Run \`terraform plan\` and \`terraform apply\` in the staging environment.
`;
export function ExecutionBotsPanel() {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          Execution Bots
        </CardTitle>
        <CardDescription>Automate and scaffold your execution tasks.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>IaC Scaffolding</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p className="text-sm text-muted-foreground">Generate infrastructure-as-code templates.</p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => downloadFile(JSON.stringify(terraformScaffold, null, 2), 'terraform.tf.json', 'application/json')}
              >
                <FileCode className="h-4 w-4" /> Download Terraform Scaffold
              </Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>CI/CD & GitOps</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p className="text-sm text-muted-foreground">Create templates for your pipelines.</p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => downloadFile(prTemplate, 'pr_template.md', 'text/markdown')}
              >
                <FileText className="h-4 w-4" /> Download PR Template
              </Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Documentation</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p className="text-sm text-muted-foreground">Auto-generate project charters and SOWs.</p>
              <Button variant="secondary" size="sm" className="w-full justify-start gap-2" disabled>
                <FileText className="h-4 w-4" /> Generate Project Charter (soon)
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}