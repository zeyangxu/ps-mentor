import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Wand2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { AuthForm } from "@/components/auth/AuthForm";

const Editor = () => {
  const [content, setContent] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === "string") {
          setContent(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const analyzeStatement = async () => {
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your personal statement first.",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Calling analyze-statement function with content length:", content.length);
      
      const { data, error } = await supabase.functions.invoke('analyze-statement', {
        body: { content },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log("Function response:", { data, error });
      
      if (error) {
        console.error("Function error details:", error);
        throw error;
      }
      
      setAnalysis(data.analysis);
      toast({
        title: "Analysis Complete",
        description: "Your personal statement has been analyzed.",
      });
    } catch (error) {
      console.error("Full error details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze your statement. Please ensure the Edge Function is deployed and properly configured.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Your Personal Statement</h2>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  <label className="cursor-pointer">
                    Upload
                    <input
                      type="file"
                      accept=".txt"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </Button>
              </div>
            </div>
            <Textarea
              placeholder="Paste your personal statement here..."
              className="min-h-[500px] resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button 
              className="w-full gap-2" 
              size="lg" 
              onClick={analyzeStatement}
              disabled={isLoading}
            >
              <Wand2 className="w-4 h-4" />
              {isLoading ? "Analyzing..." : "Analyze Statement"}
            </Button>
          </div>
          
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
            {analysis ? (
              <div className="prose prose-sm max-w-none">
                {analysis}
              </div>
            ) : (
              <p className="text-muted-foreground">
                Your analysis results will appear here after you submit your personal statement.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;