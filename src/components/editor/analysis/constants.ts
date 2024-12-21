import { Star, BookOpen, Award, GraduationCap, TrendingUp, CheckCircle2 } from "lucide-react"

export const criteriaIcons: Record<string, any> = {
  purpose_and_motivation: Star,
  academic_competence: BookOpen,
  professional_internship_competence: Award,
  program_specific_reasons: GraduationCap,
  future_career_planning: TrendingUp,
  quality_of_writing: CheckCircle2,
};

export const criteriaNames: Record<string, Record<string, string>> = {
  en: {
    purpose_and_motivation: "Purpose & Motivation",
    academic_competence: "Academic Competence",
    professional_internship_competence: "Professional/Internship Competence",
    program_specific_reasons: "Program-specific Reasons",
    future_career_planning: "Future Career Planning",
    quality_of_writing: "Quality of Writing",
  },
  zh: {
    purpose_and_motivation: "目的与动机",
    academic_competence: "学术能力",
    professional_internship_competence: "专业/实习能力",
    program_specific_reasons: "项目选择原因",
    future_career_planning: "职业规划",
    quality_of_writing: "写作质量",
  }
};