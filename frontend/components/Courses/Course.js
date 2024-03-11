import { useState }  from "react";
import { useRouter } from "next/router";

import { Edit, Undo } from '@mui/icons-material';

import { CoursesApi } from "@/lib/api";
import { useAppContext }              from "@/components/ContextProvider";

import { CharField, SelectField } from "@/components/Fields";

import styles from "./Course.module.scss";


export default function Course({course = {}}) {
  const [editMode, setEditMode] = useState(!course.id);

  const router = useRouter()

  const {id, title, description, state, author} = course

  const {courses, updateContext} = useAppContext()

  const onCourseFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    if (course.id) {
      const response = await CoursesApi.update(course.id, formData)
      const updatedCourse = await response.json()
      updateContext({courses: courses.map(({id, title}) => course.id === id ? updatedCourse : {id, title})})
      setEditMode(!response.ok)
      return
    }
    const response = await CoursesApi.create(formData)
    const {id, title} = await response.json()

    updateContext({courses: [...courses, {id, title}]})

    await router.push(`/courses/${id}/`)
  }

  const onTopicFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    // const response = await createCourse(formData)
    // const {id, title} = await response.json()




  }

  return (
    <div className={styles.container}>
      {!id && <h1>Создание нового курса</h1>}
      <div>
        <div className={styles.title}>
          <h1>Информация о курсе {
            editMode ? <Undo onClick={() => setEditMode(!editMode)}/> : <Edit onClick={() => setEditMode(!editMode)}/>
          }</h1>
        </div>
        <form onSubmit={onCourseFormSubmit}>
          <CharField label="Название курса" name="title" defaultValue={title} disabled={!editMode}/>
          <CharField label="Описание курса" name="description" defaultValue={description} disabled={!editMode}/>
          <SelectField label="Статус" name="state" defaultValue={state} disabled={!editMode}>
            <option value="0">Черновик</option>
            <option value="1">Опубликован</option>
          </SelectField>
          {!!editMode && <button className={styles.titleAction} type="submit">Сохранить</button>}
        </form>
      </div>
      <div>
        <div className={styles.title}>
          <h1>Список тем</h1>
        </div>
        <form onSubmit="">

        </form>
      </div>
    </div>
  );
}