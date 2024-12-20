import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface AnalysisResultsProps {
  analysis: string | null;
  isAnalyzing?: boolean;
}

export const AnalysisResults = ({ analysis, isAnalyzing }: AnalysisResultsProps) => {
  if (isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>分析中...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            正在分析您的文书/PS，请稍候...
          </p>
          <Progress value={100} className="animate-[progress_2s_ease-in-out_infinite]" />
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>分析结果</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            提交个人陈述后，分析结果将显示在此处。
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>分析结果</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Alert>
            <AlertTitle>最终得分</AlertTitle>
            <AlertDescription className="mt-2 text-lg font-semibold">
              {analysis.split('\n')[0].replace('1. **Final Score**: ', '')}
            </AlertDescription>
          </Alert>
          
          <Alert>
            <AlertTitle>类别</AlertTitle>
            <AlertDescription className="mt-2">
              {analysis.split('\n')[1].replace('2. **Category**: ', '')}
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
        </div>
      </CardContent>
    </Card>
  );
};