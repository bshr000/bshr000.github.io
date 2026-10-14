import type { IconType } from "react-icons";
import { BsOpenai } from "react-icons/bs";
import { DiPhotoshop } from "react-icons/di";
import { PiMicrosoftPowerpointLogoFill } from "react-icons/pi";
import {
  SiClaude,
  SiCss,
  SiDocker,
  SiGithub,
  SiHuggingface,
  SiHtml5,
  SiLatex,
  SiLinux,
  SiNextdotjs,
  SiOpencv,
  SiPycharm,
  SiPython,
  SiPytorch,
  SiQgis,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
type Skill =
  | { name: string; color: string; icon: IconType; mark?: never }
  | { name: string; color: string; icon?: never; mark: string };

const skills: Skill[] = [
  { name: "Python", color: "#3776ab", icon: SiPython },
  { name: "PyTorch", color: "#ee4c2c", icon: SiPytorch },
  { name: "VS Code", color: "#007acc", icon: VscVscode },
  { name: "PyCharm", color: "#21d789", icon: SiPycharm },
  { name: "MATLAB", color: "#e16737", mark: "M" },
  { name: "Linux", color: "#f2c94c", icon: SiLinux },
  { name: "Photoshop", color: "#31a8ff", icon: DiPhotoshop },
  { name: "剪映", color: "var(--color-text-primary)", mark: "剪" },
  {
    name: "GitHub",
    color: "var(--color-text-primary)",
    icon: SiGithub,
  },
  { name: "Docker", color: "#2496ed", icon: SiDocker },
  { name: "WPS", color: "#d12f2f", mark: "WPS" },
  {
    name: "PowerPoint",
    color: "#d24726",
    icon: PiMicrosoftPowerpointLogoFill,
  },
  { name: "ChatGPT", color: "#10a37f", icon: BsOpenai },
  { name: "Claude", color: "#d97757", icon: SiClaude },
  {
    name: "Next.js",
    color: "var(--color-text-primary)",
    icon: SiNextdotjs,
  },
  { name: "OpenCV", color: "#5c3ee8", icon: SiOpencv },
  { name: "Hugging Face", color: "#e3ad00", icon: SiHuggingface },
  { name: "HTML", color: "#e34f26", icon: SiHtml5 },
  { name: "CSS", color: "#1572b6", icon: SiCss },
  { name: "LaTeX", color: "#008080", icon: SiLatex },
  { name: "QGIS", color: "#589632", icon: SiQgis },
];


export const skillGroups = [
  { title: "研究与计算", description: "Research & Computing", names: ["Python", "PyTorch", "OpenCV", "Hugging Face", "MATLAB", "QGIS"] },
  { title: "开发与工程", description: "Development & Engineering", names: ["Next.js", "HTML", "CSS", "GitHub", "Docker", "Linux", "VS Code", "PyCharm"] },
  { title: "写作与创作", description: "Writing & Creation", names: ["LaTeX", "WPS", "PowerPoint", "Photoshop", "剪映", "ChatGPT", "Claude"] },
].map(group => ({ ...group, skills: group.names.map(name => skills.find(skill => skill.name === name)!) }));
