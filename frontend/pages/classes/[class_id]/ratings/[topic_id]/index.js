import { ClassesApi, CoursesApi, fetchApi, TasksApi, TopicsApi } from "@/lib/api";
import { getStudentServerSideProps, getTeacherServerSideProps }  from "@/lib/utils";
import AppLayout                                                 from "@/layouts/AppLayout";
import styles                                                    from "@/pages/classes/[class_id]/index.module.scss";
import { Sidebar, SidebarItem }                                  from "@/components/Sidebar";

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
  0: 'Успешно',
  1: 'Неверно',
  4: 'На проверке'
}

export default function Index({profile, group, tasks, ratings, topics}) {
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
        <table>
          <thead>
          <tr>
            <td>Ученик</td>
            {tasks.map(task => <td key={task.id}>{task.title}</td>)}
          </tr>
          </thead>
          <tbody>
          {ratings.map((rating) => <tr key={rating.student.id}>
            <td>{rating.student.firstName}</td>
            {tasks.map(task => <td key={task.id}>{rating.tasks[task.id] ? statuses[rating.tasks[task.id].status] : '-'}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
    </div>

  </AppLayout>
}