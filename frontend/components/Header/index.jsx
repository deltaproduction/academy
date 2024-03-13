import classNames from "classnames";

import styles from "./index.module.scss";
import Link from "next/link";


export default function Header({menu, profile: {firstName, lastName}, fixed}) {
  return (
      <div className={classNames(styles.headerBlock, fixed ? styles.fixed : null)}>
        <div>
          <div className={styles.logo}></div>
        </div>
        <div>
          <div className={styles.menuBlockWrapper}>
            {
              menu.map((item) => <Link href={item[1]} key={item} className={styles.greyLink}>{item[0]}</Link>)
            }
          </div>
        </div>
        <div>
          <div className={styles.userBlockWrapper}>
            <div>
              <a href="" className={styles.lkLink} title="Личный кабинет">
                {firstName + ' ' + (lastName ? lastName[0] + '.' : '')}
              </a>
            </div>
            <div>
              <a href="/logout" className={classNames(styles.greyLink, styles.logoutLink)}>Выйти</a>
            </div>
          </div>
        </div>

      </div>
  );
}

