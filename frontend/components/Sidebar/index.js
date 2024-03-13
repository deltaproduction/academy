import classNames from "classnames";


import styles          from "./index.module.scss";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const SidebarItem = ({children, href}) => {
  return (
    <div className={classNames(styles.item, {[styles.active]: usePathname() === href})}>
      {!!href && <a href={href} className={styles.itemLink}/>}
      {children}
    </div>
  );
}

export const Sidebar = ({children, newItemHref, title}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>{title}</div>
        {!!newItemHref && <a href={newItemHref} className={styles.plusButton} title={"Добавить класс"}></a>}
      </div>
      <div className={styles.items}>
        {children}
      </div>
    </div>
  );
}
