import styles from "./index.module.scss";
import {Edit, Undo} from "@mui/icons-material";

export const DataTitle = (props) => {
    if (props.data)
        return <div className={styles.contentBlockDataTitle}>
            <div>{props.value}</div>
            <div>{props.data}</div>
        </div>;

    return null;
}

export const EditButton = (props) => {
    let editMode = props.editMode;
    let setEditMode = props.setEditMode;

    return <div className={styles.editButton}>
        {editMode ? <Undo onClick={() => setEditMode(!editMode)}/> : <Edit onClick={() => setEditMode(!editMode)}/>}
    </div>;
}

export default function ContentBlock(PropsWithChildren) {
    let between = PropsWithChildren.between;

    let setEditMode = PropsWithChildren.setEditMode;
    let editMode = PropsWithChildren.editMode;

    return (
        <div className={styles.contentBlock}>
            <div className={`${styles.titleBlock} ${between ? styles.between : null}`}>
                <h1 className={styles.blockTitleMed}>{PropsWithChildren.title}

                    { setEditMode ? <EditButton
                        editMode={editMode}
                        setEditMode={setEditMode}
                    /> : null}

                </h1>
                <DataTitle value={PropsWithChildren.value} data={PropsWithChildren.data} />
            </div>
            {PropsWithChildren.children}
        </div>
    );
}

