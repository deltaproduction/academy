import { ClassesApi, CoursesApi, TopicsApi } from "@/lib/api";
import { getStudentServerSideProps }         from "@/lib/utils";
import AppLayout                             from "@/layouts/AppLayout";
import styles                                from "@/pages/classes/[class_id]/index.module.scss";
import { Sidebar, SidebarItem }              from "@/components/Sidebar";

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
    props.topic = await topicRes.json()

    return {props}
  } catch (e) {
    return e
  }
}

export default function ClassCourse({profile, group, topic, topics}) {
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
        {group.title}
        <pre>{JSON.stringify(topic)}</pre>
        {topic.tasks.map(({id, title}) => <div key={id}>
          <a href={`/classes/${group.id}/topics/${topic.id}/tasks/${id}`}>{title}</a>
        </div>)}
      </div>
    </div>

  </AppLayout>
}