import { Button } from "@repo/ui/components/button"
import { Card } from "@repo/ui/components/card"

export function BasicEditor() {
  return (
    <div className="w-full max-w-md space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">LexKit Editor</h3>
        <div className="space-y-3">
          <div className="min-h-[120px] border rounded-md p-3 bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Start typing to see the magic...
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Bold
            </Button>
            <Button size="sm" variant="outline">
              Italic
            </Button>
            <Button size="sm" variant="outline">
              Link
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
