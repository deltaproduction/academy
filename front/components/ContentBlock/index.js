import styles from "./index.module.scss";

export const DataTitle = (props) => {
    return <div className={styles.contentBlockDataTitle}>
        <div>{props.value}</div>
        <div>{props.data}</div>
    </div>;
}

export default function ContentBlock(PropsWithChildren) {
    let between = PropsWithChildren.between;

    return (
        <div className={styles.contentBlock}>
            <div className={`${styles.titleBlock} ${between ? styles.between : null}`}>
                <h1 className={styles.blockTitleMed}>{PropsWithChildren.title}</h1>
                <DataTitle value={PropsWithChildren.value} data={PropsWithChildren.data} />
            </div>
            {PropsWithChildren.children}
        </div>
    );
}

