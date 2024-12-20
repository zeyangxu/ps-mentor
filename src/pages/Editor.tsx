import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { LogoutButton } from "@/components/auth/LogoutButton"
import { useUsageTracking } from "@/hooks/useUsageTracking"
import { useAnalyzeStatement } from "@/hooks/useAnalyzeStatement"
import { Navigate } from "react-router-dom"
import { EditorInput } from "@/components/editor/EditorInput"
import { AnalysisResults } from "@/components/editor/AnalysisResults"

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
        description: "请先登录以分析您的文书/PS。",
      })
      return
    }

    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请先输入您的文书/PS。",
      })
      return
    }

    try {
      const result = await analyzeStatement(content)
      if (result) {
        setAnalysis(result)
        toast({
          title: "分析完成",
          description: "您的文书/PS已分析完成。",
        })
        await fetchUsageCount()
      }
    } catch (error) {
      console.error("Analysis error:", error)
      toast({
        variant: "destructive",
        title: "错误",
        description: "分析您的文书/PS时出错。请重试。",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-8 w-24 h-24">
          <div className="absolute w-16 h-1 bg-primary/20 rounded-full transform rotate-45"></div>
          <div className="absolute w-16 h-1 bg-primary/20 rounded-full transform rotate-45 translate-y-4"></div>
          <div className="absolute w-16 h-1 bg-primary/20 rounded-full transform rotate-45 translate-y-8"></div>
          <div className="absolute w-3 h-3 bg-primary/30 rounded-full -translate-x-2"></div>
          <div className="absolute w-2 h-2 bg-primary/30 rounded-full translate-x-16 translate-y-6"></div>
          <div className="absolute w-2 h-2 bg-primary/30 rounded-full translate-x-12 translate-y-12"></div>
        </div>
        <div className="absolute top-8 right-8 w-24 h-24">
          <div className="absolute w-16 h-1 bg-primary/20 rounded-full transform -rotate-45"></div>
          <div className="absolute w-16 h-1 bg-primary/20 rounded-full transform -rotate-45 translate-y-4"></div>
          <div className="absolute w-16 h-1 bg-primary/20 rounded-full transform -rotate-45 translate-y-8"></div>
          <div className="absolute w-3 h-3 bg-primary/30 rounded-full translate-x-14"></div>
          <div className="absolute w-2 h-2 bg-primary/30 rounded-full -translate-x-2 translate-y-6"></div>
          <div className="absolute w-2 h-2 bg-primary/30 rounded-full translate-x-2 translate-y-12"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative animate-fade-up">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">文书/PS分析助手</h1>
          <LogoutButton />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <EditorInput
            content={content}
            setContent={setContent}
            handleAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            isLoadingUsage={isLoadingUsage}
            usageCount={usageCount}
            usageError={usageError}
          />
          <AnalysisResults analysis={analysis} isAnalyzing={isAnalyzing} />
        </div>
      </div>
    </div>
  );
};

export default Editor;