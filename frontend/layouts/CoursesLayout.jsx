import AppLayout from "@/layouts/AppLayout";

import { CoursesApi, getProfileData } from "@/lib/api";
import { ContextProvider }                from "@/components/ContextProvider";
import CoursesSidebar                     from "@/components/Courses/CoursesSidebar";

import styles from './CoursesLayout.module.scss'


export async function getCoursesServersideProps({req, res}) {
  const props = {}
  let response = await getProfileData({req, res})
  if (response.ok) {
    props.profile = await response.json()
  } else {
    throw {redirect: {destination: `/login/?next=${req.url}`, permanent: false}}
  }

  response = await CoursesApi.list({req, res})
  props.courses = await response.json()

  return props
}

export default function CoursesLayout({children, courses, profile}) {
  return (
    <ContextProvider context={{courses, profile}}>
      <AppLayout>
        <div className={styles.container}>
          <CoursesSidebar/>
          {children}
        </div>
      </AppLayout>
    </ContextProvider>
  );
}
