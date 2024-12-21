import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { CriteriaCard } from "./analysis/CriteriaCard"
import { Disclaimer } from "./analysis/Disclaimer"

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

export const AnalysisResults = ({ analysis, isAnalyzing }: AnalysisResultsProps) => {
  const [language, setLanguage] = useState<"en" | "zh">("zh");

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
          <Progress value={33} className="w-full" />
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

  // Parse the response which contains both language versions
  const parsedResponse = JSON.parse(analysis);
  const analysisData: AnalysisData = JSON.parse(parsedResponse[language]);
  const scorePercentage = (analysisData.overall_score / analysisData.max_score) * 100;

  return (
    <Card className="border-2">
      <CardHeader className="flex-row justify-between items-center space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          评估结果
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={language === "zh" ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage("zh")}
          >
            中文
          </Button>
          <Button
            variant={language === "en" ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage("en")}
          >
            English
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{language === "zh" ? "总分" : "Total Score"}</span>
              <span className="text-sm font-medium">
                {analysisData.overall_score}/{analysisData.max_score}
              </span>
            </div>
            <Progress value={scorePercentage} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {language === "zh" ? "整体水平" : "Overall Level"}: <span className="font-medium text-foreground capitalize">{analysisData.overall_level}</span>
            </p>
          </div>

          <div className="space-y-4">
            {Object.entries(analysisData.analysis_of_each_criteria).map(([key, criteria]) => (
              <CriteriaCard
                key={key}
                criteriaKey={key}
                criteria={criteria}
                language={language}
              />
            ))}
          </div>

          <Disclaimer language={language} />
        </div>
      </CardContent>
    </Card>
  );
};