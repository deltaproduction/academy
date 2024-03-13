import { CoursesApi, TopicsApi }     from "@/lib/api";
import { getProfileServerSideProps } from "@/lib/utils";

import { isPlainObject }        from "next/dist/shared/lib/is-plain-object";
import AppLayout                from "@/layouts/AppLayout";
import styles                   from "@/pages/courses/[course]/index.module.scss";
import { Sidebar, SidebarItem } from "@/components/Sidebar";

export async function getServerSideProps({query: {topic, course}, req, res}) {
  try {
    const {props} = await getProfileServerSideProps({req, res})

    let response = await TopicsApi.list({queryParams: {course}, req, res})
    props.topics = await response.json()

    props.courseId = course

    if (topic === 'new') return {props}

    response = await TopicsApi.retrieve(topic, {req, res})

    if (response.status === 404) return {notFound: true}

    props.topic = await response.json()

    if (props.topic.course !== parseInt(course)) return {notFound: true}

    response = await CoursesApi.retrieve(course, {req, res})

    props.course = await response.json()

    return {props}
  } catch (e) {
    if (isPlainObject(e)) return e
    throw e
  }
}

const Layout = ({topics, profile, children, course}) => {
  return <AppLayout profile={profile}>
    <div className={styles.container}>
      <Sidebar
        title="Темы"
        newItemHref={`/courses/${course.id}/topics/new/`}
        backLink={`/courses/${course.id}/`}
        backTitle={`< ${course.title}`}
      >
        {topics.map(({id, title}) => (
          <SidebarItem key={id} href={`/courses/${course.id}/topics/${id}/`}>{title}</SidebarItem>)
        )}
      </Sidebar>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  </AppLayout>
}

const Topic = ({profile, topics, course, topic}) => {
  return <Layout profile={profile} topics={topics} course={course}>
    {!!topic && topic.title}
  </Layout>
}

export default Topic
