import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center animate-fade-up">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Perfect Your Personal Statement with AI
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Get instant, professional feedback on your personal statement using advanced AI analysis. Stand out from the crowd with actionable insights.
          </p>
          <Link to="/editor">
            <Button size="lg" className="gap-2">
              Start Writing <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-background p-6 rounded-lg shadow-lg animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    title: "AI-Powered Analysis",
    description: "Get detailed feedback on your personal statement using advanced AI technology.",
    icon: <Sparkles className="w-6 h-6 text-primary" />,
  },
  {
    title: "Comprehensive Review",
    description: "Receive insights on structure, content, clarity, and impact of your writing.",
    icon: <FileText className="w-6 h-6 text-primary" />,
  },
  {
    title: "Actionable Feedback",
    description: "Get specific suggestions to improve your personal statement and stand out.",
    icon: <Target className="w-6 h-6 text-primary" />,
  },
];

export default Index;