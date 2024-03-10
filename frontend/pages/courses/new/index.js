import CoursesLayout, { getCoursesServersideProps } from "@/layouts/CoursesLayout";
import Course                                       from "@/components/Courses/Course";


export async function getServerSideProps({req, res}) {
  try {
    const props = await getCoursesServersideProps({req, res})
    return {props}
  } catch (e) {
    return e
  }
}

export default function Index(props) {
  return <CoursesLayout {...props}><Course/></CoursesLayout>
}
