import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Wand2 } from "lucide-react";
import { useState } from "react";

const Editor = () => {
  const [content, setContent] = useState("");

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
            <Button className="w-full gap-2" size="lg">
              <Wand2 className="w-4 h-4" />
              Analyze Statement
            </Button>
          </div>
          
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
            <p className="text-muted-foreground">
              Your analysis results will appear here after you submit your personal statement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;