import Link from "next/link";
import { getWorkMembers, type WorkContent } from "@/lib/works";
import { WorkResources } from "./WorkResources";
import styles from "@/app/works/page.module.css";

export function WorkPublications({ item }: { item: WorkContent }) {
  const members = getWorkMembers(item);
  if (!members.length) return null;
  return <div className={styles.publications}>{members.map(member => <article key={member.slug} id={member.slug} className={styles.publication}>
    <h4><Link href={`/works/${member.slug}`}>{member.title}</Link><span>{member.year}</span></h4>
    <p>{member.fullTitle}</p>
    {member.authors && <p>{member.authors.split(/(赵旭阳|Xuyang Zhao|X\. Zhao)/).map((part, index) => /^(赵旭阳|Xuyang Zhao|X\. Zhao)$/.test(part) ? <strong key={index}>{part}</strong> : part)}</p>}
    {member.venue && <p>{member.venue}</p>}
    <WorkResources item={member} />
  </article>)}</div>;
}
