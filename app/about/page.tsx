import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowDownToLine, ArrowUpRight, Mail, Phone } from "lucide-react";
import { education, photos, profile } from "@/lib/about";
import { skillGroups } from "@/lib/about-skills";
import { withBasePath } from "@/lib/site";
import PhotoGallery from "@/components/about/PhotoGallery";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  description: "认识赵旭阳：教育经历、研究方向、技能与生活片段。",
};

export default function AboutPage() {
  const resumeExists = fs.existsSync(path.join(process.cwd(), "public", profile.resume));
  return (
    <div className={styles.page}>
      <header className={styles.banner}>
        <Image src={withBasePath("/images/about/mountains.png")} alt="" fill priority sizes="100vw" className={styles.mountains} />
        <div className={`container ${styles.bannerContent}`}>
          <h1>Life is <span>True.</span></h1>
          <p>路漫漫其修远兮，<br />吾将上下而求索。</p>
        </div>
      </header>

      <div className={`container ${styles.content}`}>
        <section className={styles.introduction} aria-labelledby="profile-title">
          <PhotoGallery photos={photos} />
          <div className={styles.profile}>
            <header className={styles.identity}>
              <h2 id="profile-title">{profile.name}</h2>
              <p>{profile.nameEn}</p>
            </header>
            <p className={styles.research}>{profile.qualification}<span> / </span>{profile.research}</p>
            <dl className={styles.facts}>
              <div><dt>现居</dt><dd>{profile.location}</dd></div>
              <div><dt>家乡</dt><dd>{profile.hometown}</dd></div>
              <div><dt>政治面貌</dt><dd>{profile.affiliation}</dd></div>
              <div><dt>爱好</dt><dd>{profile.hobbies.join(" · ")}</dd></div>
            </dl>
            <div className={styles.contact}>
              <a href={`mailto:${profile.email}`}><Mail size={16} aria-hidden="true" /><span>{profile.email}</span><ArrowUpRight size={15} aria-hidden="true" /></a>
              <a href={`tel:${profile.phone}`}><Phone size={16} aria-hidden="true" /><span>{profile.phoneDisplay}</span><ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
            {resumeExists && <div className={styles.resume}>
              <a href={withBasePath(profile.resume)} target="_blank" rel="noreferrer">查看简历 <ArrowUpRight size={15} aria-hidden="true" /></a>
              <a href={withBasePath(profile.resume)} download>下载 PDF <ArrowDownToLine size={15} aria-hidden="true" /></a>
            </div>}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="education-title">
          <header className={styles.sectionHeading}><h2 id="education-title">Education</h2><span>教育经历</span></header>
          <div className={styles.timeline}>
            {education.map(item => <article className={styles.educationEntry} key={item.school}>
              <div className={styles.period}><p>{item.period}</p><span>{item.degree} / {item.degreeEn}</span></div>
              <div className={styles.educationBody}>
                <h3>{item.school}</h3><p className={styles.schoolEn}>{item.schoolEn}</p>
                <p className={styles.department}>{item.department}</p>
                <div className={styles.courseRow}><span>主要课程</span><div><p>{item.courses.slice(0, 3).join(" · ")}</p>
                  <div className={styles.courseActions}>
                    {item.courses.length > 3 && <details><summary>更多课程</summary><p>{item.courses.slice(3).join(" · ")}</p></details>}
                    <a className={styles.transcriptLink} href={withBasePath(item.transcript)} target="_blank" rel="noopener noreferrer" aria-label={`查看${item.degree}成绩证明 PDF（新窗口）`}>成绩证明 PDF <ArrowUpRight size={13} aria-hidden="true" /></a>
                  </div>
                </div></div>
                <div className={styles.courseRow}><span>荣誉奖励</span><p>{Array.from(new Set(item.rewards)).join(" · ")}</p></div>
              </div>
            </article>)}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="skills-title">
          <header className={styles.sectionHeading}><h2 id="skills-title">Skills</h2><span>技能与工具</span></header>
          <div className={styles.skillGroups}>
            {skillGroups.map(group => <div className={styles.skillGroup} key={group.title}>
              <header><h3>{group.title}</h3><p>{group.description}</p></header>
              <ul className={styles.skillList}>{group.skills.map(skill => {
                const Icon = skill.icon;
                return <li key={skill.name}><span className={styles.skillIcon} style={{ "--skill-color": skill.color } as CSSProperties} aria-hidden="true">{Icon ? <Icon /> : <span>{skill.mark}</span>}</span><span>{skill.name}</span></li>;
              })}</ul>
            </div>)}
          </div>
        </section>
      </div>
    </div>
  );
}
