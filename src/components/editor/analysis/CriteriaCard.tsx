import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { criteriaIcons, criteriaNames } from "./constants"

interface CriteriaCardProps {
  criteriaKey: string;
  criteria: {
    score: number;
    justification: string;
    advice_for_improvement: string[];
  };
  language: "en" | "zh";
}

export const CriteriaCard = ({ criteriaKey, criteria, language }: CriteriaCardProps) => {
  const IconComponent = criteriaIcons[criteriaKey];

  return (
    <Card className="border bg-card/50">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconComponent className="w-5 h-5 text-primary" />
            <h4 className="font-medium">{criteriaNames[language][criteriaKey]}</h4>
          </div>
          <span className="text-sm font-medium">
            {language === "zh" ? "得分" : "Score"}: {criteria.score}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {criteria.justification}
        </p>
        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            {language === "zh" ? "改进建议" : "Suggestions for Improvement"}:
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
};