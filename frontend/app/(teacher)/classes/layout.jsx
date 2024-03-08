import { getGroupsList } from "@/lib/api";


import { ContextProvider } from "@/app/components/ContextProvider";
import ClassesSidebar      from "@/app/(teacher)/classes/components/ClassesSidebar";

import styles              from "@/app/(teacher)/classes/layout.module.scss";


export default async function Layout({children}) {
  const response = await getGroupsList()
  const classes = await response.json()

  return (
    <ContextProvider context={{classes}}>
      <div className={styles.container}>
        <ClassesSidebar/>
        {children}
      </div>
    </ContextProvider>
  );
}
