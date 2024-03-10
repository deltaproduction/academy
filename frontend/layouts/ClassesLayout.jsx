import { ContextProvider } from "@/components/ContextProvider";
import ClassesSidebar      from "@/components/Classes/ClassesSidebar";

import { getGroupsList, getProfileData } from "@/lib/api";


import AppLayout from "@/layouts/AppLayout";

import styles from './ClassesLayout.module.scss'


export async function getClassesServersideProps({req, res}) {
  const props = {}
  let response = await getProfileData({req, res})
  if (response.ok) {
    props.profile = await response.json()
  } else {
    throw {redirect: {destination: `/login/?next=${req.url}`, permanent: false}}
  }

  response = await getGroupsList({req, res})
  props.groups = await response.json()

  return props
}

export default function ClassesLayout({children, classes, profile}) {
  return (
    <ContextProvider context={{classes, profile}}>
      <AppLayout>
        <div className={styles.container}>
          <ClassesSidebar/>
          {children}
        </div>
      </AppLayout>
    </ContextProvider>
  );
}
