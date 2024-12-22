import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Wand2 } from "lucide-react"
import { FileUpload } from "@/components/FileUpload"
import { UsageLimit } from "@/components/UsageLimit"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Shield, Info } from "lucide-react"
import { PaymentOptions } from "./PaymentOptions"

interface EditorInputProps {
  content: string;
  setContent: (content: string) => void;
  handleAnalyze: () => void;
  isAnalyzing: boolean;
  isLoadingUsage: boolean;
  usageCount: number;
  usageError: any;
  analysis: string | null;
}

export const EditorInput = ({
  content,
  setContent,
  handleAnalyze,
  isAnalyzing,
  isLoadingUsage,
  usageCount,
  usageError,
  analysis,
}: EditorInputProps) => {
  const hasUsageLeft = usageCount > 0 || usageCount === null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold hover:text-primary transition-colors duration-300">您的文书/PS分析助手</h2>
        <div className="flex gap-2">
          {hasUsageLeft && <FileUpload onUpload={setContent} />}
        </div>
      </div>

      <Alert className="bg-secondary border-secondary">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          您的隐私安全是我们首要考虑的因素。我们的系统不会保存您的文书信息，请放心使用！
        </AlertDescription>
      </Alert>

      {usageError ? (
        <Alert variant="destructive">
          <AlertTitle>加载使用情况时出错</AlertTitle>
          <AlertDescription>
            无法加载您的使用情况。请刷新页面重试。
          </AlertDescription>
        </Alert>
      ) : (
        <UsageLimit usageCount={usageCount} />
      )}

      {hasUsageLeft ? (
        <>
          <Textarea
            placeholder="请点击上传，或直接在此粘贴您的文书/PS..."
            className="min-h-[500px] resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            className="w-full gap-2"
            size="lg"
            onClick={handleAnalyze}
            disabled={isAnalyzing || isLoadingUsage}
          >
            <Wand2 className="w-4 h-4" />
            {isAnalyzing ? "分析中..." : "文书深度评估"}
          </Button>
        </>
      ) : (
        <PaymentOptions />
      )}

      {analysis && hasUsageLeft && (
        <Alert className="bg-secondary border-secondary">
          <Info className="h-4 w-4" />
          <AlertDescription>
            经严谨测试与验证，在文书字数处于 800 至 1100 字的区间范围内时，我们的评估系统能够呈现最为精准的结果，为您提供最具价值的反馈。然而，鉴于部分学校对文书字数有着相对较小的特定要求（如500字），在此我们诚挚地建议您，在参考我们评估结果的同时，请结合目标院校的具体字数规范，对文书进行调整与优化，以确保文书既能符合目标院校的要求，又能最大程度地展现您的优势与特色。
            <br /><br />
            举例：如因字数限制您无法囊括"选校原因"，选择了重点陈述"学术能力"，那么您可以放心地忽略"选校原因"这一维度的评估结果，重点参考"学术能力"维度的得分及修改建议。
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};