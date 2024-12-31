import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Brain,
  BriefcaseIcon,
  FileText,
  GraduationCap,
  PenTool,
  Rocket,
  Sparkles,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceContact } from "@/components/ServiceContact";

const features = [
  {
    title: "申请动机",
    description: "您的申请动机是否足够清晰、具体，兼具个人特色和学术兴趣？",
    icon: <Brain className="w-6 h-6 text-primary" />,
  },
  {
    title: "学术能力",
    description: "您是否充分展现了具体的学术能力，而非只对所学课程泛泛而谈？",
    icon: <GraduationCap className="w-6 h-6 text-primary" />,
  },
  {
    title: "实习经验",
    description:
      "您是否详细描绘了具体工作任务中的硬技能与软实习，而非生硬罗列实习或职业经历的基本信息？",
    icon: <BriefcaseIcon className="w-6 h-6 text-primary" />,
  },
  {
    title: "选校原因",
    description:
      "您的选校理由是否个性化定制，而非放之四海而皆准的”院校声望排名“？",
    icon: <BookOpen className="w-6 h-6 text-primary" />,
  },
  {
    title: "职业规划",
    description: "您的规划是否具体且明确？是否有清晰的职业发展脉络？",
    icon: <Rocket className="w-6 h-6 text-primary" />,
  },
  {
    title: "写作质量",
    description: "您的行文是否逻辑流畅，语言是否正确、准确又具个人风格？",
    icon: <PenTool className="w-6 h-6 text-primary" />,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background relative overflow-hidden">
      {/* Animated decorative elements */}
      <div className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 opacity-70">
        <div className="absolute inset-0 border-4 border-dashed border-primary/30 rounded-lg animate-[spin_12s_linear_infinite] origin-center" />
        <div className="absolute inset-8 border-4 border-dashed border-primary/20 rounded-lg animate-[spin_16s_linear_infinite_reverse] origin-center" />
        <div className="absolute inset-16 border-4 border-dashed border-primary/10 rounded-lg animate-[spin_20s_linear_infinite] origin-center" />
      </div>

      <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 opacity-70">
        <div className="absolute inset-0 border-4 border-dashed border-primary/30 rounded-lg animate-[spin_12s_linear_infinite_reverse] origin-center" />
        <div className="absolute inset-8 border-4 border-dashed border-primary/20 rounded-lg animate-[spin_16s_linear_infinite] origin-center" />
        <div className="absolute inset-16 border-4 border-dashed border-primary/10 rounded-lg animate-[spin_20s_linear_infinite_reverse] origin-center" />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl relative z-10">
        <div className="text-center animate-fade-up mb-20">
          <div className="flex justify-center mb-6">
            <img
              src="/lovable-uploads/392db423-89a7-4be0-be5f-d508e73d5651.png"
              alt="PS Logo"
              className="w-32 h-32 mb-4 hover:scale-110 transition-transform duration-300"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight relative group">
            <span className="inline-block animate-[tracking-in-expand_0.7s_cubic-bezier(0.215,0.610,0.355,1.000)_both] hover:text-primary transition-colors duration-300">
              PS Mentor<br />你的24小时 AI 文书评估老师
            </span>
            <span className="absolute -bottom-2 left-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full group-hover:left-0">
            </span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground mb-8 mx-auto leading-relaxed overflow-x-auto flex justify-center">
            <span className="font-bold hover:text-primary transition-colors duration-300">
              最前沿的 AI
              算法，最资深的研发团队，最精细的文书多维剖析，为您的留学保驾护航！
            </span>
          </p>
          <Link to="/editor">
            <Button
              size="lg"
              className="gap-2 transform hover:scale-110 hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              一键评估 <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <Card className="p-6 animate-fade-up group hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <CardContent className="p-0">
              <div className="flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-primary group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
              </div>
              <h2 className="text-2xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300 text-center">
                留学文书/PS的重要性
              </h2>
              <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                个人陈述（Personal Statement,
                简称文书/PS）是欧美大学申请中重要的一环。一篇出色的 PS
                能在一定程度上<span className="text-primary drop-shadow-[0_0_0.5px_#7c3aed] group-hover:drop-shadow-[0_0_2px_#7c3aed] transition-all duration-300">
                  弥补学术成绩及相关经验的不足
                </span>，帮助申请者脱颖而出。相反，一篇质量不佳的 PS
                可能会<span className="text-primary drop-shadow-[0_0_0.5px_#7c3aed] group-hover:drop-shadow-[0_0_2px_#7c3aed] transition-all duration-300">
                  拉低整体申请水平
                </span>，让招生官对申请者的综合能力产生质疑。
              </p>
            </CardContent>
          </Card>

          <Card
            className="p-6 animate-fade-up group hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            style={{ animationDelay: "100ms" }}
          >
            <CardContent className="p-0">
              <div className="flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-primary group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
              </div>
              <h2 className="text-2xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300 text-center">
                留学文书/PS现存困境
              </h2>
              <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                在实际申请过程中，许多申请者因<span className="text-primary drop-shadow-[0_0_0.5px_#7c3aed] group-hover:drop-shadow-[0_0_2px_#7c3aed] transition-all duration-300">
                  缺乏对 PS 写作要求的系统理解
                </span>，或受到<span className="text-primary drop-shadow-[0_0_0.5px_#7c3aed] group-hover:drop-shadow-[0_0_2px_#7c3aed] transition-all duration-300">
                  市面上质量参差不齐的文书代写机构的影响
                </span>，往往难以撰写出符合学校期望的文书。这不仅增加了申请的难度，也使一些本具竞争力的申请者未能有效展现自己的潜力，从而错失录取机会！
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <h2 className="text-4xl font-bold text-center mb-6 relative group">
          <span className="inline-block animate-[tracking-in-expand_0.7s_cubic-bezier(0.215,0.610,0.355,1.000)_both] hover:text-primary transition-colors duration-300">
            六大评估维度
          </span>
          <span className="absolute -bottom-2 left-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full group-hover:left-0">
          </span>
        </h2>

        <div className="text-center animate-fade-up mb-12">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto font-bold hover:text-foreground transition-colors duration-300">
            My PS Mentor 将从以下六大维度切入，对您的PS展开深度解析，<br />
            <span className="text-primary">
              为您精准打分，解读每一项得分背后的原因，提供个性化的修改建议
            </span>，
            <br />
            超千字的 PS 评估报告，助您的 PS 脱颖而出，为留学申请增添有力筹码！
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="p-6 animate-fade-up group hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-125 group-hover:bg-primary/20 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <ServiceContact />
    </div>
  );
};

export default Index;
