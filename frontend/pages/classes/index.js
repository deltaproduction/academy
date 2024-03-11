import { ClassesApi } from "@/lib/api";

export async function getServerSideProps({query: {next = '/'}, req, res}) {
  const response = await ClassesApi.list({req, res})
  if (response.ok) {
    const classes = await response.json()
    return {redirect: {destination: classes.length ? `/classes/${classes[0].id}/` : '/classes/new/', permanent: false}}
  }
  return {props: {next}}
}


export default function Page() {
  return <div></div>
}
