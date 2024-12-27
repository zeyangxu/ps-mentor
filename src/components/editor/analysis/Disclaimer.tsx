import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface DisclaimerProps {
  language: "en" | "zh";
}

export const Disclaimer = ({ language }: DisclaimerProps) => {
  return (
    <Alert className="mt-6 bg-secondary border-secondary">
      <Info className="h-4 w-4" />
      <AlertTitle className="mb-2">
        {language === "zh" ? "声明" : "Disclaimer"}
      </AlertTitle>
      <AlertDescription className="text-sm">
        {language === "zh"
          ? (
            <>
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
            </>
          )
          : (
            <>
              Our product only analyzes the provided content and does not assess
              the AI detection rate of your statement. Your evaluation score has
              no direct or indirect correlation with the AI rate of your
              statement.
              <br />
              <br />
              While AI can be used as a tool to assist in writing a good
              statement, we do not support using AI to directly generate content
              as this can significantly affect your application success rate.
              <br />
              <br />
              If you need professional AI detection services, we recommend using
              professional tools like Turnitin to ensure accurate and
              professional detection results.
            </>
          )}
      </AlertDescription>
    </Alert>
  );
};
