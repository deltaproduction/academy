import React, {useState} from "react";
import {tableTypes} from "./DataHandler";

import styles from "./index.module.scss";



const TableField = (props) => {
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

function getTableRow(row, columnsWidths) {
    let result = [];

    for (let i = 0; i < row.length; i ++) {
        let element = row[i];

        result.push(<TableField key={i} title={element} width={columnsWidths[i]} />);

        if (i < row.length - 1) {
            result.push(<div key={i + row.length} className={styles.fieldsSeparator}></div>);
        }
    }

    return result;
}

function getFieldsRow(fields, sm) {
    let result = [];

    for (let i = 0; i < fields.length; i ++) {
        let field = fields[i];

        result.push(<TableField key={i} number={i} title={field[0]} width={field[1]} sortMethod={sm} sort bold />);

        if (i < fields.length - 1) {
            result.push(<div key={i + fields.length} className={styles.fieldsSeparator}></div>);
        }
    }

    return result;
}


const TableRows = (props) => {
    let data = props.data;
    let columnsWidths = props.columnsWidths;

    let rowsElements = [];

    if (data.length) {
        data.forEach((row, index) => {
            rowsElements.push(
                <div className={styles.tableRow} key={index}>
                    {getTableRow(row, columnsWidths)}
                </div>
            );
        });
    }

    return rowsElements;
}


function getColumnsWidths(fields) {
    let columnsWidths = [];

    for (let i = 0; i < fields.length; i++)
        columnsWidths.push(fields[i][1]);

    return columnsWidths;
}

const TableFieldsRow = (props) => {
    let fields = props.fields;

    return <div className={styles.tableFirstRow}>
        {
            getFieldsRow(fields, props.sortMethod)
        }
    </div>;
}

function sortList(data, setData, sortInfo, setSortInfo, by) {
    let [lastBy, reversed] = sortInfo;
    let [_lastBy, _reversed] = [...sortInfo];


    let list;

    if (lastBy === null) {
        list = SortedListBy(data, by, !reversed);

    } else if (lastBy === by) {
        list = SortedListBy(data, by, !reversed);

    } else {
        list = SortedListBy(data, by, !reversed);
    }

    _reversed = !reversed;

    if (list.toString() === data.toString()) {
        list = SortedListBy(data, by, !_reversed);
        _reversed = !_reversed
    }

    _lastBy = by;

    setSortInfo([_lastBy, _reversed]);
    setData(list);
}

export default function Table(props) {
    let fields = props.fields;

    let [tableData, setTableData] = useState(props.data);

    let columnsWidths = getColumnsWidths(fields);

    let [sortInfo, setSortInfo] = useState([null, false]);

    return (
        <div>
            <TableFieldsRow
                fields={fields}
                sortMethod={(by) => sortList(tableData, setTableData, sortInfo, setSortInfo, by)}
            />
            <TableRows
                data={handleTableData(fields, tableData)}
                columnsWidths={columnsWidths}
            />
        </div>
    );
}

function handleTableData(fields, data) {
    let result = [];

    if (data) {
        data.forEach(row => {
            let tmp = [];

            for (let i = 0; i < row.length; i++) {
                let content = row[i];
                let reprCallback = tableTypes[fields[i][2]];

                tmp.push(reprCallback(content));
            }

            result.push(tmp);
        });
    }
    return result;
}

function SortedListBy(list, by, reversed) {
    const sortFunction = (a, b) => (a[by] > b[by]) ? 1 : ((b[by] > a[by]) ? -1 : 0);

    let result;

    if (reversed)
        result= [...list].sort((a, b) => sortFunction(b, a));

    else
        result= [...list].sort((a, b) => sortFunction(a, b));

    return result;
}
