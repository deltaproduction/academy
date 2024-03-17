import styles from "./index.module.scss";

export default function SubmitButton({text="Сохранить изменения"}) {
    return (
        <div className={styles.field}>
            <button type="submit" className={styles.saveButton}>{text}</button>
        </div>
    );
}
