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
    </div>
  );
}
