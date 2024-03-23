import styles from "./index.module.scss";
import classNames from "classnames";
import React from "react";

export default function FormItem({title, name, type, errors, ...props}) {
    let error;

    if (errors)
        error = errors[name];

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
            {errors.password ? <>{title}: {errors.password}</> : null}
        </div>
    )
}
