import styles from "./index.module.scss";

export default function Button({text, ...props}) {
    props.className = props.className || []
    props.className.push(styles.button)
    return (
        <button {...props}>{text}</button>
    )
}

