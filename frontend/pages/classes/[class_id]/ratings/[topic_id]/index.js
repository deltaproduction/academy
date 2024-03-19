import { ClassesApi, CoursesApi, fetchApi, TasksApi, TopicsApi } from "@/lib/api";
import { getStudentServerSideProps, getTeacherServerSideProps }  from "@/lib/utils";
import AppLayout                                                 from "@/layouts/AppLayout";
import styles                                                    from "@/pages/classes/[class_id]/index.module.scss";
import { Sidebar, SidebarItem }                                  from "@/components/Sidebar";
import ContentBlock from "@/components/ContentBlock";

export async function getServerSideProps({query: {class_id, topic_id}, req, res}) {
  try {
    const {props} = await getTeacherServerSideProps({req, res})

    const classRes = await ClassesApi.retrieve(class_id, {req, res})
    if (classRes.status === 404) {
      return {notFound: true}
    }
    props.group = await classRes.json()

    const topicsRes = await TopicsApi.list({queryParams: {group: class_id}, req, res})
    props.topics = await topicsRes.json()

    const topicRes = await TopicsApi.retrieve(topic_id, {req, res})
    if (topicRes.status === 404) {
      return {notFound: true}
    }
    props.topic = await topicRes.json()

    const tasksRes = await TasksApi.list({queryParams: {topic: topic_id}, req, res})
    props.tasks = await tasksRes.json()

    const ratingsRes = await fetchApi(`/api/ratings/${class_id}/${topic_id}/`, {req, res})
    props.ratings = await ratingsRes.json()

    return {props}
  } catch (e) {
    return e
  }
}

const statuses = {
  0: 'Успешно',
  1: 'Неверно',
  4: 'На проверке'
}

export default function Index({profile, group, tasks, ratings, topics}) {
  return <AppLayout profile={profile}>
    <div className={styles.container}>
      <Sidebar
        title="Темы"
        backLink={`/classes/`}
        backTitle={`< Классы`}
      >
        {topics.map(({id, title}) => (
          <SidebarItem key={id} href={`/classes/${group.id}/ratings/${id}/`}>{title}</SidebarItem>)
        )}
      </Sidebar>
      <div className={styles.content}>

        <ContentBlock title="Успеваемости учеников" data={"Самостоятельная 1"}>
          <div className={styles.ratingsWrapper}>
          <div className={styles.ratingsContent}>

            <div className={styles.students}>
              <div className={styles.studentsHeader}>Ученики</div>

              <div className={styles.studentsList}>
                <div className={styles.item}>
                  Иванов А.
                </div>
                <div className={styles.item}>
                  Артемий Л.
                </div>
                <div className={styles.item}>
                  Путин В.
                </div>
                <div className={styles.item}>
                  Михайлов С.
                </div>
              </div>
            </div>

            <div className={styles.ratings}>
              <div className={styles.ratingsHeader}>

                <div className={styles.taskField}>Привет, мир!</div>
                <div className={styles.fieldsSeparator}></div>
                <div className={styles.taskField}>Сумасшедший бариста</div>
                <div className={styles.fieldsSeparator}></div>
                <div className={styles.taskField}>Треугольники</div>
                <div className={styles.fieldsSeparator}></div>
                <div className={styles.taskField}>Существует?</div>
                <div className={styles.fieldsSeparator}></div>
                <div className={styles.taskField}>Сложи, если сможешь</div>
                <div className={styles.fieldsSeparator}></div>
                <div className={styles.taskField}>Набережная</div>
                <div className={styles.fieldsSeparator}></div>
                <div className={styles.taskField}>Числатан</div>
                <div className={styles.fieldsSeparator}></div>
                <div className={styles.taskField}>Последний</div>

              </div>

              <div className={styles.ratingsList}>

                <div className={styles.row}>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                </div>

                <div className={styles.row}>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                </div>
                <div className={styles.row}>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                </div>

                <div className={styles.row}>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                  <div className={styles.fieldsSeparator}></div>
                  <div className={styles.item}>10</div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </ContentBlock>

        {/*<!--table>
          <thead>
          <tr>
            <td>Ученик</td>
            {tasks.map(task => <td key={task.id}>{task.title}</td>)}
          </tr>
          </thead>
          <tbody>
          {ratings.map((rating) => <tr key={rating.student.id}>
            <td>{rating.student.firstName}</td>
            {tasks.map(task => <td key={task.id}>{rating.tasks[task.id] ? statuses[rating.tasks[task.id].status] : '-'}</td>)}
          </tr>)}
          </tbody>
        </table-->*/}

      </div>
    </div>

  </AppLayout>
}