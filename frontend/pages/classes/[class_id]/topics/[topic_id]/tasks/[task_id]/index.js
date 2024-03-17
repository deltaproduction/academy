import { useState }      from "react";
import { isPlainObject } from "next/dist/shared/lib/is-plain-object";
import { python }        from '@codemirror/lang-python';
import CodeMirror        from '@uiw/react-codemirror';

import { AttemptsApi, TasksApi, TopicsApi } from "@/lib/api";
import { getStudentServerSideProps }        from "@/lib/utils";
import AppLayout                            from "@/layouts/AppLayout";
import { Sidebar, SidebarItem }             from "@/components/Sidebar";
import SubmitButton                         from "@/components/SaveChangesField";

import styles from "./index.module.scss";


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

const defaultCode = 'def main():\n  pass'

const Task = ({profile, tasks, topic, task: {id, title, text, formatInText, formatOutText} = {}}) => {
  const [code, setCode] = useState(defaultCode)
  const [result, setResult] = useState({})

  const onCodeSubmit = async () => {
    const formData = new FormData()
    formData.append('task', id)
    formData.append('code', code)
    const result = await AttemptsApi.create(formData)
    if (result.ok) {
      setResult(await result.json())
    }
  }

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
    <div>
      <CodeMirror
        height="240px"
        maxWidth="500px"
        extensions={[python()]}
        value={code}
        onChange={setCode}
      />
      <SubmitButton onClick={onCodeSubmit} text="Проверить"/>
    </div>
    <div>
      {result.status === 0 && <div>
        Успешно
      </div>}
      {result.status === 1 && <div>
        Неверный результат:
        <pre>Входные данные: {result.testCase.stdin}</pre>
        <pre>Ожидание: {result.testCase.stdout}</pre>
        <pre>Реальность: {result.output}</pre>
      </div>}
      {result.status === 2 && <div>
        <div>Ошибка:</div>
        <pre>{result.output}</pre>
      </div>}
      {result.status === 3 && <div>
        Превышен лимит по времени: {result.testCase.timelimit}c
      </div>}
    </div>
  </Layout>
}

export default Task
