'use client'

import ContentBlock from "@/app/components/ContentBlock";
import NamedFormField from "@/app/components/NamedFormField";

import styles from "./classes.module.scss";

function CodeBlock(props) {
    let code = props.code;
    let [l1, l2, l3, l4, l5, l6, l7] = code;

    return (
        <div className={styles.classCodeBlock} onClick={() => {navigator.clipboard.writeText(code)}}>
            <div className={styles.classCodeBlockDigit}>{l1}</div>
            <div className={styles.classCodeBlockDigit}>{l2}</div>
            <div className={styles.classCodeBlockDigit}>{l3}</div>
            <div className={styles.classCodeBlockDigit}>{l4}</div>
            <div className={styles.classCodeBlockDigit}>{l5}</div>
            <div className={styles.classCodeBlockDigit}>{l6}</div>
            <div className={styles.classCodeBlockDigit}>{l7}</div>
        </div>
    );
}

export default function ClassesPage() {
    return (
        <>
            <ContentBlock
                title="Информация о классе"
                value="Код класса:"
                data={
                    <CodeBlock code="2885775" />
                }
                between
            >
                <div>
                    <NamedFormField value="Название класса" data="11 физмат" />
                    <NamedFormField value="Классный руководитель" data="Магомедова П. Р." />
                    <NamedFormField value="Курс обучения" data="Python" />
                </div>

            </ContentBlock>

            <ContentBlock
                title="Список класса"
                value="Количество учеников:"
                data={17}
            >
            </ContentBlock>
        </>
    );
}
