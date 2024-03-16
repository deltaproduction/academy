import { TasksApi, TopicsApi }       from "@/lib/api";
import { getTeacherServerSideProps } from "@/lib/utils";

import AppLayout                from "@/layouts/AppLayout";
import { Sidebar, SidebarItem } from "@/components/Sidebar";

import { isPlainObject } from "next/dist/shared/lib/is-plain-object";


import styles           from "./index.module.scss";
import { CharField }    from "@/components/Fields";
import SaveChangesField from "@/components/SaveChangesField";
import { useState }     from "react";
import ContentBlock     from "@/components/ContentBlock";


export async function getServerSideProps({query: {topic, task}, req, res}) {
  try {
    const {props} = await getTeacherServerSideProps({req, res})

    let response = await TasksApi.list({queryParams: {topic}, req, res})

    props.tasks = await response.json()

    response = await TopicsApi.retrieve(topic, {req, res})

    props.topic = await response.json()

    if (task === 'new') return {props}

    response = await TasksApi.retrieve(task, {req, res})

    if (response.status === 404) return {notFound: true}

    props.task = await response.json()

    if (props.task.topic !== parseInt(topic)) return {notFound: true}


    return {props}
  } catch (e) {
    if (isPlainObject(e)) return e
    throw e
  }
}

const Layout = ({profile, tasks, topic, children}) => {
  return <AppLayout profile={profile}>
    <div className={styles.container}>
      <Sidebar
        title="Задачи"
        newItemHref={`/courses/${topic.course}/topics/${topic.id}/tasks/new/`}
        backLink={`/courses/${topic.course}/topics/${topic.id}/`}
        backTitle={`< ${topic.title}`}
      >
        {tasks.map(({id, title}) => (
          <SidebarItem key={id} href={`/courses/${topic.course}/topics/${topic.id}/tasks/${id}/`}>{title}</SidebarItem>)
        )}
      </Sidebar>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  </AppLayout>
}

const Task = ({profile, tasks, topic, task: {id, title, text, formatInText, formatOutText} = {}}) => {
  const [editMode, setEditMode] = useState(!id);

  const onTaskFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    let response;

    if (id) {
      response = await TasksApi.update(id, formData)
    } else {
      formData.append('topic', topic.id)
      response = await TasksApi.create(formData)
    }

    if (response.ok) {
      const task = await response.json()
      if (id) {
        location.href = `/courses/${topic.course}/topics/${topic.id}/tasks/${task.id}`
      } else {
        location.reload()
      }
    }
  }

  return <Layout profile={profile} topic={topic} tasks={tasks}>
    <ContentBlock setEditMode={setEditMode} editMode={editMode} title="Информация о задаче">
      <form onSubmit={onTaskFormSubmit}>
        <CharField label="Заголовок" name="title" defaultValue={title} disabled={!editMode}/>
        <CharField label="Описание" name="text" defaultValue={text} disabled={!editMode}/>
        <CharField label="Формат входных данных" name="format_in_text" defaultValue={formatInText}
                   disabled={!editMode}/>
        <CharField label="Формат выходных данных" name="format_out_text" defaultValue={formatOutText}
                   disabled={!editMode}/>
        {!!editMode && <SaveChangesField/>}
      </form>
    </ContentBlock>
  </Layout>
}

export default Task
