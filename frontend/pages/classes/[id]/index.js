import { useState }  from "react";
import { useRouter } from "next/router";

import { ClassesApi }                from "@/lib/api";
import { getTeacherServerSideProps } from "@/lib/utils";

import AppLayout from "@/layouts/AppLayout";

import { Sidebar, SidebarItem } from "@/components/Sidebar";
import ContentBlock             from "@/components/ContentBlock";
import SaveChangesField         from "@/components/SaveChangesField";
import Table                    from "@/components/Table";
import { CharField }            from "@/components/Fields";

import styles from "./index.module.scss";


export async function getServerSideProps({query: {id}, req, res}) {
  try {
    const {props} = await getTeacherServerSideProps({req, res})

    const classesListRes = await ClassesApi.list({req, res})
    props.groups = await classesListRes.json()

    if (id === 'new') return {props}

    const classRes = await ClassesApi.retrieve(id, {req, res})
    if (classRes.status === 404) {
      return {notFound: true}
    }
    props.group = await classRes.json()

    return {props}
  } catch (e) {
    return e
  }
}

function Layout({children, classes, profile}) {
  return (
    <AppLayout profile={profile}>
      <div className={styles.container}>
        <Sidebar title="Классы" newItemHref='/classes/new/'>
          {classes.map(({id, title}) => (
            <SidebarItem key={id} href={`/classes/${id}/`}>{title}</SidebarItem>)
          )}
        </Sidebar>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </AppLayout>
  );
}

function CodeBlock(props) {
  let code = props.code;

  return (<div className={styles.classCodeBlock} onClick={() => navigator.clipboard.writeText(code)}>
    {code.toString().split('').map((letter, i) => (
      <div key={i} className={styles.classCodeBlockDigit}>{letter}</div>
    ))}
  </div>);
}

function generateStudentsData(studentsList) {
  return studentsList.map(
    ({firstName, lastName, email, average, rating}, i) => ([i + 1, `${firstName} ${lastName}`, email, average, rating])
  )
}


export default function ClassDetail({groups, profile, group = {}}) {
  let {id, code, title, students, teacherName} = group;

  const [editMode, setEditMode] = useState(!id);

  const router = useRouter();

  const [classes, setClasses] = useState(groups);

  const onFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    if (group.id) {
      const response = await ClassesApi.update(group.id, formData)
      const updatedClass = await response.json()
      setClasses(classes.map(({id, title}) => group.id === id ? updatedClass : {id, title}))
      setEditMode(!response.ok)
      return
    }
    const response = await ClassesApi.create(formData)
    const {id, title} = await response.json()

    setClasses([...classes, {id, title}])

    await router.push(`/classes/${id}/`)
  }

  return (<Layout classes={groups} profile={profile}>
      <ContentBlock
        setEditMode={setEditMode} editMode={editMode}
        title={id ? "Информация о классе" : "Новый класс"}
        between value="Код класса: "
        data={!!code && <CodeBlock code={code}/>}>
        <div>
          <form onSubmit={onFormSubmit}>
            <CharField label="Название класса" name="title" defaultValue={title} disabled={!editMode}/>
            <CharField label="Классный руководитель" name="teacher_name" defaultValue={teacherName}
                       disabled={!editMode}/>
            {!!editMode && <SaveChangesField/>}
          </form>
        </div>
      </ContentBlock>
      {id ?
        <ContentBlock title="Список класса" value="Учеников:" data={students.length}>
          {
            students.length ?
              <Table
                fields={
                  [
                    ["№", 8, "numberWithDot"],
                    ["Фамилия и имя", 40, "text"],
                    ["E-mail", 26, "text"],
                    ["Ср. усп.", 13, "rating"],
                    ["Баллы", 13, "number"]
                  ]
                }
                data={generateStudentsData(students)}
              />
              : "Пока ни один ученик не присоединился к группе. Сообщите ученикам код класса."
          }

        </ContentBlock>
        : null
      }
    </Layout>
  );
}
