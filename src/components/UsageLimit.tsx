import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PaymentOptions } from "./editor/PaymentOptions"

interface UsageLimitProps {
  usageCount: number | null
  maxUsage?: number
}

export const UsageLimit = ({ usageCount, maxUsage = 3 }: UsageLimitProps) => {
  if (usageCount === null) return null

  const remaining = usageCount

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">免费分析次数</span>
        <Badge variant={remaining > 0 ? "secondary" : "destructive"}>
          剩余 {remaining} 次
        </Badge>
      </div>

      {remaining <= 0 && (
        <>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>已达使用限制</AlertTitle>
            <AlertDescription>
              您已用完所有免费分析次数。请选择以下套餐继续使用我们的服务：
            </AlertDescription>
          </Alert>
          <PaymentOptions />
        </>
      )}
    </div>
  )
}