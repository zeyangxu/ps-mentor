import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Info, Star, TrendingUp, CheckCircle2, AlertCircle, BookOpen, Award, GraduationCap } from "lucide-react"

interface CriteriaAnalysis {
  score: number;
  justification: string;
  advice_for_improvement: string[];
}

interface AnalysisData {
  overall_score: number;
  max_score: number;
  overall_level: string;
  analysis_of_each_criteria: {
    purpose_and_motivation: CriteriaAnalysis;
    academic_competence: CriteriaAnalysis;
    professional_internship_competence: CriteriaAnalysis;
    program_specific_reasons: CriteriaAnalysis;
    future_career_planning: CriteriaAnalysis;
    quality_of_writing: CriteriaAnalysis;
  };
}

interface AnalysisResultsProps {
  analysis: string | null;
  isAnalyzing?: boolean;
}

const criteriaIcons: Record<string, any> = {
  purpose_and_motivation: Star,
  academic_competence: BookOpen,
  professional_internship_competence: Award,
  program_specific_reasons: GraduationCap,
  future_career_planning: TrendingUp,
  quality_of_writing: CheckCircle2,
};

const criteriaNames: Record<string, string> = {
  purpose_and_motivation: "目的与动机",
  academic_competence: "学术能力",
  professional_internship_competence: "专业/实习能力",
  program_specific_reasons: "项目选择原因",
  future_career_planning: "职业规划",
  quality_of_writing: "写作质量",
};

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

  const analysisData: AnalysisData = JSON.parse(analysis);
  const scorePercentage = (analysisData.overall_score / analysisData.max_score) * 100;

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          评估结果
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">总分</span>
              <span className="text-sm font-medium">
                {analysisData.overall_score}/{analysisData.max_score}
              </span>
            </div>
            <Progress value={scorePercentage} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              整体水平: <span className="font-medium text-foreground capitalize">{analysisData.overall_level}</span>
            </p>
          </div>

          <div className="space-y-4">
            {Object.entries(analysisData.analysis_of_each_criteria).map(([key, criteria]) => {
              const IconComponent = criteriaIcons[key];
              return (
                <Card key={key} className="border bg-card/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-5 h-5 text-primary" />
                        <h4 className="font-medium">{criteriaNames[key]}</h4>
                      </div>
                      <span className="text-sm font-medium">
                        得分: {criteria.score}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {criteria.justification}
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-primary" />
                        改进建议:
                      </p>
                      <ul className="space-y-1">
                        {criteria.advice_for_improvement.map((advice, index) => (
                          <li key={index} className="text-sm text-muted-foreground pl-4 relative before:content-['•'] before:absolute before:left-0">
                            {advice}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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