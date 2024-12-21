import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Info } from "lucide-react"

interface AnalysisResultsProps {
  analysis: string | null;
  isAnalyzing?: boolean;
}

export const AnalysisResults = ({ analysis, isAnalyzing }: AnalysisResultsProps) => {
  if (isAnalyzing) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>分析中...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            正在分析您的文书/PS，请稍候...
          </p>
          <Progress value={33} className="w-full animate-[progress_2s_ease-in-out_infinite]" />
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>分析结果</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            提交文书后，评估结果将在此处显示。
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>评估结果</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Alert>
            <AlertTitle>最终得分</AlertTitle>
            <AlertDescription className="mt-2 text-lg font-semibold">
              {analysis.split('\n')[0].replace('1. **Final Score**: ', '')}
            </AlertDescription>
          </Alert>

          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-semibold mb-4">改进建议</h3>
            <div className="space-y-4">
              {analysis
                .split('\n')
                .slice(2)
                .join('\n')
                .replace('3. **Advice for Improvement**: ', '')
                .split('- ')
                .filter(Boolean)
                .map((advice, index) => (
                  <div key={index} className="pl-4 border-l-2 border-primary">
                    <p className="text-sm text-muted-foreground">{advice.trim()}</p>
                  </div>
                ))}
            </div>
          </div>

          <Alert className="mt-6 bg-secondary border-secondary">
            <Info className="h-4 w-4" />
            <AlertTitle className="mb-2">声明</AlertTitle>
            <AlertDescription className="text-sm">
              我们的产品仅对已给定的内容展开分析，并不涉及对文书 AI 率的评估。您的评估分数与文书的 AI 率不存在直接或间接的关联。
              <br /><br />
              一篇好的文书可以使用 AI 作为工具进行辅助，但我们不支持使用 AI 直接生成内容，这会很大程度影响您的申请成功率。
              <br /><br />
              倘若您有专业的 AI 率检测需求，建议您使用诸如 turnitin 等专业的 AI 检测率工具进行检测，以确保检测结果的专业性与准确性。
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};