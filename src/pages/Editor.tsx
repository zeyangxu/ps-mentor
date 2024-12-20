import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Wand2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { LogoutButton } from "@/components/auth/LogoutButton"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { UsageLimit } from "@/components/UsageLimit"
import { useUsageTracking } from "@/hooks/useUsageTracking"
import { useAnalyzeStatement } from "@/hooks/useAnalyzeStatement"
import { Navigate } from "react-router-dom"
import { FileUpload } from "@/components/FileUpload"

const Editor = () => {
  const [content, setContent] = useState("")
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [session, setSession] = useState(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const { toast } = useToast()
  
  const { 
    usageCount, 
    isLoading: isLoadingUsage,
    error: usageError,
    fetchUsageCount
  } = useUsageTracking()
  
  const { 
    analyzeStatement, 
    isLoading: isAnalyzing,
    error: analysisError 
  } = useAnalyzeStatement()

  useEffect(() => {
    setIsLoadingSession(true)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsLoadingSession(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setIsLoadingSession(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  const handleAnalyze = async () => {
    if (!session?.user) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请先登录以分析您的陈述。",
      })
      return
    }

    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请先输入您的个人陈述。",
      })
      return
    }

    try {
      const result = await analyzeStatement(content)
      if (result) {
        setAnalysis(result)
        toast({
          title: "分析完成",
          description: "您的个人陈述已分析完成。",
        })
        await fetchUsageCount()
      }
    } catch (error) {
      console.error("Analysis error:", error)
      toast({
        variant: "destructive",
        title: "错误",
        description: "分析您的陈述时出错。请重试。",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">个人陈述分析助手</h1>
          <LogoutButton />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">您的个人陈述</h2>
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
              placeholder="在此粘贴您的个人陈述..."
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
              {isAnalyzing ? "分析中..." : "分析陈述"}
            </Button>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>分析结果</CardTitle>
              </CardHeader>
              <CardContent>
                {analysis ? (
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
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    提交个人陈述后，分析结果将显示在此处。
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Editor