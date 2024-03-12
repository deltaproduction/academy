import styles from "./index.module.scss";

export default function SaveChangesField(props) {
    return (
        <div className={styles.field}>
            <button type="submit" className={styles.saveButton}>Сохранить изменения</button>
        </div>
    );
}
