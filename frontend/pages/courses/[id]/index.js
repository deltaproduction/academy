import Course                                       from "@/components/Courses/Course";
import CoursesLayout, { getCoursesServersideProps } from "@/layouts/CoursesLayout";

import { CoursesApi } from "@/lib/api";

export async function getServerSideProps({query: {id}, req, res}) {
  try {
    const props = await getCoursesServersideProps({req, res})

    const response = await CoursesApi.detail(id, {req, res})
    if (response.status === 404) {
      return {notFound: true}
    }
    props.course = await response.json()

    return {props}
  } catch (e) {
    return e
  }
}

export default function ClassDetail({profile, course, courses}) {
  return <CoursesLayout courses={courses} profile={profile}>
    <Course course={course}/>
  </CoursesLayout>
}
