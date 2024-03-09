import Link from "next/link";
import Logo from "@/components/logo.svg"

import styles from "./AuthLayout.module.scss";

export default function AuthLayout({children}) {
  return (
    <div className={styles.body}>
      <div className={styles.authBlockWrapper}>
        <div className={styles.logo}>
          <Logo />
        </div>
        <div className={styles.authBlock}>
          <div>
            {children}
          </div>
        </div>
      </div>
      <div className={styles.globalLinksBlock}>
        <ul className={styles.globalLinks}>
          <li><Link href="/" className={styles.link}>Пользовательское соглашение</Link></li>
          <li><Link href="/" className={styles.link}>Техническая документация</Link></li>
          <li><Link href="/" className={styles.link}>О платформе Delta Academy</Link></li>
          <li><Link href="https://delta.com.ru" className={styles.link}>Официальный сайт Delta</Link></li>
        </ul>
      </div>
    </div>
  );
}
