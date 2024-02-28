import styles from "./index.module.scss";

export default function BlueButton(props) {
    return (
        <button className={styles.blueButton}>{props.text}</button>
    )
}

