import classNames from "classnames";


import styles from "./index.module.scss";
import Link   from "next/link";

export const SidebarItem = ({children, href, active}) => {
  return (
    <div className={classNames(styles.item, {[styles.active]: active})}>
      {!!href && <Link href={href} className={styles.itemLink}/>}
      {children}
    </div>
  );
}

export const Sidebar = ({children, newItemHref, title}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>{title}</div>
        {!!newItemHref && <Link href={newItemHref} className={styles.plusButton}></Link>}
      </div>
      <div className={styles.items}>
        {children}
      </div>
    </div>
  );
}
