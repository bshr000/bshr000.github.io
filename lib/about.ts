import { siteConfig } from "./site";

export type AboutPhoto = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  objectPosition?: string;
};

export const profile = {
  name: "赵旭阳",
  nameEn: "Xuyang Zhao",
  qualification: "电子信息硕士",
  research: "多模态目标检测",
  location: "北京",
  hometown: "山东临沂",
  affiliation: "中共党员",
  hobbies: ["爬山", "篮球"],
  email: siteConfig.email,
  phone: "+8618369588966",
  phoneDisplay: "183 6958 8966",
  resume: "/resume/xuyang-zhao-resume.pdf",
};

// Add recent photographs here; each photo can have its own focal point.
export const photos: AboutPhoto[] = [
  { id: "snow", src: "/images/xuyang-zhao.webp", alt: "赵旭阳在雪夜中的个人照", caption: "雪夜留影", objectPosition: "58% 55%" },
];

export const education = [
  {
    school: "中国科学院大学",
    schoolEn: "University of Chinese Academy of Sciences",
    degree: "硕士",
    period: "2023.09 — 2026.06",
    degreeEn: "Master",
    department: "电子电气与通信工程学院 / 空天信息创新研究院",
    courses: [
      "计算机视觉",
      "图像处理",
      "模式识别与机器学习",
      "深度学习",
      "遥感影像处理",
      "光纤通信新技术",
    ],
    rewards: ["三好学生", "三好学生", "三好学生标兵"],
  },
  {
    school: "中国地质大学（北京）",
    schoolEn: "China University of Geosciences, Beijing",
    degree: "本科",
    period: "2019.09 — 2023.06",
    degreeEn: "Bachelor",
    department: "地球物理与信息技术学院",
    courses: [
      "重力勘探",
      "电法勘探",
      "磁法勘探",
      "地震勘探",
      "核物理勘探",
      "MATLAB 应用",
      "数字信号处理",
      "C 语言程序设计",
      "线性代数",
      "电子电工技术",
    ],
    rewards: [
      "优秀班干部",
      "三好学生",
      "优秀毕业生",
      "优秀毕业论文",
      "全国大学生英语竞赛三等奖",
      "全国大学生数学建模竞赛省一等奖",
    ],
  },
];
