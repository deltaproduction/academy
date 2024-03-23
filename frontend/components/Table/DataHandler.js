import styles from "@/components/Table/index.module.scss";
import React from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";

export const tableTypes = {
    "text": TextHandler,
    "rating": RatingHandler,
    "link": LinkHandler,
    "numberWithDot": NumberWithDotHandler,
    "visibility": VisibilityHandler,
    "topicType": TopicTypeHandler,
    "taskCheckType": TaskCheckTypeHandler
}

function TextHandler(string) {
    return string;
}

function TaskCheckTypeHandler(type) {
    let types = ["ручная", "автомат."];

    return types[type];
}

function TopicTypeHandler(type) {
    let types = ["учебный", "с/р", "к/р"];

    return types[type];
}


function VisibilityHandler(visible) {
    if (visible)
        return <Visibility />;

    return <VisibilityOff />
}

function LinkHandler(data) {
    let text = data[0];
    let address = data[1];

    return <a href={address} className={styles.link}>{text}</a>;
}

function RatingHandler(string) {
    let color = string <= 10 ? styles.red: (string < 50 ? styles.yellow : styles.green);
    return (
        <div className={`${styles.rating} ${color}`}>
            {string ? string + '%' : '-'}
        </div>
    );
}

function NumberHandler(string) {
    return string;
}

function NumberWithDotHandler(string) {
    return string + ".";
}
