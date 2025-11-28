import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
interface FilePreview extends File {
  preview: string;
}
interface IntakePanelProps {
  onIngest: (data: {
    engagementName: string;
    region: string;
    trigger: string;
    files: FilePreview[];
  }) => void;
  isProcessing: boolean;
}
export function IntakePanel({ onIngest, isProcessing }: IntakePanelProps) {
  const [engagementName, setEngagementName] = useState('');
  const [region, setRegion] = useState('');
  const [trigger, setTrigger] = useState('');
  const [files, setFiles] = useState<FilePreview[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 2 * 1024 * 1024, // 2MB limit for client-side preview
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach(error => {
          if (error.code === 'file-too-large') {
            toast.error(`${file.name} is larger than 2MB. Full ingest in Phase 2.`);
          } else {
            toast.error(`Error with ${file.name}: ${error.message}`);
          }
        });
      });
    }
  });
  const removeFile = (fileToRemove: FilePreview) => {
    setFiles(prev => prev.filter(file => file !== fileToRemove));
    URL.revokeObjectURL(fileToRemove.preview);
  };
  const handleIngestClick = () => {
    if (!engagementName || !trigger) {
      toast.warning('Please provide an Engagement Name and Trigger.');
      return;
    }
    onIngest({ engagementName, region, trigger, files });
  };
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>1. Discover & Align</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="engagementName">Engagement Name</Label>
          <Input id="engagementName" placeholder="e.g., SAP Renewal, APAC" value={engagementName} onChange={e => setEngagementName(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Input id="region" placeholder="e.g., APAC" value={region} onChange={e => setRegion(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trigger">Trigger</Label>
            <Input id="trigger" placeholder="e.g., Contract Renewal" value={trigger} onChange={e => setTrigger(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Upload Artifacts</Label>
          <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'hover:border-primary/50'}`}>
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              {isDragActive ? 'Drop files here...' : 'Drag & drop files, or click to select'}
            </p>
            <p className="text-xs text-muted-foreground/80">PDF, DOCX, TXT up to 2MB</p>
          </div>
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map(file => (
                <div key={file.name} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(file)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button onClick={handleIngestClick} disabled={isProcessing} className="w-full">
          {isProcessing ? 'Ingesting...' : 'Generate Brief'}
        </Button>
      </CardContent>
    </Card>
  );
}