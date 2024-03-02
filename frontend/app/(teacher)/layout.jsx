import styles             from "./layout.module.scss";
import Header             from "@/app/components/Header";
import Sidebar            from "@/app/components/Sidebar";
import { getProfileData } from "@/lib/api";
import { camelize }       from "@/lib/utils";
import { headers }        from "next/headers";


export default async function Layout({children}) {
  const response = await getProfileData(headers());
  const userProfile = camelize(await response.json())
  return (
    <>
      <Header user={userProfile}/>

      <div className={styles.contentPage}>
        <Sidebar title={"Классы"}/>

        <div className={styles.contentBlock}>
          {children}
        </div>

      </div>
    </>

  );
}

