"use client";

import { useRef, useState } from "react";
import { Copy, Mail, X } from "lucide-react";
import styles from "./EmailContact.module.css";

export function EmailContact({ email }: { email: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("邮箱已复制");
    } catch {
      addressRef.current?.focus();
      addressRef.current?.select();
      setStatus("无法自动复制，已选中邮箱，请手动复制。");
    }
  }

  return <>
    <button type="button" className={styles.trigger} aria-haspopup="dialog" onClick={() => {
      setStatus("");
      dialogRef.current?.showModal();
    }}>Email</button>
    <dialog ref={dialogRef} className={styles.dialog} aria-label="邮件联系">
      <div className={styles.heading}>
        <h2>邮件联系</h2>
        <button type="button" className={styles.close} aria-label="关闭邮箱弹窗" onClick={() => dialogRef.current?.close()}><X size={18} aria-hidden="true" /></button>
      </div>
      <input ref={addressRef} className={styles.address} aria-label="邮箱地址" value={email} readOnly onFocus={event => event.currentTarget.select()} />
      <div className={styles.actions}>
        <button type="button" onClick={copyEmail}><Copy size={16} aria-hidden="true" />复制邮箱</button>
        <a href={`mailto:${email}`}><Mail size={16} aria-hidden="true" />打开邮件应用</a>
      </div>
      <p className={styles.status} role="status">{status}</p>
    </dialog>
  </>;
}
