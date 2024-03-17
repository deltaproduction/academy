import { TasksApi, TopicsApi }       from "@/lib/api";
import { getStudentServerSideProps } from "@/lib/utils";

import AppLayout                from "@/layouts/AppLayout";
import { Sidebar, SidebarItem } from "@/components/Sidebar";

import { isPlainObject } from "next/dist/shared/lib/is-plain-object";


import styles        from "./index.module.scss";
import { CharField } from "@/components/Fields";
import SubmitButton  from "@/components/SaveChangesField";
import { useState }  from "react";
import ContentBlock  from "@/components/ContentBlock";


export async function getServerSideProps({query: {topic_id, task_id}, req, res}) {
  try {
    const {props} = await getStudentServerSideProps({req, res})

    let response = await TasksApi.list({queryParams: {topic: topic_id}, req, res})

    props.tasks = await response.json()

    response = await TopicsApi.retrieve(topic_id, {req, res})

    props.topic = await response.json()

    response = await TasksApi.retrieve(task_id, {req, res})

    if (response.status === 404) return {notFound: true}

    props.task = await response.json()

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
        newItemHref={`/classes/${topic.course}/topics/${topic.id}/tasks/new/`}
        backLink={`/classes/${topic.course}/topics/${topic.id}/`}
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


  return <Layout profile={profile} topic={topic} tasks={tasks}>
    <h1>{title}</h1>
    <div>
      <h2>Описание:</h2>
      <div>{text}</div>
    </div>
    <div>
      <h2>
        Формат входных данных
      </h2>
      <div>{formatInText}</div>
    </div>
    <div>
      <h2>
        Формат выходных данных
      </h2>
      <div>{formatOutText}</div>
    </div>
    <div></div>
  </Layout>
}

export default Task
