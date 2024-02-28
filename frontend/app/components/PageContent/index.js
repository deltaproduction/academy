import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";

import styles from "./index.module.scss";

export default function PageContent({children}) {
    return (
        <>
            <Header/>

            <div className={styles.contentPage}>
                <Sidebar title={"Классы"} />

                <div className={styles.contentBlock}>
                    {children}
                </div>

            </div>
        </>
    );
}
