import { CoursesApi }                from "@/lib/api";
import { getProfileServerSideProps } from "@/lib/utils";

import AppLayout           from "@/layouts/AppLayout";
import { ContextProvider } from "@/components/ContextProvider";
import CoursesSidebar      from "@/components/Courses/CoursesSidebar";

import styles from './TopicsLayout.module.scss'


export async function getTopicsLayoutProps({req, res}) {
  const {props} = await getProfileServerSideProps({req, res})

  const response = await CoursesApi.list({req, res})
  props.courses = await response.json()

  return {layoutProps: props}
}

export default function TopicsLayout({children, courses, profile}) {
  return (
    <AppLayout profile={profile}>
      <div className={styles.container}>
        <ContextProvider context={{courses}}>
          <CoursesSidebar/>
          <div className={styles.content}>
            {children}
          </div>
        </ContextProvider>
      </div>
    </AppLayout>
  );
}
