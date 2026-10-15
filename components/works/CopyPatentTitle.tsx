"use client";
import { useEffect, useRef, useState } from "react";
import { Copy } from "lucide-react";
import styles from "@/app/works/page.module.css";

export function CopyPatentTitle({ title }: { title: string }) {
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timer.current !== null) clearTimeout(timer.current);
    };
  }, []);
  async function copy() {
    if (timer.current !== null) clearTimeout(timer.current);
    setStatus("");
    setPending(true);
    try {
      await navigator.clipboard.writeText(title);
      if (!mounted.current) return;
      setStatus("已复制");
      timer.current = setTimeout(() => { setStatus(""); timer.current = null; }, 2000);
    }
    catch {
      if (!mounted.current) return;
      setStatus("请选中下方专利名称手动复制");
      requestAnimationFrame(() => { input.current?.focus(); input.current?.select(); });
    }
    finally { if (mounted.current) setPending(false); }
  }
  return <span className={styles.copyApplication}>
    <button type="button" onClick={copy} disabled={pending}><Copy size={14} aria-hidden="true" />复制专利名称</button>
    <span role="status">{status}</span>
    {status.startsWith("请") && <input ref={input} aria-label="待复制的专利名称" value={title} readOnly />}
  </span>;
}
