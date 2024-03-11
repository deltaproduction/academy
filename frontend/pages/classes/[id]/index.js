import { ClassesApi } from "@/lib/api";
import Class          from "@/components/Classes/Class";
import ClassesLayout, { getClassesServersideProps } from "@/layouts/ClassesLayout";

export async function getServerSideProps({query: {id}, req, res}) {
  try {
    const props = await getClassesServersideProps({req, res})

    const response = await ClassesApi.detail(id, {req, res})
    if (response.status === 404) {
      return {notFound: true}
    }
    props.group = await response.json()

    return {props}
  } catch (e) {
    return e
  }
}

export default function ClassDetail({profile, group, groups}) {
  return <ClassesLayout classes={groups} profile={profile}>
    <Class group={group}/>
  </ClassesLayout>
}
