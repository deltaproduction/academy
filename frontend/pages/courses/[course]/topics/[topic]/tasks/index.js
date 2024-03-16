import { TasksApi } from "@/lib/api";

export async function getServerSideProps({query: {course, topic}, req, res}) {
  const response = await TasksApi.list({queryParams: {topic}, req, res})
  if (response.ok) {
    const tasks = await response.json()
    return {
      redirect: {
        destination: `/courses/${course}/topics/${topic}/tasks/${tasks.length ? tasks[0].id : 'new'}/`,
        permanent: false
      }
    }
  }
  return {redirect: {destination: `/login/?next=${req.url}`, permanent: false}}
}

export default function Page() {
  return <div></div>
}