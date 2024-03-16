import styles from "@/components/Table/index.module.scss";
import React from "react";

export const tableTypes = {
    "text": TextHandler,
    "rating": RatingHandler,
    "number": NumberHandler,
    "numberWithDot": NumberWithDotHandler
}

function TextHandler(string) {
    return string;
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
