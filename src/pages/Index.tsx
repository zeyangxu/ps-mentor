import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Sparkles, Target, BookOpen, BriefcaseIcon, GraduationCap, Brain, Rocket, PenTool } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "申请动机",
    description: "你的学习动机是否清晰、具体且令人信服？",
    icon: <Brain className="w-6 h-6 text-primary" />,
  },
  {
    title: "学术能力",
    description: "你是否充分展现了具体的学术能力，而非只对课程理论泛泛而谈？",
    icon: <GraduationCap className="w-6 h-6 text-primary" />,
  },
  {
    title: "实习经验",
    description: "你是否详细描绘了具体工作任务中的硬技能与软实习，而非生硬罗列实习或职业经历的基本信息？",
    icon: <BriefcaseIcon className="w-6 h-6 text-primary" />,
  },
  {
    title: "选校原因",
    description: "你的选校理由是否仅仅只提及了院校的声望排名？",
    icon: <BookOpen className="w-6 h-6 text-primary" />,
  },
  {
    title: "职业规划",
    description: "你的规划是否具体且明确？是否有清晰的发展脉络？",
    icon: <Rocket className="w-6 h-6 text-primary" />,
  },
  {
    title: "写作质量",
    description: "你的语言是否正确、准确、流畅又具个人风格？",
    icon: <PenTool className="w-6 h-6 text-primary" />,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background relative">
      {/* Decorative elements */}
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

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center animate-fade-up mb-20">
          <div className="flex justify-center mb-6">
            <Sparkles className="w-12 h-12 text-primary animate-[spin_8s_linear_infinite]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            留学文书锐评器
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold">最前沿的 AI 算法，最资深的研发团队，最精细的文书多维剖析，为您的留学保驾护航！</span>
          </p>
          <Link to="/editor">
            <Button size="lg" className="gap-2">
              开始评估abc <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <Card className="p-6 animate-fade-up group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-0">
              <div className="flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">文书/PS的重要性</h2>
              <p className="text-muted-foreground leading-relaxed">
                个人陈述（Personal Statement, 简称PS）是欧美大学申请中至关重要的一环。一篇出色的PS不仅能<span className="text-primary drop-shadow-[0_0_0.5px_#7c3aed]">弥补学术成绩及相关经验的不足</span>，还能帮助申请者在众多竞争者中脱颖而出。而相反，一篇质量不佳的PS可能会<span className="text-primary drop-shadow-[0_0_0.5px_#7c3aed]">拉低整体申请水平</span>，甚至让招生官对申请者的能力和动机产生质疑。
              </p>
            </CardContent>
          </Card>
          
          <Card className="p-6 animate-fade-up group hover:shadow-lg transition-all duration-300" style={{ animationDelay: "100ms" }}>
            <CardContent className="p-0">
              <div className="flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">现存问题</h2>
              <p className="text-muted-foreground leading-relaxed">
                在实际申请过程中，许多申请者因<span className="text-primary drop-shadow-[0_0_0.5px_#7c3aed]">缺乏对PS写作要求的系统理解</span>，或受到<span className="text-primary drop-shadow-[0_0_0.5px_#7c3aed]">市面上质量参差不齐的文书代写机构的影响</span>，往往难以撰写出符合学校期望的个人陈述。这不仅增加了申请的难度，也使一些本具竞争力的申请者未能有效展现自己的潜力，错失录取机会！
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <h2 className="text-3xl font-bold text-center mb-6">六大评估维度</h2>
        
        <div className="text-center animate-fade-up mb-12">
          <p className="text-base text-muted-foreground leading-relaxed max-w-4xl mx-auto font-bold">
            我们将从以下六大维度切入，对您的PS展开深度解析，<br />
            <span className="text-primary drop-shadow-[0_0_0.5px_#7c3aed]">为您</span><span className="text-primary drop-shadow-[0_0_0.5px_#7c3aed]">精准打分，解读每一项得分背后的原因，提供个性化的修改建议</span>，
            <br />
            助您的 PS 脱颖而出，为留学申请增添有力筹码！
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="p-6 animate-fade-up group hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
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

export default Index;