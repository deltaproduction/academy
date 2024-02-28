import Link from "next/link";

import styles     from "./index.module.scss";
import classNames from "classnames";


export default function Header({user: {firstName, lastName}}) {
  return (
    <div className={styles.headerBlock}>
      <div>
        <div className={styles.logo}></div>
      </div>
      <div>
        <div className={styles.menuBlockWrapper}>
          <Link href={"/check"} className={styles.greyLink}>Задачи на проверку</Link>
          <Link href={"/courses"} className={styles.greyLink}>Курсы</Link>
          <Link href={"/classes"} className={styles.greyLink}>Классы</Link>
        </div>
      </div>
      <div>
        <div className={styles.userBlockWrapper}>
          <div>
            <Link href="lk" title="Личный кабинет">{firstName + ' ' + (lastName ? lastName[0] + '.' : '')}</Link>
          </div>
          <div>
            <Link href="/logout" className={classNames(styles.greyLink, styles.personalAreaLink)}>Выйти</Link>
          </div>
        </div>
      </div>

    </div>
  );
}
