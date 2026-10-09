import Image from "next/image";
import { withBasePath } from "@/lib/site";
import styles from "./ArchiveHeader.module.css";

type ArchiveHeaderProps = {
  title: string;
  statement: string;
  english: string;
  description: string;
  background: string;
};

export function ArchiveHeader({ title, statement, english, description, background }: ArchiveHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.background} aria-hidden="true">
          <Image src={withBasePath(background)} alt="" width={2172} height={724}
            sizes="(max-width: 767px) 900px, 100vw" priority />
        </div>
        <div className={styles.copy}>
          <h1>{title}</h1>
          <p className={styles.statement}>{statement}</p>
          <p className={styles.english} lang="en">{english}</p>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.description} lang="en">{description}</p>
        </div>
      </div>
    </header>
  );
}
