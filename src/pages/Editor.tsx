import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface AnalysisResponse {
  content: string;
  score: number;
  category: string;
  advice: string;
}

const Editor = () => {
  const [text, setText] = useState("");
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke<AnalysisResponse>('analyze-statement', {
        body: { text }
      });

      if (error) throw error;
      
      if (data) {
        setResults({
          content: data.content,
          score: data.score,
          category: data.category,
          advice: data.advice
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        variant: "destructive",
        title: "分析失败",
        description: "请稍后重试或联系客服"
      });
    }
  };

  return (
    <div>
      <h1>Editor</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text here..."
      />
      <Button onClick={() => handleAnalyze(text)}>Analyze</Button>
      {results && (
        <div>
          <h2>Results</h2>
          <p>Content: {results.content}</p>
          <p>Score: {results.score}</p>
          <p>Category: {results.category}</p>
          <p>Advice: {results.advice}</p>
        </div>
      )}
    </div>
  );
};

export default Editor;
