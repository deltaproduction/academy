import styles             from "./layout.module.scss";
import Header             from "@/app/components/Header";
import Sidebar            from "@/app/components/Sidebar";
import { getProfileData } from "@/lib/utils";


export default async function Layout({children}) {
  const userProfile = await getProfileData();
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

