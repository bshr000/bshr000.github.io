import Link from "next/link";
import { siteConfig } from "@/lib/site";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Intl.DateTimeFormat("en", { year: "numeric", timeZone: "Asia/Shanghai" }).format(new Date());
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.identity}>
          <Link href="/" className={styles.signature}>{siteConfig.name}</Link>
          <span className={styles.motto}>LIFE IS TRUE.</span>
        </div>
        <div className={styles.right}>
          <nav className={styles.links} aria-label="页脚导航">
            <Link href="/about">About</Link>
            <span aria-hidden="true">·</span>
            <a href={siteConfig.github}>GitHub</a>
            <span aria-hidden="true">·</span>
            <a href={`mailto:${siteConfig.email}`}>Email</a>
          </nav>
          <span className={styles.divider} aria-hidden="true">|</span>
          <p className={styles.copyright}>© {year} · Build slowly, keep thoughtfully</p>
        </div>
      </div>
    </footer>
  );
}
