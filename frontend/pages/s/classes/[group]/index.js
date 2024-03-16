import { TopicsApi } from "@/lib/api";

export async function getServerSideProps({query: {group}, req, res}) {
  const response = await TopicsApi.list({queryParams: {course}, req, res})
  if (response.ok) {
    const topics = await response.json()
    return {
      redirect: {
        destination: topics.length ? `/s/classes/${group}/topics/${topics[0].id}/` : `/s/courses/${group}/topics/new/`,
        permanent: false
      }
    }
  }
  return {redirect: {destination: `/login/?next=${req.url}`, permanent: false}}
}


export default function Page() {
  return <div></div>
}