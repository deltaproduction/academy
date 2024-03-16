import styles         from "./index.module.scss";
import { Edit, Undo } from "@mui/icons-material";

export const DataTitle = (props) => {
  if (props.data)
    return <div className={styles.contentBlockDataTitle}>
      <div>{props.value}</div>
      <div>{props.data}</div>
    </div>;

  return null;
}

export default function ContentBlock({children, title, between, editMode, setEditMode, value, data}) {
  return (
    <div className={styles.contentBlock}>
      <div className={`${styles.titleBlock} ${between ? styles.between : null}`}>
        <h1 className={styles.blockTitleMed}>{title}

          {!!setEditMode && <div className={styles.editButton}>
            {editMode ? <Undo onClick={() => setEditMode(!editMode)}/> : <Edit onClick={() => setEditMode(!editMode)}/>}
          </div>}

        </h1>
        <DataTitle value={value} data={data}/>
      </div>
      {children}
    </div>
  );
}

