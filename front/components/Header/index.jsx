'use client'

import { useContext } from "react";
import Link           from "next/link";
import classNames     from "classnames";

import { Context } from "@/app2/components/ContextProvider";

import styles from "./index.module.scss";


export default function Header() {
  const {profile: {firstName, lastName}} = useContext(Context);

  return (
    <div className={styles.wrapper}>
      <div className="container">
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
