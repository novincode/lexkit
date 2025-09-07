import { Button } from "@repo/ui/components/button"
import { Badge } from "@repo/ui/components/badge"

export function AdvancedFeatures() {
  return (
    <div className="w-full max-w-lg space-y-4">
      <div className="border rounded-lg p-6 bg-gradient-to-br from-background to-muted/20">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">Advanced Editor</h3>
          <Badge variant="secondary">Pro</Badge>
        </div>
        
        <div className="space-y-4">
          <div className="min-h-[100px] border rounded-md p-3 bg-background">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Real-time collaboration
            </div>
            <div className="text-sm">
              Multiple users can edit simultaneously...
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="h-7 text-xs">AI Assistant</Button>
            <Button size="sm" variant="outline" className="h-7 text-xs">Templates</Button>
            <Button size="sm" variant="outline" className="h-7 text-xs">Export</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
