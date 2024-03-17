import { TasksApi, TestCasesApi, TopicsApi } from "@/lib/api";
import { getTeacherServerSideProps }         from "@/lib/utils";

import AppLayout                from "@/layouts/AppLayout";
import { Sidebar, SidebarItem } from "@/components/Sidebar";

import { isPlainObject } from "next/dist/shared/lib/is-plain-object";


import styles        from "./index.module.scss";
import { CharField } from "@/components/Fields";
import SubmitButton  from "@/components/SaveChangesField";
import { useState }  from "react";
import ContentBlock  from "@/components/ContentBlock";


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

    response = await TestCasesApi.list({queryParams: {task}, req, res})

    props.testCases = await response.json()


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

const Task = ({
                profile,
                tasks,
                topic,
                testCases: testCases_,
                task: {id, title, text, formatInText, formatOutText} = {}
              }) => {

  const [testCases, setTestCases] = useState(testCases_)
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

  const onTestCaseFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    formData.append('task', id)

    const response = await TestCasesApi.create(formData)
    if (response.ok) {
      const testCase = await response.json()
      setTestCases(testCases.concat([testCase]))
      e.target.reset()
    }
  }

  const onTestCaseDelete = async (id) => {
    const response = await TestCasesApi.delete(id)
    if (response.ok) {
      setTestCases(testCases.filter((testCase) => testCase.id !== id))
    }
  }

  return <Layout profile={profile} topic={topic} tasks={tasks}>
    <ContentBlock title="Информация о задаче">
      <form onSubmit={onTaskFormSubmit}>
        <CharField label="Заголовок" name="title" defaultValue={title}/>
        <CharField label="Описание" name="text" defaultValue={text}/>
        <CharField label="Формат входных данных" name="format_in_text" defaultValue={formatInText}/>
        <CharField label="Формат выходных данных" name="format_out_text" defaultValue={formatOutText}/>
        <SubmitButton/>
      </form>

    </ContentBlock>
    <ContentBlock title="Тест кейсы">
      {testCases.map(({id, stdin, stdout}) => (
        <div key={id}>
          <div>
            {stdin} {"->"} {stdout}
          </div>
          <SubmitButton onClick={() => onTestCaseDelete(id)} text="Удалить"/>
        </div>
      ))}
      <form onSubmit={onTestCaseFormSubmit}>
        <CharField label="Входные аргументы" name="stdin"/>
        <CharField label="Ожидаемый результат" name="stdout"/>
        <CharField type="number" min="1" max="3" label="Ограничение по времени (с)" name="timelimit"/>
        <SubmitButton text="Добавить"/>
      </form>
    </ContentBlock>
  </Layout>
}

export default Task
