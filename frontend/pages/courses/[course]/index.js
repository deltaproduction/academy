import { useState }   from "react";
import { useRouter }  from "next/router";
import { Edit, Undo } from "@mui/icons-material";

import { CoursesApi, TopicsApi }                from "@/lib/api";
import CoursesLayout, { getCoursesLayoutProps } from "@/layouts/CoursesLayout";
import { CharField, SelectField }               from "@/components/Fields";
import { useAppContext }                        from "@/components/ContextProvider";

import styles            from "./index.module.scss";
import { isPlainObject } from "next/dist/shared/lib/is-plain-object";
import ContentBlock, {DataTitle} from "@/components/ContentBlock";
import NamedFormField from "@/components/NamedFormField";
import SaveChangesField from "@/components/SaveChangesField";

export async function getServerSideProps({query: {course}, req, res}) {
  try {
    const props = await getCoursesLayoutProps({req, res})

    if (course === 'new') return {props}

    const courseRes = await CoursesApi.retrieve(course, {req, res})
    if (courseRes.status === 404) {
      return {notFound: true}
    }
    props.course = await courseRes.json()

    const topicsRes = await TopicsApi.list({queryParams: {course}, req, res})
    if (topicsRes.ok) {
      props.topics = await topicsRes.json()
    }

    return {props}
  } catch (e) {
    if (isPlainObject(e)) return e
    throw e
  }
}

const Course = ({layoutProps, ...props}) => {
  const {course} = props
  const [editMode, setEditMode] = useState(!course.id);
  const [addTopicMode, setAddTopicMode] = useState(false);
  const [topics, setTopics] = useState(props.topics);

  const router = useRouter()

  const {id, title, description, state} = course


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

    formData.append('course', course.id)

    const response = await TopicsApi.create(formData)
    if (response.ok) {
      const topic = await response.json()
      setTopics(topics.concat([topic]))
      e.target.reset()
      setAddTopicMode(false)
    }
  }

  return (
      <CoursesLayout {...layoutProps}>
        <ContentBlock setEditMode={setEditMode} editMode={editMode} title="Информация о курcе">
          <div>
            <form onSubmit={onCourseFormSubmit}>
              <CharField label="Название курса" name="title" defaultValue={title} disabled={!editMode}/>
              <CharField label="Описание курса" name="description" defaultValue={description} disabled={!editMode}/>

              <SelectField label="Статус" name="state" defaultValue={state} disabled={!editMode}>
                <option value="0">Черновик</option>
                <option value="1">Опубликован</option>
              </SelectField>
              {!!editMode && <SaveChangesField />}
            </form>
          </div>
        </ContentBlock>
      </CoursesLayout>);
}

Course.defaultProps = {
  course: {},
  topics: [],
}

export default Course


/*<CoursesLayout {...layoutProps}>
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
      {!!id && <div>
        {!!topics.length && <div className={styles.title}>
          <h1>Список тем</h1>
        </div>}
        {
          topics.map(({id, title}) => <div key={id}>
            <a href={`/courses/${course.id}/${id}`}>{title}</a>
          </div>)
        }
        {
          !addTopicMode
            ? <button onClick={() => setAddTopicMode(true)}>Добавить тему</button>
            : <form onSubmit={onTopicFormSubmit}>
              <h2>Новая тема</h2>
              <CharField label="Название" name="title"/>
              <CharField label="Описание" name="descripiton"/>
              <SelectField label="Тип" name="type" defaultValue={0}>
                <option value="0">Учебная тема</option>
                <option value="1">Классная работа</option>
                <option value="2">Самостоятельная работа</option>
              </SelectField>
              <SelectField label="Состояние" name="state" defaultValue="0">
                <option value="0">Закрыта</option>
                <option value="1">Открыта</option>
              </SelectField>
              <button onClick={() => setAddTopicMode(false)}>Отменить</button>
              <button type="submit">Сохранить</button>
            </form>
        }

      </div>}
    </div>
  </CoursesLayout>*/
