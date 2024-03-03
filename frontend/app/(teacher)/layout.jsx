import { getProfileData } from "@/lib/api";
import Header             from "@/app/components/Header";
import Sidebar            from "@/app/components/Sidebar";

import styles from "./layout.module.scss";

export default async function Layout({children}) {
  const response = await getProfileData();
  return (
    <>
      <Header user={response.camelized}/>

      <div className={styles.contentPage}>
        <Sidebar title={"Классы"}/>

        <div className={styles.contentBlock}>
          {children}
        </div>

      </div>
    </>

  );
}

