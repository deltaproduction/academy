import Link from "next/link";

import styles from "./index.module.scss";


export default function Header(props) {
    return (
        <div className={styles.headerBlock}>
            <div>
                <div className={styles.logo}></div>
            </div>
            <div>
                <div className={styles.menuBlockWrapper}>
                    <Link href={"check"} className={styles.greyLink}>Задачи на проверку</Link>
                    <Link href={"/courses"} className={styles.greyLink}>Курсы</Link>
                    <Link href={"/classes"} className={styles.greyLink}>Классы</Link>
                </div>
            </div>
            <div>
                <div className={styles.userBlockWrapper}>
                    <div>Галуа Э.</div>
                    <div>
                        <Link href="lk" className={`${styles.greyLink} ${styles.personalAreaLink}`}>Личный кабинет</Link>
                    </div>
                </div>
            </div>

        </div>
    );
}
