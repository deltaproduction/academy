import ExplanationIcon from "@/app2/components/ExplanationIcon";

import styles from "./index.module.scss";

export default function FormItem(props) {
    return (
        <div className={styles.formItem}>
            <div className={styles.formItemTitle}>
                <div>{props.title}</div>
                <ExplanationIcon />
            </div>
            <div className={styles.formItemInputBlock}>
                <input name={props.name} type={props.type} className={styles.formItemInput}/>
            </div>
        </div>
    )
}
