import styles from "./index.module.scss";

import classNames from "classnames";
import React from "react";


export function CharField({label, name, errors, ...props}) {
    let error;

    if (errors)
        error = errors[name];

    return <>
        <div className={classNames(styles.field, error ? styles.errorField : null)}>
            <label>{label}:</label>
            <input
                {...props}
                name={name}
                className={styles.input}
            />
        </div>
        {
            error ? <p className={styles.errorMessage}>{error}</p>
                : null
        }
    </>
}

export function SelectField({label, children, ...props}) {
    return <div className={styles.field}>
        <label>{label}:</label>
        <select {...props}>
            {children}
        </select>
    </div>
}

