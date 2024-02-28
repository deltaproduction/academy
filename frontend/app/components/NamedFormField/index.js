import styles from "./index.module.scss";

export default function NamedFormField(props) {
    return (
        <div className={styles.namedFormFieldBlock}>
            <div>{props.value}:</div>
            <div>
                <input type="text" defaultValue={props.data} className={styles.formItemInput} />
            </div>
        </div>
    );
}
