import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGraphActions } from "@/lib/graphStore";
import { Node } from "reactflow";
interface EvidencePanelProps {
  node: Node | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
export function EvidencePanel({ node, isOpen, onOpenChange }: EvidencePanelProps) {
  const { validateNode } = useGraphActions();
  if (!node) return null;
  const { label, type, confidence, validated, source } = node.data;
  const handleValidate = () => {
    validateNode(node.id);
    onOpenChange(false);
  };
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{label}</SheetTitle>
          <SheetDescription>
            Evidence and details for this architecture component.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div className="flex justify-between items-center">
            <Badge>{type}</Badge>
            <Badge variant={validated ? "default" : "secondary"}>
              {validated ? "Validated" : "Unvalidated"}
            </Badge>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Confidence Score</h4>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${(confidence || 0) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground text-right mt-1">
              {Math.round((confidence || 0) * 100)}%
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Source Evidence</h4>
            <div className="p-3 bg-muted rounded-md text-sm space-y-2">
              <p>
                <strong>Source:</strong> {source || "Uploaded Document"}
              </p>
              <p className="italic">
                "...{label} is a key component of the new system..."
              </p>
            </div>
          </div>
          <Button onClick={handleValidate} disabled={validated} className="w-full">
            {validated ? "Component Validated" : "Mark as Validated"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}