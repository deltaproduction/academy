import { useState }      from "react";
import { isPlainObject } from "next/dist/shared/lib/is-plain-object";
import { python }        from '@codemirror/lang-python';
import CodeMirror        from '@uiw/react-codemirror';

import { AttemptsApi, TasksApi, TopicsApi }          from "@/lib/api";
import { formatDateTime, getStudentServerSideProps } from "@/lib/utils";
import AppLayout                                     from "@/layouts/AppLayout";
import { Sidebar, SidebarItem }                      from "@/components/Sidebar";
import SubmitButton                                  from "@/components/SaveChangesField";

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

    response = await AttemptsApi.list({queryParams: {task: task_id}, req, res})
    if (response.ok) {
      props.attempt = (await response.json())[0]
    }

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

const defaultCode = 'a = int(input())\n' +
  'b = int(input())\n' +
  'c = int(input())\n' +
  '\n' +
  'print(a + b + c)'

const Task = ({profile, tasks, topic, attempt = {}, task: {id, title, text, formatInText, formatOutText} = {}}) => {
  const [code, setCode] = useState(defaultCode)
  const [result, setResult] = useState(attempt)

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
      {result.status !== 0 && <SubmitButton onClick={onCodeSubmit} text="Сдать"/>}
    </div>
    <div>
      {!!result && <>
        {result.createdAt && formatDateTime(result.createdAt)}
        {result.status === 0 && <div>
          Успешно
        </div>}
        {result.status === 1 && <div>
          Неверный результат
          {!!result.testCase && <>
            <div>Входные данные: <pre>{result.testCase.stdin}</pre></div>
            <div>Ожидание:
              <pre>{result.testCase.stdout}</pre>
            </div>
            <div>Реальность:
              <pre>{result.output}</pre>
            </div>
          </>
          }

        </div>}
        {result.status === 2 && <div>
          <div>Ошибка:</div>
          <pre>{result.output}</pre>
        </div>}
        {result.status === 3 && <div>
          Превышен лимит по времени: {result.testCase.timelimit}c
        </div>}
        {result.status === 4 && <div>Отправлено на проверку</div>}
      </>}
    </div>
  </Layout>
}

export default Task
