import { ClassesApi, TopicsApi }     from "@/lib/api";
import { getStudentServerSideProps } from "@/lib/utils";
import AppLayout                     from "@/layouts/AppLayout";

export async function getServerSideProps({query: {class_id}, req, res}) {
  try {
    const {props} = await getStudentServerSideProps({req, res})

    const classRes = await ClassesApi.retrieve(class_id, {req, res})
    if (classRes.status === 404) {
      return {notFound: true}
    }
    const group = await classRes.json()

    if (group.course) {
      const topicsRes = await TopicsApi.list({queryParams: {course: group.course.id}, req, res})
      const topics = await topicsRes.json()

      if (topics.length) {
        return {redirect: {destination: `/classes/${class_id}/topics/${topics[0].id}/`, permanent: false}}
      }
    }

    return {props}
  } catch (e) {
    return e
  }
}

export default function ClassCourse({profile}) {
  return <AppLayout profile={profile}>
    <div className="container">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/classes/">Назад к классам</a>
      <div>
        В этом классе еще нет активных тем для изучения
      </div>
    </div>
  </AppLayout>
}