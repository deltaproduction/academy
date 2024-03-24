import classNames                    from "classnames";
import { Clear, Done, Schedule }     from "@mui/icons-material";

import { ClassesApi, TopicsApi }     from "@/lib/api";
import { getStudentServerSideProps } from "@/lib/utils";
import AppLayout                     from "@/layouts/AppLayout";
import { Sidebar, SidebarItem }      from "@/components/Sidebar";

import styles                        from "./index.module.scss";

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
      {
        status === 0 ? <Done/> : status === 1 ? <Clear/> : status === 2 ? <Schedule/> : null
      }

    </div>
  </div>;
}

export default function ClassCourse({profile, group, topic, topics}) {
  let simpleTasks = topic.tasks.filter((task) => task.type === 0);
  let homeTasks = topic.tasks.filter((task) => task.type === 1);
  let hardTasks = topic.tasks.filter((task) => task.type === 2);

  function getSimpleTasks() {
    let result = [];

    for (let i = 0; i < simpleTasks.length; i++) {
      let task = simpleTasks[i];

      result.push(
        <a href={`/classes/${group.id}/topics/${topic.id}/tasks/${task.id}`} key={task.id} className={styles.link}>
          <Task number={i + 1} key={task.id} title={task.title}/>
        </a>);
    }

    return result;
  }

  function getHomeTasks() {
    let result = [];

    for (let i = 0; i < homeTasks.length; i++) {
      let task = homeTasks[i];

      result.push(
        <a href={`/classes/${group.id}/topics/${topic.id}/tasks/${task.id}`} key={task.id} className={styles.link}>
          <Task number={i + simpleTasks.length + 1} title={task.title}/>
        </a>);
    }

    return result;
  }

  function getHardTasks() {
    let result = [];

    for (let i = 0; i < hardTasks.length; i++) {
      let task = hardTasks[i];

      result.push(
        <a href={`/classes/${group.id}/topics/${topic.id}/tasks/${task.id}`} key={task.id} className={styles.link}>
          <Task number={i + homeTasks.length + simpleTasks.length + 1} title={task.title}/>
        </a>
      );
    }

    return result;
  }

  return <AppLayout profile={profile}>
    <div className={styles.container}>
      <Sidebar
        title="Темы"
        backLink={`/classes/`}
        backTitle={`< Классы`}
      >
        {topics.map(({id, title}) => (
          <SidebarItem key={id} href={`/classes/${group.id}/topics/${id}/`}>{title}</SidebarItem>)
        )}
      </Sidebar>
      <div className={styles.content}>

        <div className={styles.topicInfo}>
          <h1>{topic.title}</h1>
          <p>{topic.description}</p>
        </div>

        <div className={styles.topicContent}>
          <div className={styles.tasks}>
            <h1 className={styles.blockTitle}>Задачи</h1>
            <div className={styles.tasksWrapper}>

              {Object.keys(simpleTasks).length ? <>
                <h2 className={styles.subtitle}>Классные</h2>

                {getSimpleTasks()}</> : null
              }
            </div>

            <div className={styles.tasksWrapper}>
              {Object.keys(homeTasks).length ? <>
                <h2 className={styles.subtitle}>Домашние</h2>
                {getHomeTasks()}</> : null
              }

            </div>

            <div className={styles.tasksWrapper}>

              {Object.keys(hardTasks).length ? <>
                <h2 className={styles.subtitle}>Дополнительные</h2>
                {getHardTasks()}</> : null
              }

            </div>
          </div>
          <div className={styles.materials}>
            <h1 className={styles.blockTitle}>Материалы</h1>
            <div className={styles.materialsList}>
              {topic.files.length ?
                topic.files.map(({id, file}) => <div key={id}>
                  <a target="_blank" href={file}>{decodeURI(file.split('/').pop())}</a>
                </div>) :
                <p>К этому уроку материалов нет.</p>}
            </div>
          </div>
        </div>


      </div>
    </div>

  </AppLayout>
}