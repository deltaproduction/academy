import Class                                        from "@/components/Classes/Class";
import ClassesLayout, { getClassesServersideProps } from "@/layouts/ClassesLayout";


export async function getServerSideProps({req, res}) {
  try {
    const props = await getClassesServersideProps({req, res})
    return {props}
  } catch (e) {
    return e
  }
}

export default async function Index() {
  return <ClassesLayout classes={groups} profile={profile}>
    <Class/>
  </ClassesLayout>
}
