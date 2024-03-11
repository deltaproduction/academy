import classNames from "classnames";

import Logo from '@/components/logo.svg'


import styles from "./index.module.scss";


export default function Header({profile: {firstName, lastName}}) {
  return (
    <div className={styles.wrapper}>
      <div className="container">
        <div className={styles.headerBlock}>
          <div className={styles.logoWrapper}>
            <Logo className={styles.logo}/>
          </div>
          <div>
            <div className={styles.menuBlockWrapper}>
              <a href={"/check"} className={styles.greyLink}>Задачи на проверку</a>
              <a href={"/courses"} className={styles.greyLink}>Курсы</a>
              <a href={"/classes"} className={styles.greyLink}>Классы</a>
            </div>
          </div>
          <div>
            <div className={styles.userBlockWrapper}>
              <div>
                <a href="" title="Личный кабинет">{firstName + ' ' + (lastName ? lastName[0] + '.' : '')}</a>
              </div>
              <div>
                <a href={"/logout"} className={classNames(styles.greyLink, styles.personalAreaLink)}>Выйти</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
