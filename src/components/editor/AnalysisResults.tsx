import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Award, SmileIcon } from "lucide-react"
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

interface AnalysisResponse {
  chinese: string;
  english: string;
}

interface AnalysisResultsProps {
  analysis: AnalysisResponse;
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
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-dashed border-primary/30 rounded-full animate-[spin_3s_linear_infinite]" />
            <div className="absolute inset-2 border-4 border-dashed border-primary/20 rounded-full animate-[spin_4s_linear_infinite_reverse]" />
            <div className="absolute inset-4 border-4 border-dashed border-primary/10 rounded-full animate-[spin_5s_linear_infinite]" />
          </div>
          <p className="text-muted-foreground text-center animate-pulse">
            正在深度分析您的文书/PS，请稍候...
          </p>
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

  // Parse the response to get the language versions
  const analysisData: AnalysisData = JSON.parse(
    language === "zh" ? analysis.chinese : analysis.english
  );

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
        <div className="flex items-center gap-2 p-3 mb-6 bg-secondary/50 rounded-lg border border-border/50">
          <SmileIcon className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-sm">
            Dr. PS checker 的训练模型以及训练数据均以英文形式输入，故评估结果请以英文版本为准，辅以中文结果为参考。
          </p>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{language === "zh" ? "总分" : "Total Score"}</span>
              <span className="text-sm font-medium">
                {analysisData.overall_score}/{analysisData.max_score}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${scorePercentage}%` }}
              />
            </div>
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