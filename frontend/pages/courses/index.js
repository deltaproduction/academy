import { CoursesApi } from "@/lib/api";

export async function getServerSideProps({query: {next = '/'}, req, res}) {
  const response = await CoursesApi.list({req, res})
  if (response.ok) {
    const courses = await response.json()
    return {redirect: {destination: courses.length ? `/courses/${courses[0].id}/` : '/courses/new/', permanent: false}}
  }
  return {props: {next}}
}


export default function Page() {
  return <div></div>
}
