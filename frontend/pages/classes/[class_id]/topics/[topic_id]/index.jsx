import _                         from "lodash";
import classNames                from "classnames";
import { Clear, Done, Schedule } from "@mui/icons-material";

import { ClassesApi, TopicsApi }                     from "@/lib/api";
import { formatDateTime, getStudentServerSideProps } from "@/lib/utils";
import AppLayout                                     from "@/layouts/AppLayout";
import { Sidebar, SidebarItem }                      from "@/components/Sidebar";

import styles from "./index.module.scss";

export async function getServerSideProps({query: {class_id, topic_id}, req, res}) {
  try {
    const {props} = await getStudentServerSideProps({req, res})

    const classRes = await ClassesApi.retrieve(class_id, {req, res})
    if (classRes.status === 404) {
      return {notFound: true}
    }
    props.group = await classRes.json()

    const topicsRes = await TopicsApi.list({queryParams: {group: class_id}, req, res})
    props.topics = await topicsRes.json()

    const topicRes = await TopicsApi.retrieve(topic_id, {req, res})
    if (topicRes.status === 404) {
      return {notFound: true}
    }
    props.topic = await topicRes.json()

    return {props}
  } catch (e) {
    return e
  }
}

function Task({number, title, status}) {
  return <div className={styles.taskWrapper}>
    <div className={styles.number}>{number}</div>
    <div className={styles.info}>
      <div className={styles.taskTitle}>{title}</div>
    </div>
    <div className={classNames(styles.status, [styles.green, styles.red, styles.grey][status])}>
      {status === 0 ? <Done/> : status === 1 ? <Clear/> : status === 2 ? <Schedule/> : null}

    </div>
  </div>;
}

const taskTypes = {
  0: 'Классные', 1: 'Домашние', 2: 'Дополнительные',
}
export default function ClassCourse({profile, group, topic, topics}) {
  const groupedTasks = _.groupBy(topic.tasks, 'type')

  const onStartSubmit = async e => {
    e.preventDefault()
    const response = await TopicsApi.startTask(topic.id)
    if (response.ok) {
      location.reload()
    }
  }

  return <AppLayout profile={profile}>
    <div className={styles.container}>
      <Sidebar
        title="Темы"
        backLink={`/classes/`}
        backTitle={`< Классы`}
      >
        {topics.map(({id, title}) => (
          <SidebarItem key={id} href={`/classes/${group.id}/topics/${id}/`}>{title}</SidebarItem>))}
      </Sidebar>
      <div className={styles.content}>

        <div className={styles.topicInfo}>
          <h1>{topic.title}</h1>
          <p>{topic.description}</p>
        </div>
        {topic.type === 2 && <div>
          {topic.startedAt ?
            <div>Начато: {formatDateTime(topic.startedAt)}</div> :
            <button onClick={onStartSubmit}>Начать задание</button>}

        </div>}

        <div className={styles.topicContent}>
          <div className={styles.tasks}>
            <h1 className={styles.blockTitle}>Задачи</h1>
            {(() => {
              let taskNumber = 0;
              return Object.keys(groupedTasks).map(group => <div key={group} className={styles.tasksWrapper}>
                <h2 className={styles.subtitle}>{taskTypes[group] || 'Задачи'}</h2>
                {groupedTasks[group].map((task) => {
                  taskNumber++
                  const props = topic.startedAt ? {href: `/classes/${group.id}/topics/${topic.id}/tasks/${task.id}`} : {}
                  return <a {...props} key={task.id} className={classNames(styles.link, {[styles.linkDisabled]: !topic.startedAt})}>
                    <Task number={taskNumber} key={task.id} title={task.title}/>
                  </a>
                })}
              </div>)
            })()}
          </div>
          <div className={styles.materials}>
            <h1 className={styles.blockTitle}>Материалы</h1>
            <div className={styles.materialsList}>
              {topic.files.length ? topic.files.map(({id, file}) => <div key={id}>
                <a target="_blank" href={file}>{decodeURI(file.split('/').pop())}</a>
              </div>) : <p>К этому уроку материалов нет.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>

  </AppLayout>
}