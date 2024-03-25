import { ClassesApi, CoursesApi, fetchApi, TasksApi, TopicsApi } from "@/lib/api";
import { getStudentServerSideProps, getTeacherServerSideProps }  from "@/lib/utils";
import AppLayout                                                 from "@/layouts/AppLayout";
import styles                                                    from "@/pages/classes/[class_id]/index.module.scss";
import { Sidebar, SidebarItem }                                  from "@/components/Sidebar";
import ContentBlock from "@/components/ContentBlock";
import {Fragment} from "react";
import * as PropTypes from "prop-types";
import {Clear, Done} from "@mui/icons-material";

export async function getServerSideProps({query: {class_id, topic_id}, req, res}) {
  try {
    const {props} = await getTeacherServerSideProps({req, res})

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

    const tasksRes = await TasksApi.list({queryParams: {topic: topic_id}, req, res})
    props.tasks = await tasksRes.json()

    const ratingsRes = await fetchApi(`/api/ratings/${class_id}/${topic_id}/`, {req, res})
    props.ratings = await ratingsRes.json()

    return {props}
  } catch (e) {
    return e
  }
}

const statuses = {
  0: <Done />,
  1: <Clear />,
  2: <Clear />,
  3: <Clear />,
  4: 'На проверке'
}

function Status({rating, tasks}) {
  let result = [];
  let tasks_ids = Object.keys(rating).map((id) => parseInt(id));

  for (let i = 0; i < tasks.length; i ++) {
    let task = tasks[i];
    let task_id = task.id;
    let attempt = rating[task_id];

    result.push(<Fragment key={task_id}>
      <div className={styles.item}>
        {tasks_ids.includes(task_id) ?
            <a href={`/attempts/${attempt.id}`}>{statuses[attempt.status]}</a>
            : null}
      </div>
      <div className={styles.fieldsSeparator}></div>
    </Fragment>)
  }

  return result;
}

function RelativeRating({rating, tasks}) {
  let tasks_ids = Object.keys(rating).map((id) => parseInt(id));

  let solvedTasksCount = 0;
  let tasksCount = 0;

  for (let i = 0; i < tasks.length; i ++) {
    let task = tasks[i];
    let task_id = task.id;
    let type = task.type;

    if ([0, 1].includes(type)) {
      tasksCount += 1;

      if (tasks_ids.includes(task_id)) {
        let status = rating[task_id].status;

        if (status === 0) {
          solvedTasksCount += 1;
        }
      }
    }

  }

  return Math.floor((solvedTasksCount / tasksCount) * 1000) / 10;
}


export default function Index({profile, group, tasks, topic, ratings, topics}) {
  console.log("cid", topics);
  console.log(ratings)
  return <AppLayout profile={profile}>
    <div className={styles.container}>
      <Sidebar
        title="Темы"
        backLink={`/classes/`}
        backTitle={`< Классы`}
      >
        {topics.map(({id, title}) => (
          <SidebarItem key={id} href={`/classes/${group.id}/ratings/${id}/`}>{title}</SidebarItem>)
        )}
      </Sidebar>
      <div className={styles.content}>

        <ContentBlock title="Успеваемости учеников" data={topic.title}>
          {tasks.length ?

            <><div className={styles.ratingsWrapper}><div className={styles.ratingsContent}>

              <div className={styles.students}>
                <div className={styles.studentsHeader}>
                  <div>Ученик</div>
                  <div>Успеваемость</div>
                </div>

                <div className={styles.studentsList}>


                  {ratings.map((rating) => <div key={rating.student.id} className={styles.item}>
                    <div>{rating.student.lastName} {rating.student.firstName[0]}.</div>
                    <div><b>{<RelativeRating rating={rating.tasks} tasks={tasks}  />}%</b></div>
                  </div>)}

                </div>
              </div>

              <div className={styles.ratings}>
                <div className={styles.ratingsHeader}>

                  {tasks.map((task) => <Fragment key={task.id}>
                    <div className={styles.taskField}>{task.title}</div>
                    <div className={styles.fieldsSeparator}></div>
                  </Fragment>)}

                </div>

                <div className={styles.ratingsList}>

                  {ratings.map((rating) => <div key={rating.id} className={styles.row}>
                    <Status rating={rating.tasks} tasks={tasks}/>
                  </div>)}

                </div>
              </div>
            </div>
              </div></> :
          <p>В этой теме ещё нет задач для оценки успеваемости.</p>}

        </ContentBlock>


      </div>
    </div>

  </AppLayout>
}