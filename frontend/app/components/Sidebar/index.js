import styles from "./index.module.scss";

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
    return (
        <>
            <div className={styles.mainSidebarBlock}>
                <div className={styles.mainSidebarHeaderBlock}>
                    <div className={styles.mainSidebarHeaderTitleBlock}>{props.title}</div>
                    <div className={styles.mainSidebarPlusButtonBlock}></div>
                </div>

                <div className={styles.sidebarItemsBlock}>
                    <SidebarItem content="hey" active/>
                    <SidebarItem content="hey"/>
                </div>
            </div>
        </>
    );
}

export default function Sidebar(props) {
    return (
        <>
            <div>
                <MainSidebar title={props.title}/>
            </div>
        </>
    );
}

