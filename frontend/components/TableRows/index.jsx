import TableField from "@/components/TableField";

import styles from "./index.module.scss";

export default function TableRows(props) {
  let data = props.data;
  let columnsWidths = props.columnsWidths;

  let rowsElements = [];

  if (data.length) {
    data.forEach((row, index) => {
      rowsElements.push(
        <div className={styles.tableRow} key={index}>
          {
            row.map((i, x) => <TableField key={x} title={i} width={columnsWidths[x]}/>)
          }
        </div>
      );
    });
  } else {
    // rowsElements.push(<LoadingBlock key={3}/>);
  }

  return rowsElements;
}
