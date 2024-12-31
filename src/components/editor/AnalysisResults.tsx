import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, SmileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { CriteriaCard } from "./analysis/CriteriaCard";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface AnalysisResponse {
  chinese: string;
  english: string;
}

interface AnalysisResultsProps {
  analysis: AnalysisResponse | null;
  isAnalyzing?: boolean;
}

export const AnalysisResults = (
  { analysis, isAnalyzing }: AnalysisResultsProps,
) => {
  const [language, setLanguage] = useState<"en" | "zh">("en");

  // Parse the response to get the language versions
  const analysisData: AnalysisData = analysis
    ? JSON.parse(
      language === "zh" ? analysis?.chinese : analysis?.english,
    )
    : {};

  const scorePercentage =
    (analysisData.overall_score / analysisData.max_score) * 100;

  const averageScore = useMemo(() => {
    const total = Object.values(analysisData?.analysis_of_each_criteria ?? {})
      .reduce(
        (acc, standard) => {
          if (standard.score) {
            return acc + standard.score;
          }
          return acc;
        },
        0,
      );

    return Number((total / Object.values(analysisData.analysis_of_each_criteria ?? {}).length).toFixed(2));
  }, [analysisData.analysis_of_each_criteria]);

  if (isAnalyzing) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>分析中...</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-dashed border-primary/30 rounded-full animate-[spin_3s_linear_infinite]" />
            <div className="absolute inset-2 border-4 border-dashed border-primary/20 rounded-full animate-[spin_4s_linear_infinite_reverse]" />
            <div className="absolute inset-4 border-4 border-dashed border-primary/10 rounded-full animate-[spin_5s_linear_infinite]" />
          </div>
          <p className="text-muted-foreground text-center animate-pulse">
            My PS Mentor 正在深度分析您的文书/PS，请您耐心等候1分钟左右哦...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>评估报告</CardTitle>
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
    <div className="space-y-4">
      <Card className="border-2">
        <CardHeader className="flex-row justify-between items-center space-y-0 sticky top-0 bg-background z-10">
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            评估结果
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={language === "en" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("en")}
            >
              English
            </Button>
            <Button
              variant={language === "zh" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("zh")}
            >
              中文
            </Button>
          </div>
        </CardHeader>
        <ScrollArea className="h-[650px]">
          <CardContent>
            <div className="flex items-center gap-2 p-3 mb-6 bg-secondary/50 rounded-lg border border-border/50">
              <SmileIcon className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm">
                My PS Mentor
                的训练模型以及训练数据均以英文形式输入，在此基础上结合中文语言特点进行了相应调整。因此，在查看评估结果及改进建议时，请您综合参考双语版本，以便获取更为全面的反馈信息哦。
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {language === "zh" ? "总分" : "Total Score"}
                  </span>
                  <span className="text-sm font-medium">
                    {averageScore}/{analysisData.max_score}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${scorePercentage}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === "zh" ? "整体水平" : "Overall Level"}:{" "}
                  <span className="font-medium text-foreground capitalize">
                    {analysisData.overall_level}
                  </span>
                </p>
              </div>

              <div className="space-y-4">
                {Object.entries(analysisData.analysis_of_each_criteria).map((
                  [key, criteria],
                ) => (
                  <CriteriaCard
                    key={key}
                    criteriaKey={key}
                    criteria={criteria}
                    language={language}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </ScrollArea>
      </Card>

      <Card className="border bg-secondary/50">
        <CardContent className="p-4 space-y-2">
          <h4 className="font-medium text-sm">声明</h4>
          <p className="text-sm text-muted-foreground">
            My PS Mentor 仅对已给定的内容展开分析，并不涉及对文书可能的 AI
            生成率进行评估。您的评估分数与文书的 AI 率不存在直接或间接的关联。
            <br />
            <br />
            一篇好的文书可以使用 AI 作为工具进行辅助，但我们不建议直接使用 AI
            生成内容，这会在很大程度影响您的申请成功率。
            <br />
            <br />
            若您有专业的 AI 率检测需求，建议您使用诸如 turnitin 等专业的 AI
            检测率工具进行检测，以确保检测结果的专业性与准确性。
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
