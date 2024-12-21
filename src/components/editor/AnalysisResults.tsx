import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Info, Star, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react"

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

  // Parse the score from the first line
  const scoreMatch = analysis.match(/(\d+)\s*out of\s*(\d+)/);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
  const maxScore = scoreMatch ? parseInt(scoreMatch[2]) : 60;
  const scorePercentage = (score / maxScore) * 100;

  // Get the category from the second line
  const categoryMatch = analysis.match(/Category\**:\s*([^]*?)(?=\d\.|$)/);
  const category = categoryMatch ? categoryMatch[1].trim() : "";

  // Extract improvement advice
  const adviceMatch = analysis.match(/Advice for Improvement\**:\s*([^]*?)(?=\d\.|$)/);
  const adviceText = adviceMatch ? adviceMatch[1] : "";
  const advicePoints = adviceText
    .split('-')
    .filter(point => point.trim())
    .map(point => {
      const [title, ...description] = point.split(':');
      return {
        title: title.trim(),
        description: description.join(':').trim()
      };
    });

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          评估结果
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">总分</span>
              <span className="text-sm font-medium">{score}/{maxScore}</span>
            </div>
            <Progress 
              value={scorePercentage} 
              className="h-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              类别: <span className="font-medium text-foreground">{category}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">改进建议</h3>
            </div>
            <div className="grid gap-4">
              {advicePoints.map((point, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {point.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {point.description}
                  </p>
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