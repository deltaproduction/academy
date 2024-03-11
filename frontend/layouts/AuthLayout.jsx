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
          <li><a href="/" className={styles.link}>Пользовательское соглашение</a></li>
          <li><a href="/" className={styles.link}>Техническая документация</a></li>
          <li><a href="/" className={styles.link}>О платформе Delta Academy</a></li>
          <li><a href="https://delta.com.ru" className={styles.link}>Официальный сайт Delta</a></li>
        </ul>
      </div>
    </div>
  );
}
