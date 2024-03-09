import { useContext } from "react";
import Link           from "next/link";
import classNames     from "classnames";

import Logo from '@/components/logo.svg'

import { Context } from "@/components/ContextProvider";

import styles from "./index.module.scss";


export default function Header() {
  const {profile: {firstName, lastName}} = useContext(Context);

  return (
    <div className={styles.wrapper}>
      <div className="container">
        <div className={styles.headerBlock}>
          <div className={styles.logoWrapper}>
            <Logo className={styles.logo}/>
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
                <Link href="" title="Личный кабинет">{firstName + ' ' + (lastName ? lastName[0] + '.' : '')}</Link>
              </div>
              <div>
                <Link href={"/logout"} className={classNames(styles.greyLink, styles.personalAreaLink)}>Выйти</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
