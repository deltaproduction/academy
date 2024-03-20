import { CoursesApi, TopicsApi }     from "@/lib/api";
import { getTeacherServerSideProps } from "@/lib/utils";

import AppLayout                from "@/layouts/AppLayout";
import { Sidebar, SidebarItem } from "@/components/Sidebar";

import { isPlainObject } from "next/dist/shared/lib/is-plain-object";


import styles                     from "./index.module.scss";
import { CharField, SelectField } from "@/components/Fields";
import SubmitButton               from "@/components/SaveChangesField";
import { useState }               from "react";
import ContentBlock               from "@/components/ContentBlock";
import Table from "@/components/Table";


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

const Topic = ({profile, topics, course, topic: {id, title, type, description, tasks, state} = {}}) => {
  const [editMode, setEditMode] = useState(!id);

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
        location.href = `/courses/${course.id}/topics/${topic.id}/`
      } else {
        location.reload()
      }
    }
  }

  function generateTasksData(tasks) {
    let result = [];

    for (let i = 0; i < tasks.length; i ++) {
      let task = tasks[i];

      result.push([i + 1, [task.title, `/courses/${course.id}/topics/${task.topic}/tasks/${task.id}/`], task.autoreview]);
    }

    return result;
  }

  return <Layout profile={profile} topics={topics} course={course}>
    <ContentBlock setEditMode={setEditMode} editMode={editMode} title={id ? "Информация об уроке" : "Новый урок"}>
      <form onSubmit={onTopicFormSubmit}>
        <CharField label="Заголовок" name="title" defaultValue={title} disabled={!editMode}/>
        <CharField label="Описание" name="description" defaultValue={description} disabled={!editMode}/>
        <SelectField label="Тип урока" name="type" defaultValue={type} disabled={!editMode}>
          <option value="0">Учебная тема</option>
          <option value="1">Самостоятельная</option>
          <option value="2">Контрольная</option>
        </SelectField>
        <SelectField label="Статус" name="state" defaultValue={state} disabled={!editMode}>
          <option value="0">Закрыт</option>
          <option value="1">Опубликован</option>
        </SelectField>
        {!!editMode && <SubmitButton/>}
      </form>
    </ContentBlock>

    {!!id && <>

      <ContentBlock title="Список задач" value="Количество:" data={tasks.length}>

        <div className={styles.links}>
          <a href={`/courses/${course.id}/topics/${id}/tasks/`}>Перейти в раздел задач</a>
          <a href={`/courses/${course.id}/topics/${id}/tasks/new/`}>{tasks.length ? "Создать новую задачу" : "Создать первую задачу"}</a>
        </div>

        { tasks.length ?
            <Table
                fields={
                  [
                    ["№", 8, "numberWithDot"],
                    ["Название задачи", 66, "link"],
                    ["Проверка", 16, "text"]
                  ]
                }

                data={generateTasksData(tasks)}
            /> : <p>Ещё не создано ни одной задачи.</p>
        }


      </ContentBlock>
    </>

    }
  </Layout>
}

export default Topic
