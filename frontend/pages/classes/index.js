import { ClassesApi } from "@/lib/api";

export async function getServerSideProps({req, res}) {
  const response = await ClassesApi.list({req, res})

  if (response.status === 401) {
    return {redirect: {destination: `/login/?next=${req.url}`, permanent: false}}

  }
  const classes = await response.json()
  return {redirect: {destination: classes.length ? `/classes/${classes[0].id}/` : '/classes/new/', permanent: false}}
}


export default function Page() {
  return <div></div>
}
