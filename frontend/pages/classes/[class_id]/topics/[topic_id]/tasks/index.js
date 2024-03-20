import { TasksApi } from "@/lib/api";

export async function getServerSideProps({query: {class_id, topic_id}, req, res}) {
  const response = await TasksApi.list({queryParams: {topic: topic_id}, req, res})
  if (response.ok) {
    const tasks = await response.json()
    if (!tasks.length) {
      return {notFound: true}
    }
    return {
      redirect: {
        destination: `/classes/${class_id}/topics/${topic_id}/tasks/${tasks[0].id}/`,
        permanent: false
      }
    }
  }
  return {redirect: {destination: `/login/?next=${req.url}`, permanent: false}}
}

export default function Page() {
  return <div></div>
}