import Link from "next/link";

import styles from "./index.module.scss";

export default function Links(props) {
    let registerContent = <>
        У меня уже есть аккаунт.<br/>
        <Link href="/login" className={styles.link}>Войти по нему</Link>
    </>;

    let loginContent = <>
        <Link href="/register" className={styles.link}>Создать аккаунт</Link>
    </>;

    return (
        <>
            <div className={styles.formLinks}>
                {props.type === "register" ? registerContent : loginContent}
            </div>
        </>
    );
}
