'use client'

import ContentBlock   from "@/app/components/ContentBlock";
import NamedFormField from "@/app/components/NamedFormField";

import styles  from "./page.module.scss";


export default function ClassesPage() {
  function CodeBlock({code}) {
    return (
      <div className={styles.classCodeBlock} onClick={() => {
        navigator.clipboard.writeText(code)
      }}>
        {code.split('').map((letter, i) => <div key={i} className={styles.classCodeBlockDigit}>{letter}</div>)}
      </div>
    );
  }

  return (
    <>
      <ContentBlock
        title="Информация о классе"
        value="Код класса:"
        data={
          <CodeBlock code="2885775"/>
        }
        between
      >
        <div>
          <NamedFormField value="Название класса" data="11 физмат"/>
          <NamedFormField value="Классный руководитель" data="Магомедова П. Р."/>
          <NamedFormField value="Курс обучения" data="Python"/>
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
