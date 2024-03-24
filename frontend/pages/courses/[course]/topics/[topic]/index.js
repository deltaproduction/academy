import { useState } from "react";

import { CoursesApi, TopicsApi }                    from "@/lib/api";
import { getTeacherServerSideProps, isPlainObject } from "@/lib/utils";

import AppLayout                                          from "@/layouts/AppLayout";
import Table                                                         from "@/components/Table";
import { CharField, FileField, NumberField, SelectField, TextField } from "@/components/Fields";
import { Sidebar, SidebarItem }                                      from "@/components/Sidebar";
import ContentBlock                                       from "@/components/ContentBlock";
import SubmitButton                                       from "@/components/SubmitButton";

import styles from "./index.module.scss";


export async function getServerSideProps({query: {topic, course}, req, res}) {
  try {
    const {props} = await getTeacherServerSideProps({req, res})

    let response = await TopicsApi.list({queryParams: {course}, req, res})
    props.topics = await response.json()

    response = await CoursesApi.retrieve(course, {req, res})

    props.course = await response.json()

    if (topic === 'new') return {props}

    response = await TopicsApi.retrieve(topic, {req, res})

    if (response.status === 404) return {notFound: true}

    props.topic = await response.json()

    if (props.topic.course !== parseInt(course)) return {notFound: true}

    return {props}
  } catch (e) {
    if (isPlainObject(e)) return e
    throw e
  }
}

const Layout = ({topics, profile, children, course}) => {
  return <AppLayout profile={profile}>
    <div className={styles.container}>
      <Sidebar
        title="Раздел уроков"
        newItemHref={`/courses/${course.id}/topics/new/`}
        backLink={`/courses/${course.id}/`}
        backTitle={`< ${course.title}`}
      >
        {topics.map(({id, title}) => (
          <SidebarItem key={id} href={`/courses/${course.id}/topics/${id}/`}>{title}</SidebarItem>)
        )}
      </Sidebar>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  </AppLayout>
}

const Topic = ({
                 profile,
                 topics,
                 course,
                 topic: {id, title, type: type_, files: files_ = [], description, duration, tasks, state} = {}
               }) => {
  const [editMode, setEditMode] = useState(!id);
  const [files, setFiles] = useState(files_);
  const [errors, setErrors] = useState('');
  const [type, setType] = useState(type_ || 0);


  const onTopicFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    let response;

    if (id) {
      response = await TopicsApi.update(id, formData)
    } else {
      formData.append('course', course.id)
      response = await TopicsApi.create(formData)
    }

    if (response.ok) {
      const topic = await response.json()
      if (id) {
        location.reload()
      } else {
        location.href = `/courses/${course.id}/topics/${topic.id}/`
      }
    } else {
      setErrors(await response.json())
    }
  }

  function generateTasksData(tasks) {
    return tasks.map(({id, topic, title, autoreview}, i) => (
      [i + 1, [title, `/courses/${course.id}/topics/${topic}/tasks/${id}/`], autoreview]
    ))
  }

  const onUploadFile = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const response = await TopicsApi.uploadFile(id, formData)
    if (response.ok) {
      setFiles(files.concat(await response.json()))
      e.target.reset()
    } else {
      setErrors(await response.json())
    }
  }

  const onDestroyFile = async (id) => {
    const response = await TopicsApi.deleteFile(id)
    if (response.ok) {
      setFiles(files.filter(({id: id_}) => id !== id_))
    } else {
      setErrors(await response.json())
    }
  }

  return <Layout profile={profile} topics={topics} course={course}>
    <ContentBlock setEditMode={setEditMode} editMode={editMode} title={id ? "Информация об уроке" : "Новый урок"}>
      <form onSubmit={onTopicFormSubmit}>
        <CharField label="Заголовок" name="title" defaultValue={title} disabled={!editMode} error={errors["title"]}/>
        <TextField label="Описание" name="description" defaultValue={description} disabled={!editMode}
                   error={errors["description"]}/>
        <SelectField label="Тип урока" name="type" value={type} disabled={!editMode}
                     onChange={({target: {value}}) => setType(parseInt(value))}>
          <option value="0">Учебная тема</option>
          <option value="1">Самостоятельная</option>
          <option value="2">Контрольная</option>
        </SelectField>
        {(type !== 0) && <NumberField label="Длительность" name="duration" defaultValue={duration}
                                      disabled={!editMode} error={errors["duration"]}/>}
        <SelectField label="Статус" name="state" defaultValue={state} disabled={!editMode}>
          <option value="0">Закрыт</option>
          <option value="1">Опубликован</option>
        </SelectField>

        {!!editMode && <SubmitButton/>}
      </form>
    </ContentBlock>
    <ContentBlock title="Материалы" value="Количество:" data={files.length}>
      <div className={styles.files}>
        {files.map(({id, file}) => <div className={styles.fileRow} key={id}>
          <a href={file} target="_blank">{decodeURI(file.split('/').pop())}</a>
          <SubmitButton onClick={() => onDestroyFile(id)} text="Удалить"/>
        </div>)}
      </div>
      {!id ?
        <div>
          Сохраните изменения чтобы добавить материалы к уроку
        </div> :
        <form onSubmit={onUploadFile}>
          <FileField label="Файл" name="file" defaultValue={title} error={errors["file"]}/>
          <SubmitButton text="Добавить"/>
        </form>
      }
    </ContentBlock>


    {!!id && <ContentBlock title="Список задач" value="Количество:" data={tasks.length}>
      <div className={styles.links}>
        <a href={`/courses/${course.id}/topics/${id}/tasks/`}>Перейти в раздел задач</a>
        <a
          href={`/courses/${course.id}/topics/${id}/tasks/new/`}>{tasks.length ? "Создать новую задачу" : "Создать первую задачу"}</a>
      </div>

      {tasks.length ?
        <Table
          fields={
            [
              ["№", 7, "numberWithDot"],
              ["Название задачи", 77, "link"],
              ["Проверка", 16, "taskCheckType"]
            ]
          }
          data={generateTasksData(tasks)}
        /> : <p>Ещё не создано ни одной задачи.</p>
      }
    </ContentBlock>
    }
  </Layout>
}

export default Topic
