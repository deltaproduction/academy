import { useState }      from "react";
import { useRouter }     from "next/router";
import { isPlainObject } from "next/dist/shared/lib/is-plain-object";


import { CoursesApi, TopicsApi }     from "@/lib/api";
import { getTeacherServerSideProps } from "@/lib/utils";

import AppLayout                  from "@/layouts/AppLayout";
import { CharField, SelectField } from "@/components/Fields";
import { Sidebar, SidebarItem }   from "@/components/Sidebar";
import ContentBlock from "@/components/ContentBlock";
import SubmitButton from "@/components/SaveChangesField";


import styles from "./index.module.scss";
import Table from "@/components/Table";


export async function getServerSideProps({query: {course}, req, res}) {
  try {
    const {props} = await getTeacherServerSideProps({req, res})

    const response = await CoursesApi.list({req, res})

    props.courses = await response.json()

    if (course === 'new') return {props}

    const courseRes = await CoursesApi.retrieve(course, {req, res})
    if (courseRes.status === 404) {
      return {notFound: true}
    }
    props.course = await courseRes.json()

    const topicsRes = await TopicsApi.list({queryParams: {course}, req, res})
    if (topicsRes.ok) {
      props.topics = await topicsRes.json()
    }

    return {props}
  } catch (e) {
    if (isPlainObject(e)) return e
    throw e
  }
}

const Layout = ({courses, profile, children}) => {
  return <AppLayout profile={profile}>
    <div className={styles.container}>
      <Sidebar title="Курсы" newItemHref='/courses/new/'>
        {courses.map(({id, title}) => (
          <SidebarItem key={id} href={`/courses/${id}/`}>{title}</SidebarItem>)
        )}
      </Sidebar>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  </AppLayout>
}

const Course = (props) => {
  const {profile, course, courses: courses_, topics} = props;

  const [editMode, setEditMode] = useState(!course.id);

  const router = useRouter()

  const [courses, setCourses] = useState(courses_)

  const onCourseFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    if (course.id) {
      const response = await CoursesApi.update(course.id, formData)
      const updatedCourse = await response.json()
      setCourses(courses.map(({id, title}) => course.id === id ? updatedCourse : {id, title}))
      setEditMode(!response.ok)
      return
    }
    const response = await CoursesApi.create(formData)
    const {id, title} = await response.json()

    setCourses([...courses, {id, title}])

    await router.push(`/courses/${id}/`)
  }

  function generateTopicsData(topics) {
    let data = [];

    for (let i = 0; i < topics.length; i ++) {
      let topic = topics[i];
      let id = topic.id;

      data.push([i + 1, [topic.title, `/courses/${course.id}/topics/${id}`], topic.type, topic.state])
    }

    return data;
  }

  return (
    <Layout courses={courses} profile={profile}>
      <ContentBlock setEditMode={setEditMode} editMode={editMode} title="Информация о курcе">
        <div>
          <form onSubmit={onCourseFormSubmit}>
            <CharField label="Название курса" name="title" defaultValue={course.title} disabled={!editMode}/>
            <CharField label="Описание курса" name="description" defaultValue={course.description}
                       disabled={!editMode}/>

            <SelectField label="Статус" name="state" defaultValue={course.state} disabled={!editMode}>
              <option value="0">Черновик</option>
              <option value="1">Опубликован</option>
            </SelectField>
            {!!editMode && <SubmitButton/>}
          </form>
        </div>
      </ContentBlock>

      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}

      <ContentBlock title="Список уроков" value="Количество:" data={topics.length}>

        <div className={styles.links}>
          <a href={`/courses/${course.id}/topics/`}>Перейти в раздел уроков</a>
          <a href={`/courses/${course.id}/topics/new/`}>Создать новый урок</a>
        </div>


        <Table
            fields={
              [
                ["№", 8, "numberWithDot"],
                ["Название урока", 62, "link"],
                ["Тип", 15, "topicType"],
                ["Откр.", 15, "visibility"]
              ]
            }

            data={generateTopicsData(topics)}
        />
      </ContentBlock>
    </Layout>);
}

Course.defaultProps = {
  course: {},
  topics: [],
}

export default Course
