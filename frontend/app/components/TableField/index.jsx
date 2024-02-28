import styles from "./index.module.scss";


export default function TableField(props) {
    return (
        <div style={{width: props.width + "%"}}>
            <div className={styles.tableFieldBlock}>
                <div>{props.title}</div>

                {
                    props.sort ? <div className={styles.sortIcon} onClick={() => {
                        props.sortMethod(
                            props.number
                        )
                    }}></div> : null}
            </div>
        </div>
    );
}