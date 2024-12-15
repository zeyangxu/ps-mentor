import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface UsageLimitProps {
  usageCount: number | null
  maxUsage?: number
}

export const UsageLimit = ({ usageCount, maxUsage = 3 }: UsageLimitProps) => {
  // Only show usage information if we have a valid usage count
  if (usageCount === null) return null
  
  const remaining = usageCount
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Analysis Credits</span>
        <Badge variant={remaining > 0 ? "secondary" : "destructive"}>
          {remaining} remaining
        </Badge>
      </div>
      
      {remaining <= 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Usage Limit Reached</AlertTitle>
          <AlertDescription>
            You have used all your free analysis credits. Please contact support for more information.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}