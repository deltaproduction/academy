import { TopicsApi }                 from "@/lib/api";
import { getProfileServerSideProps } from "@/lib/utils";

import { isPlainObject }        from "next/dist/shared/lib/is-plain-object";
import AppLayout                from "@/layouts/AppLayout";
import styles                   from "@/pages/courses/[course]/index.module.scss";
import { Sidebar, SidebarItem } from "@/components/Sidebar";

export async function getServerSideProps({query: {topic, course}, req, res}) {
  try {
    const {props} = await getProfileServerSideProps({req, res})

    let response = await TopicsApi.retrieve(topic, {req, res})
    if (response.ok) {
      props.topic = await response.json()
    } else {

    }

    const topicsRes = await TopicsApi.retrieve(topic, {req, res})


    props.courseId = course

    return {props}
  } catch (e) {
    if (isPlainObject(e)) return e
    throw e
  }
}

const Layout = ({topics, profile, children, courseId}) => {
  return <AppLayout profile={profile}>
    <div className={styles.container}>
      <Sidebar title="Темы" newItemHref={`/courses/${courseId}/topics/new/`}>
        {topics.map(({id, title}) => (
          <SidebarItem key={id} href={`/courses/${courseId}/topics/${id}/`}>{title}</SidebarItem>)
        )}
      </Sidebar>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  </AppLayout>
}

const Topic = ({topic, profile, children, courseId}) => {
  return <Layout profile={profile}>
    {topic.title}
  </Layout>
}

export default Topic
