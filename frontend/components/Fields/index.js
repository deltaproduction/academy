import styles from "./index.module.scss";

import classNames from "classnames";
import React      from "react";


export function CharField({label, name, error, ...props}) {
  return <>
    <div className={classNames(styles.field, {[styles.errorField]: error})}>
      <label>{label}:</label>
      <input
        {...props}
        name={name}
        className={styles.input}
      />
    </div>
    {!!error && <p className={styles.errorMessage}>{error}</p>}
  </>
}

export function NumberField({label, name, error, ...props}) {
  return <CharField label={label} name={name} error={error} type="number" {...props}/>
}

export function TextField({label, rows = 10, ...props}) {
  return <div className={styles.field}>
    <label>{label}:</label>
    <textarea rows={rows} className={styles.text} {...props}/>
  </div>
}

export function SelectField({label, children, ...props}) {
  return <div className={styles.field}>
    <label>{label}:</label>
    <select {...props}>
      {children}
    </select>
  </div>
}

