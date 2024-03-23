import styles from "./index.module.scss";

export default function SubmitButton({text="Сохранить изменения", ...props}) {
    return (
        <div className={styles.field}>
            <button type="submit" className={styles.saveButton} {...props}>{text}</button>
        </div>
    );
}
