import Image from "next/image";
import Link from "next/link";
import { withBasePath } from "@/lib/site";
import styles from "./page.module.css";

const destinations = [
  { title: "Works", href: "/works" },
  { title: "Notes", href: "/notes" },
  { title: "Life", href: "/life" },
  { title: "Journey", href: "/journey" },
];

export default function Home() {
  return (
    <section className={styles.home} aria-labelledby="home-title">
      <Image className={styles.landscape} src={withBasePath("/images/home/cloud-sea.png")} alt="" fill priority sizes="100vw" />
      <div className={styles.veil} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h1 id="home-title">拾荒大青年</h1>
          <Image className={styles.badmo} src={withBasePath("/images/home/badmo-portrait.png")} alt="BadMo，我的狐猫伙伴与个人形象" width={180} height={180} priority />
        </div>
        <span className={styles.rule} aria-hidden="true" />
        <p className={styles.motto}>克己、慎独、守心、明性。</p>
        <nav className={styles.destinations} aria-label="探索我的个人空间">
          {destinations.map(({ title, href }) => <Link key={href} href={href}>{title}</Link>)}
        </nav>
      </div>
    </section>
  );
}
