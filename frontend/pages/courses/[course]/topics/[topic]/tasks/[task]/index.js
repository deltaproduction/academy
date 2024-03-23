import { useState } from "react";

import { TasksApi, TestCasesApi, TopicsApi }        from "@/lib/api";
import { getTeacherServerSideProps, isPlainObject } from "@/lib/utils";

import AppLayout                             from "@/layouts/AppLayout";
import { CharField, SelectField, TextField } from "@/components/Fields";
import { Sidebar, SidebarItem }              from "@/components/Sidebar";
import ContentBlock from "@/components/ContentBlock";
import SubmitButton from "components/SubmitButton";

import styles from "./index.module.scss";


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
        title="Раздел задач"
        newItemHref={`/courses/${topic.course}/topics/${topic.id}/tasks/new/`}
        backLink={`/courses/${topic.course}/topics/${topic.id}/`}
        backTitle={`< ${topic.title}`}
      >
        {
          tasks.length ?
            tasks.map(({id, title}) => (
              <SidebarItem key={id}
                           href={`/courses/${topic.course}/topics/${topic.id}/tasks/${id}/`}>{title}</SidebarItem>)
            )

            : <SidebarItem href={`/courses/${topic.course}/topics/${topic.id}/tasks/new/`}>Новая задача</SidebarItem>
        }


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
                task: {id, title, text, formatInText, formatOutText, autoreview: autoreview_} = {}
              }) => {

  const [testCases, setTestCases] = useState(testCases_)
  const [autoreview, setAutoreview] = useState(autoreview_)
  const [errors, setErrors] = useState('')

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
    } else {
      setErrors(await response.json())
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
    <ContentBlock title={id ? "Информация о задаче" : "Новая задача"}>
      <form onSubmit={onTaskFormSubmit}>
        <CharField label="Заголовок" name="title" defaultValue={title} error={errors ? errors["title"] : null}/>
        <CharField label="Описание" name="text" defaultValue={text} error={errors ? errors["text"] : null}/>
        <CharField label="Формат входных данных" name="format_in_text" defaultValue={formatInText}
                   error={errors ? errors["formatInText"] : null}/>
        <CharField label="Формат выходных данных" name="format_out_text" defaultValue={formatOutText}
                   error={errors ? errors["formatOutText"] : null}/>
        <SelectField label="Способ проверки" name="autoreview"
                     onChange={({target: {value}}) => setAutoreview(parseInt(value))} defaultValue={autoreview}>
          <option value="0">Ручная проверка</option>
          <option value="1">Автоматическая проверка</option>
        </SelectField>
        <SubmitButton/>
      </form>

    </ContentBlock>
    {
      !!autoreview && <ContentBlock title="Тест кейсы">
        {!!testCases && testCases.map(({id, stdin, stdout}) => (
          <div key={id}>
            <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
              <pre>{stdin}</pre>
              {"->"}
              <pre>{stdout}</pre>
              <SubmitButton onClick={() => onTestCaseDelete(id)} text="Удалить"/>
            </div>

          </div>
        ))}
        {id ?
          <form onSubmit={onTestCaseFormSubmit}>
            <TextField label="Входные аргументы" name="stdin"/>
            <TextField label="Ожидаемый результат" name="stdout"/>
            <CharField type="number" min="1" max="3" defaultValue={1} label="Ограничение по времени (с)"
                       name="timelimit"/>
            <SubmitButton text="Добавить"/>
          </form> :
          <div>Сохраните изменения для добавления тест-кейсов</div>
        }
      </ContentBlock>
    }

  </Layout>
}

export default Task
