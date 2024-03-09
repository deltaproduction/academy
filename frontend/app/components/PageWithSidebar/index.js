'use client';

import styles from "./index.module.scss";
import {useRouter, usePathname} from "next/navigation";

const SidebarItem = (props) => {
    return (
        <div
            className={
                `
                    ${styles.mainSidebarItemBlock} 
                    ${props.active ? styles.active : null}
                `
            }
        >{props.content}</div>
    );
}

const MainSidebar = (props) => {
    const pathname = usePathname();
    const router = useRouter();
    const handleClick = () => {
        router.push('/classes/new');
    };

    return (
        <>
            <div className={styles.mainSidebarBlock}>
                <div className={styles.mainSidebarHeaderBlock}>
                    <div className={styles.mainSidebarHeaderTitleBlock}>{props.title}</div>
                    <div
                        className={styles.mainSidebarPlusButtonBlock}
                        onClick={handleClick}
                    ></div>
                </div>

                <div className={styles.sidebarItemsBlock}>
                    <SidebarItem content="hey" active/>
                    <SidebarItem content="hey"/>
                </div>
            </div>
        </>
    );
}

export default function PageWithSidebar(PropsWithChildren) {
    return (
        <>
            <MainSidebar
                title={PropsWithChildren.title}
            />

            <div className={styles.contentBlock}>
                {PropsWithChildren.children}
            </div>
        </>
    );
}

