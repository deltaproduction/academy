import styles from "./index.module.scss";
import classNames from "classnames";

export default function FormItem({title, name, type, errors, ...props}) {
    let error;

    if (errors) {
        let errorsArray = JSON.parse(errors);
        error = errorsArray[name];
    }

    return (
        <div className={styles.formItem}>
            <div className={styles.formItemTitle}>
                <div>{title}</div>
            </div>
            <div className={styles.formItemInputBlock}>
                <input
                    name={name}
                    type={type}
                    className={classNames(
                        styles.formItemInput,
                        error ? styles.errorField : null)}
                />
            </div>
        </div>
    )
}
