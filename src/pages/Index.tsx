import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Sparkles, Target, BookOpen, BriefcaseIcon, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center animate-fade-up mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            AI驱动的个人陈述评估系统
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            最前沿的 AI 算法，最资深的研发团队，最精细的文书多维剖析，为你的留学保驾护航！
          </p>
          <Link to="/editor">
            <Button size="lg" className="gap-2">
              开始评估 <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <Card className="p-6 animate-fade-up">
            <CardContent className="p-0">
              <h2 className="text-2xl font-semibold mb-4">文书/PS</h2>
              <p className="text-muted-foreground leading-relaxed">
                个人陈述（Personal Statement, 简称PS）是欧美大学申请中至关重要的一环。一篇出色的PS不仅能弥补学术成绩及相关经验的不足，还能帮助申请者在众多竞争者中脱颖而出。而相反，一篇质量不佳的PS可能会拉低整体申请水平，甚至让招生官对申请者的能力和动机产生质疑。
              </p>
            </CardContent>
          </Card>
          
          <Card className="p-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
            <CardContent className="p-0">
              <h2 className="text-2xl font-semibold mb-4">现存问题</h2>
              <p className="text-muted-foreground leading-relaxed">
                在实际申请过程中，许多申请者因缺乏对PS写作要求的系统理解，或受到市面上质量参差不齐的文书代写机构的影响，往往难以撰写出符合学校期望的个人陈述。这不仅增加了申请的难度，也使一些本具竞争力的申请者未能有效展现自己的潜力，错失录取机会！
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <h2 className="text-3xl font-bold text-center mb-12">六大评估维度</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="p-6 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    title: "申请动机",
    description: "评估你的学习动机和目标是否清晰、具体且令人信服",
    icon: <Target className="w-6 h-6 text-primary" />,
  },
  {
    title: "学术能力",
    description: "分析你的学术背景是否符合项目要求，并有效展示你的学术潜力",
    icon: <GraduationCap className="w-6 h-6 text-primary" />,
  },
  {
    title: "实习经验",
    description: "评估你的实习和职业经历如何支持你的申请目标",
    icon: <BriefcaseIcon className="w-6 h-6 text-primary" />,
  },
  {
    title: "选校原因",
    description: "分析你对目标院校和项目的了解程度及选择理由的说服力",
    icon: <BookOpen className="w-6 h-6 text-primary" />,
  },
  {
    title: "职业规划",
    description: "评估你的职业目标是否明确，以及与所选项目的匹配度",
    icon: <Target className="w-6 h-6 text-primary" />,
  },
  {
    title: "写作质量",
    description: "全面评估文章的结构、逻辑性、语言表达和整体连贯性",
    icon: <FileText className="w-6 h-6 text-primary" />,
  },
];

export default Index;