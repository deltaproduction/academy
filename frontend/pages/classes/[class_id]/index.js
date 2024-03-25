import { useState }  from "react";
import { useRouter } from "next/router";

import {ClassesApi, CoursesApi, getStudentRatingApi, runCodeApi} from "@/lib/api";
import { getProfileServerSideProps } from "@/lib/utils";

import AppLayout from "@/layouts/AppLayout";

import { Sidebar, SidebarItem }   from "@/components/Sidebar";
import ContentBlock from "@/components/ContentBlock";
import SubmitButton from "@/components/SubmitButton";
import Table        from "@/components/Table";
import { CharField, SelectField } from "@/components/Fields";

import styles from "./index.module.scss";


export async function getServerSideProps({query: {class_id}, req, res}) {
  try {
    const {props} = await getProfileServerSideProps({req, res})

    if (props.profile.isStudent && class_id !== 'new') {
      return {redirect: {destination: `/classes/${class_id}/topics/`, permanent: false}}
    }

    const classesListRes = await ClassesApi.list({req, res})
    props.groups = await classesListRes.json()

    const coursesListRes = await CoursesApi.list({req, res})
    props.courses = await coursesListRes.json()

    if (class_id === 'new') return {props}

    const classRes = await ClassesApi.retrieve(class_id, {req, res})
    if (classRes.status === 404) {
      return {notFound: true}
    }
    props.group = await classRes.json()

    await getStudentRatingApi();

    return {props}
  } catch (e) {
    return e
  }
}


export default function ClassDetail({groups, profile, courses, group: group_ = {}}) {
  const [group, setGroup] = useState(group_)

  const {id, code, title, course, students, teacherName} = group;

  console.log("group", group)

  const [editMode, setEditMode] = useState(!id);

  const router = useRouter();

  const [classes, setClasses] = useState(groups);

  const [errors, setErrors] = useState({})

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

  function CodeBlock({code}) {
    return (<div className={styles.classCodeBlock} onClick={() => navigator.clipboard.writeText(code)}>
      {code.toString().split('').map((letter, i) => (
        <div key={i} className={styles.classCodeBlockDigit}>{letter}</div>
      ))}
    </div>);
  }

  function generateStudentsData(studentsList) {
    return studentsList.map(
      ({
         firstName,
         lastName,
         email,
         average,
         rating
       }, i) => ([i + 1, `${firstName} ${lastName}`, email, average, rating])
    )
  }

  const onFormSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    const formData = new FormData(e.target)

    const response = await (group.id ?
        ClassesApi.update(group.id, formData) :
        ClassesApi.create(formData)
    )

    if (response.status === 200) {
      const updatedClass = await response.json()
      setGroup(updatedClass)
      setClasses(classes.map(({id, title}) => group.id === id ? updatedClass : {id, title}))
      setEditMode(false)
    }

    if (response.status === 201) {
      const {id, title} = await response.json()
      setClasses([...classes, {id, title}])
      await router.push(`/classes/${id}/`)
    }

    if (response.status === 400) {
      setErrors(await response.json());
    }
  }

  return (<Layout classes={groups} profile={profile}>
    <ContentBlock
      setEditMode={setEditMode} editMode={editMode}
      title={id ? "Информация о классе" : "Новый класс"}
      between value="Код класса: "
      data={!!code && <CodeBlock code={code}/>}>
      <div>
        <form onSubmit={onFormSubmit}>
          <CharField label="Название класса" name="title" defaultValue={title} disabled={!editMode}
                     error={errors["title"]}/>
          <CharField label="Классный руководитель" name="teacher_name" defaultValue={teacherName}
                     disabled={!editMode} error={errors["teacher_name"]}/>
          <SelectField label="Курс обучения" name="course" defaultValue={course} disabled={!editMode}
                       error={errors["course"]}>
            <option value="">
              Выберите курс
            </option>
            {courses.map(({id, title}) => <option key={id} value={id}>{title}</option>)}
          </SelectField>
          {!!editMode && <SubmitButton/>}
        </form>
      </div>
    </ContentBlock>

    {id ?
      <ContentBlock title="Список класса" value="Количество:" data={students.length}>
        <div className={styles.links}>
          <a href={`/classes/${id}/ratings/`}>Открыть успеваемости учеников</a>
        </div>
        {
          students.length ?
            <Table
              fields={
                [
                  ["№", 8, "numberWithDot"],
                  ["Фамилия и имя", 40, "text"],
                  ["E-mail", 26, "text"],
                  ["Ср. усп.", 13, "rating"],
                  ["Баллы", 13, "text"]
                ]
              }
              data={generateStudentsData(students)}
            />
            : "Пока ни один ученик не присоединился к группе. Сообщите ученикам код класса."
        }

      </ContentBlock>
      : null
    }
  </Layout>);
}
