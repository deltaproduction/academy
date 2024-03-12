import AppLayout from "@/layouts/AppLayout";

import { CoursesApi }      from "@/lib/api";
import { ContextProvider } from "@/components/ContextProvider";
import CoursesSidebar      from "@/components/Courses/CoursesSidebar";

import styles                        from './CoursesLayout.module.scss'
import { getProfileServerSideProps } from "@/lib/utils";


export async function getCoursesLayoutProps({req, res}) {
  const {props} = await getProfileServerSideProps({req, res})

  const response = await CoursesApi.list({req, res})
  props.courses = await response.json()

  return {layoutProps: props}
}

export default function CoursesLayout({children, courses, profile}) {
  return (
    <AppLayout profile={profile}>
      <div className={styles.container}>
        <ContextProvider context={{courses}}>
          <CoursesSidebar/>

          <div className={styles.contentBlock}>
            {children}
          </div>
        </ContextProvider>
      </div>
    </AppLayout>
  );
}
