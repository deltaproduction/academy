import styles from "./index.module.scss";

export function CharField({label, ...props}) {
  return <div className={styles.field}>
    <label>{label}:</label>
    <input className={styles.input} {...props}/>
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

