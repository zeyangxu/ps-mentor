import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Wand2 } from "lucide-react"
import { FileUpload } from "@/components/FileUpload"
import { UsageLimit } from "@/components/UsageLimit"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Shield, Info } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface EditorInputProps {
  content: string;
  setContent: (content: string) => void;
  handleAnalyze: () => void;
  isAnalyzing: boolean;
  isLoadingUsage: boolean;
  usageCount: number;
  usageError: any;
}

export const EditorInput = ({
  content,
  setContent,
  handleAnalyze,
  isAnalyzing,
  isLoadingUsage,
  usageCount,
  usageError,
}: EditorInputProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">您的文书/PS</h2>
        <div className="flex gap-2">
          <FileUpload onUpload={setContent} />
        </div>
      </div>
      
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
      
      <Textarea
        placeholder="在此粘贴您的文书/PS..."
        className="min-h-[500px] resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="space-y-2">
        <Button 
          className="w-full gap-2" 
          size="lg" 
          onClick={handleAnalyze}
          disabled={isAnalyzing || isLoadingUsage}
        >
          <Wand2 className="w-4 h-4" />
          {isAnalyzing ? "分析中..." : "文书深度评估"}
        </Button>
        {isAnalyzing && (
          <Progress value={100} className="w-full animate-[progress_2s_ease-in-out_infinite]" />
        )}
      </div>

      <Alert className="bg-secondary border-secondary">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          您的隐私安全是我们首要考虑的因素。我们的系统不会录入您的文书信息，请放心使用。
        </AlertDescription>
      </Alert>

      <Alert className="bg-secondary border-secondary">
        <Info className="h-4 w-4" />
        <AlertDescription>
          经严谨测试与验证，在文书字数处于 800 至 1100 字的区间范围内时，我们的评估系统能够呈现最为精准的结果，为您提供最具价值的反馈。然而，鉴于部分学校对文书字数有着相对较小的特定要求，在此我们诚挚地建议您，在参考我们评估结果的同时，结合目标学校的具体字数规范，对文书进行灵活且合理的调整与优化，以确保文书既能符合学校的要求，又能最大程度地展现您的优势与特色，从而为您的留学申请之路保驾护航。
        </AlertDescription>
      </Alert>
    </div>
  );
};