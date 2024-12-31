import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useUsageTracking } from "@/hooks/useUsageTracking";
import { useAnalyzeStatement } from "@/hooks/useAnalyzeStatement";
import { Navigate } from "react-router-dom";
import { EditorInput } from "@/components/editor/EditorInput";
import { AnalysisResults } from "@/components/editor/AnalysisResults";
import { AnalysisResponse } from "@/types/analysis";
import { ServiceContact } from "@/components/ServiceContact";

const Editor = () => {
  const [content, setContent] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [session, setSession] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const { toast } = useToast();

  const {
    usageCount,
    isLoading: isLoadingUsage,
    error: usageError,
    fetchUsageCount,
  } = useUsageTracking();

  const {
    analyzeStatement,
    isLoading: isAnalyzing,
    error: analysisError,
  } = useAnalyzeStatement();

  useEffect(() => {
    setIsLoadingSession(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoadingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary">
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const handleAnalyze = async () => {
    if (!session?.user) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请先登录以分析您的文书/PS。",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请先输入您的文书/PS。",
      });
      return;
    }

    try {
      const result = await analyzeStatement(content);
      if (result) {
        setAnalysis(result);
        toast({
          title: "分析完成",
          description: "您的文书/PS已分析完成。",
        });
        await fetchUsageCount();
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        variant: "destructive",
        title: "错误",
        description: "分析您的文书/PS时出错。请重试。",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background relative overflow-hidden">
      <div className="container mx-auto px-4 pt-24 pb-8 relative animate-fade-up">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <img
              src="/lovable-uploads/392db423-89a7-4be0-be5f-d508e73d5651.png"
              alt="PS Logo"
              className="w-12 h-12 hover:scale-110 transition-transform duration-300"
            />
            <h1 className="text-3xl font-bold hover:text-primary transition-colors duration-300">
              My PS Mentor
            </h1>
          </div>
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
            analysis={analysis}
          />
          <AnalysisResults analysis={analysis} isAnalyzing={isAnalyzing} />
        </div>
      </div>
      <ServiceContact />
    </div>
  );
};

export default Editor;