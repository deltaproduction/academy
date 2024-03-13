import { useState }  from "react";
import { useRouter } from "next/router";

import { ClassesApi }    from "@/lib/api";
import { useAppContext } from "@/components/ContextProvider";

import styles           from "./Class.module.scss";
import ContentBlock     from "@/components/ContentBlock";
import Table            from "@/components/Table";
import SaveChangesField from "@/components/SaveChangesField";


function FormField({label, ...props}) {
  return <div className={styles.formField}>
    <label>{label}:</label>
    <input className={styles.formItemInput} {...props}/>
  </div>
}

function CodeBlock(props) {
  let code = props.code;

  return (<div className={styles.classCodeBlock} onClick={() => navigator.clipboard.writeText(code)}>
    {code.toString().split('').map((letter, i) => (
      <div key={i} className={styles.classCodeBlockDigit}>{letter}</div>
    ))}
  </div>);
}

export const DataTitle = (props) => {
  return <div className={styles.contentBlockDataTitle}>
    <div>{props.value}</div>
    <div>{props.data}</div>
  </div>;
}


function generateStudentsData(studentsList) {
  return studentsList.map(
    ({firstName, lastName, email, average, rating}, i) => ([i + 1, `${firstName} ${lastName}`, email, average, rating])
  )
}


export default function Class({group = {}}) {
  let {id, code, title, students, teacherName} = group;

  const [editMode, setEditMode] = useState(!id);

  const router = useRouter();

  const {classes, updateContext} = useAppContext();

  const onFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    if (group.id) {
      const response = await ClassesApi.update(group.id, formData)
      const updatedClass = await response.json()
      updateContext({classes: classes.map(({id, title}) => group.id === id ? updatedClass : {id, title})})
      setEditMode(!response.ok)
      return
    }
    const response = await ClassesApi.create(formData)
    const {id, title} = await response.json()

    updateContext({classes: [...classes, {id, title}]})

    router.push(`/classes/${id}/`)
  }

  return (<>
      <ContentBlock
        setEditMode={setEditMode} editMode={editMode}
        title={id ? "Информация о классе" : "Новый класс"}
        between value="Код класса: "
        data={!!code && <CodeBlock code={code}/>}>
        <div>
          <form onSubmit={onFormSubmit}>
            <FormField label="Название класса" name="title" defaultValue={title} disabled={!editMode}/>
            <FormField label="Классный руководитель" name="teacher_name" defaultValue={teacherName}
                       disabled={!editMode}/>
            {!!editMode && <SaveChangesField/>}
          </form>
        </div>
      </ContentBlock>
      {id ?
        <ContentBlock title="Список класса" value="Учеников:" data={students.length}>
          {
            students.length ?
              <Table
                fields={
                  [
                    ["№", 8, "numberWithDot"],
                    ["Фамилия и имя", 40, "text"],
                    ["E-mail", 26, "text"],
                    ["Ср. усп.", 13, "rating"],
                    ["Баллы", 13, "number"]
                  ]
                }
                data={generateStudentsData(students)}
              />
              : "Пока ни один ученик не присоединился к группе. Сообщите ученикам код класса."
          }

        </ContentBlock>
        : null
      }
    </>
  );
}


/*return (
    <div className={styles.container}>
      {!id && <h1>Создание нового класса</h1>}
      <div>
        <div className={styles.title}>
          <h1>Информация о классе {
            editMode ? <Undo onClick={() => setEditMode(!editMode)}/> : <Edit onClick={() => setEditMode(!editMode)}/>
          }</h1>
          {!!code && <div className={styles.classCodeContainer}>
            <div>Код класса:</div>
            <div className={styles.classCodeBlock} onClick={() => navigator.clipboard.writeText(code)}>
              {code.toString().split('').map((letter, i) => (
                <div key={i} className={styles.classCodeBlockDigit}>{letter}</div>
              ))}
            </div>
          </div>}
        </div>
        <form onSubmit={onFormSubmit}>
          <FormField label="Название класса" name="title" defaultValue={title} disabled={!editMode}/>
          <FormField label="Классный руководитель" name="teacher_name" defaultValue={teacherName} disabled={!editMode}/>
          {!!editMode && <button className={styles.titleAction} type="submit">Сохранить</button>}
        </form>
      </div>

      {!!students && <div>
        <div className={styles.title}>
          <h1>Список класса</h1>
          <div className={styles.classCodeContainer}>
            <div>Количество учеников: {students.length}</div>
          </div>
        </div>
        {students.map(student => <div key={student}>{student.firstName} {student.lastName}</div>)}
      </div>}
    </div>
  );*/
