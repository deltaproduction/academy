import { TopicsApi } from "@/lib/api";

export async function getServerSideProps({query: {course}, req, res}) {
  const response = await TopicsApi.list({req, res})
  if (response.ok) {
    const topics = await response.json()
    return {
      redirect: {
        destination: topics.length ? `/courses/${course}/topics/${topics[0].id}/` : `/courses/${course}/topics/new/`,
        permanent: false
      }
    }
  }
  return {redirect: {destination: `/login/?next=${req.url}`, permanent: false}}
}


export default function Page() {
  return <div></div>
}