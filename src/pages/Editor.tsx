import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Wand2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { AuthForm } from "@/components/auth/AuthForm"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { UsageLimit } from "@/components/UsageLimit"
import { useUsageTracking } from "@/hooks/useUsageTracking"
import { useAnalyzeStatement } from "@/hooks/useAnalyzeStatement"

const Editor = () => {
  const [content, setContent] = useState("")
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [session, setSession] = useState(null)
  const { toast } = useToast()
  
  const { 
    usageCount, 
    isLoading: isLoadingUsage,
    error: usageError,
    fetchUsageCount // Add this to destructure the new function
  } = useUsageTracking()
  
  const { 
    analyzeStatement, 
    isLoading: isAnalyzing,
    error: analysisError 
  } = useAnalyzeStatement()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result
        if (typeof text === "string") {
          setContent(text)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleAnalyze = async () => {
    if (!session?.user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please sign in to analyze your statement.",
      })
      return
    }

    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your personal statement first.",
      })
      return
    }

    try {
      const result = await analyzeStatement(content)
      if (result) {
        setAnalysis(result)
        toast({
          title: "Analysis Complete",
          description: "Your personal statement has been analyzed.",
        })
        // Refresh usage count after successful analysis
        await fetchUsageCount()
      }
    } catch (error) {
      console.error("Analysis error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze your statement. Please try again.",
      })
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
          <AuthForm />
        </div>
      </div>
    )
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
            
            {usageError ? (
              <Alert variant="destructive">
                <AlertTitle>Error Loading Usage</AlertTitle>
                <AlertDescription>
                  Unable to load your usage information. Please try refreshing the page.
                </AlertDescription>
              </Alert>
            ) : (
              <UsageLimit usageCount={usageCount} />
            )}
            
            <Textarea
              placeholder="Paste your personal statement here..."
              className="min-h-[500px] resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button 
              className="w-full gap-2" 
              size="lg" 
              onClick={handleAnalyze}
              disabled={isAnalyzing || isLoadingUsage || usageCount <= 0}
            >
              <Wand2 className="w-4 h-4" />
              {isAnalyzing ? "Analyzing..." : "Analyze Statement"}
            </Button>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                {analysis ? (
                  <div className="space-y-6">
                    <Alert>
                      <AlertTitle>Final Score</AlertTitle>
                      <AlertDescription className="mt-2 text-lg font-semibold">
                        {analysis.split('\n')[0].replace('1. **Final Score**: ', '')}
                      </AlertDescription>
                    </Alert>
                    
                    <Alert>
                      <AlertTitle>Category</AlertTitle>
                      <AlertDescription className="mt-2">
                        {analysis.split('\n')[1].replace('2. **Category**: ', '')}
                      </AlertDescription>
                    </Alert>
                    
                    <div className="prose prose-sm max-w-none">
                      <h3 className="text-lg font-semibold mb-4">Advice for Improvement</h3>
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
                    Your analysis results will appear here after you submit your personal statement.
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