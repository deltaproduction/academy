import { ContextProvider } from "@/components/ContextProvider";
import ClassesSidebar      from "@/components/Classes/ClassesSidebar";

import { getProfileData, ClassesApi } from "@/lib/api";


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

  response = await ClassesApi.list({req, res})
  props.groups = await response.json()

  return props
}

export default function ClassesLayout({children, classes, profile}) {
  return (
    <AppLayout profile={profile}>
      <div className={styles.container}>
        <ContextProvider context={{classes}}>
          <ClassesSidebar/>

          <div className={styles.contentBlock}>
            {children}
          </div>
        </ContextProvider>
      </div>
    </AppLayout>
  );
}
