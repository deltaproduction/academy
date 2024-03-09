import styles from "./index.module.scss";

export default function FormRowSided(props) {
    return (
        <div className={styles.formRowSided}>
            <div className={styles.leftSide}>
                {props.leftSide}
            </div>
            <div className={styles.leftSide}>
                {props.rightSide}
            </div>
        </div>
    )
}
