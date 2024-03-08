'use client'

import { useState } from "react";
import { redirect } from "next/navigation";

import { Edit, Undo } from '@mui/icons-material';

import { createGroup, updateGroup } from "@/lib/api";
import { useAppContext }            from "@/app/components/ContextProvider";

import styles from "./Class.module.scss";


function FormField({label, ...props}) {
  return <div className={styles.formField}>
    <label>{label}:</label>
    <input className={styles.formItemInput} {...props}/>
  </div>
}

export default function Class({groupData = {}}) {
  const [group, setGroup] = useState(groupData)
  const [editMode, setEditMode] = useState(!group.id);

  const {id, code, title, students, teacherName} = group

  const {classes, updateContext} = useAppContext()

  const onFormSubmit = async formData => {
    if (group.id) {
      const response = await updateGroup(group.id, formData)
      const updatedClass = await response.json()
      updateContext({classes: classes.map(({id, title}) => group.id === id ? updatedClass : {id, title})})
      setEditMode(!response.ok)
      return
    }
    const response = await createGroup(formData)
    const createdClass = await response.json()

    updateContext({classes: [...classes, createdClass]})

    redirect(`/classes/${id}/`)
  }

  return (
    <div className={styles.container}>
      {!id && <h1>Создание нового класса</h1>}
      <div >
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
        <form action={onFormSubmit}>
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
  );
}