import {useState} from "react";
import {isPlainObject} from "@/lib/utils";
import {python} from '@codemirror/lang-python';
import CodeMirror from '@uiw/react-codemirror';

import {AttemptsApi, TasksApi, TopicsApi} from "@/lib/api";
import {formatDateTime, getStudentServerSideProps} from "@/lib/utils";
import AppLayout from "@/layouts/AppLayout";

import styles from "./index.module.scss";
import classNames from "classnames";
import {PlayArrow} from "@mui/icons-material";
import {SelectField} from "@/components/Fields";

import {useRouter} from "next/router";


export async function getServerSideProps({query: {topic_id, task_id}, req, res}) {
  try {
    const {props} = await getStudentServerSideProps({req, res})

    let response = await TasksApi.list({queryParams: {topic: topic_id}, req, res})

    let tasks = await response.json()
    props.tasks = tasks

    response = await TopicsApi.retrieve(topic_id, {req, res})

    props.topic = await response.json()

    response = await TasksApi.retrieve(task_id, {req, res})

    if (response.status === 404) return {notFound: true}

    props.task = await response.json()

    response = await AttemptsApi.list({queryParams: {task: task_id}, req, res})
    if (response.ok) {
      const attempts = await response.json()
      if (attempts.length){
        props.attempt = attempts[0]
      }
    }

    response = await AttemptsApi.list({queryParams: {topic: topic_id}, req, res})

    if (response.ok) {
      const attempts = await response.json()
      if (attempts.length){
        props.attempts = attempts
      }
    }

    return {props}
  } catch (e) {
    if (isPlainObject(e)) return e
    throw e
  }
}

function TaskIcon({active, status, id}) {
  let router = useRouter();
  let {class_id, topic_id} = router.query;

  return <a href={`/classes/${class_id}/topics/${topic_id}/tasks/${id}`}><div className={styles.taskIconWrapper}>
    <div className={classNames(styles.taskIcon, active ? styles.active : null)}>
      <div className={
        classNames(
            styles.status,
            status !== undefined ?
                [styles.statusGreen,
                  styles.statusRed,
                  styles.statusRed,
                  styles.statusRed,
                  styles.statusGrey
                ][status] : null)
      }></div>
    </div>
  </div></a>;
}

function TasksSidebar({tasks, attempts, indicatorStatus}) {
  function getTaskIcons(tasks) {
    let result = [];
    for (let i = 0; i < tasks.length; i ++) {
      let id = tasks[i].id;
      let isActive = parseInt(task_id) === id;

      let status;

      if (isActive) {
        status = indicatorStatus === null ? attempts[id] : indicatorStatus;
      }
      else {
        status = attempts[id];
      }

      result.push(<TaskIcon key={id} id={id} active={isActive} status={status} />);
    }

    return result;
  }

  let router = useRouter();
  let {task_id} = router.query;

  let simpleTasks = tasks.filter((task) => task.type === 0);
  let homeTasks = tasks.filter((task) => task.type === 1);
  let hardTasks = tasks.filter((task) => task.type === 2);

  let simpleTasksObjects = getTaskIcons(simpleTasks);
  let homeTasksObjects = getTaskIcons(homeTasks);
  let hardTasksObjects = getTaskIcons(hardTasks);


  return <div className={styles.tasksSidebar}>
    <a href="../../" className={styles.backLink}>{"< Назад"}</a>
    <div className={styles.tasks}>
      {simpleTasksObjects}
    </div>
    <div className={styles.tasks}>
      {homeTasksObjects}
    </div>
    <div className={styles.tasks}>
      {hardTasksObjects}
    </div>
  </div>;
}

const Layout = ({profile, tasks, topic, children, attempts, indicatorStatus}) => {
  return <AppLayout profile={profile}>
    <div className={styles.container}>
      <TasksSidebar tasks={tasks} attempts={attempts} indicatorStatus={indicatorStatus} />

      <div className={styles.content}>
        {children}
      </div>
    </div>
  </AppLayout>
}

function CodeBlock({code, setCode, onCodeSubmit, status, error}) {
  return (<div>
    <div className={styles.taskBar}>
      <div>
        <SelectField label="Язык">
          <option value="">Python</option>
        </SelectField>
      </div>
      <div className={styles.buttons}>
        <div className={styles.runCodeButton}>
          <PlayArrow/>
        </div>
        <div className={styles.result}>
          <button
              onClick={status === 0 ? null : onCodeSubmit}
              className={status === 0 ? classNames(styles.statusButton, styles.green) : styles.sendSolutionButton}>
            {status === 0 ? "Задача решена" : "Сдать решение"}
          </button>
        </div>
      </div>
    </div>
    <CodeMirror
        height="240px"
        maxWidth="100%"
        extensions={[python()]}
        value={code}
        onChange={setCode}
    />
    {error ? <p className={styles.error}>{error}</p> : null}
  </div>);
}

function TestTabPage() {
  return <div className={classNames(styles.tabPageContent, styles.testContent)}>
    <textarea rows="10" placeholder="Входные данные (вводятся вручную)"></textarea>
    <textarea readOnly={true} rows="10" placeholder="Выходные данные (заполняются автоматически, нажмите на кнопку запуска над полем для ввода кода)"></textarea>
  </div>;
}

function VerdictTabPage({result}) {
  return <div className={styles.tabPageContent}>
    <div>

      {
        Object.keys(result).length ? <>
          {result.createdAt && <div className={styles.solutionDate}>{formatDateTime(result.createdAt)}</div>}

          {result.status === 1 && <div>
            <div className={styles.solutionStatus}>Неверное решение</div>

            {!!result.testCase && <>
              <div className={styles.solutionData}>
                <div>Входные данные:
                  <pre>{result.testCase.stdin}<br/></pre>
                </div>
              </div>

              <div className={styles.solutionData}>
                <div>Правильный ответ:
                  <pre>{result.testCase.stdout}<br /></pre>
                </div>
              </div>
              <div className={styles.solutionData}>
                <div>Ваш ответ:
                  <pre>{result.output}<br/></pre>
                </div>
              </div>
            </>
            } </div>}

          {result.status === 0 && <div>
            <div className={styles.solutionStatus}>Правильный ответ</div>
          </div>}

          {result.status === 2 && <div>
            <div className={styles.solutionStatus}>Ошибка при компиляции</div>

            <div className={styles.solutionData}>
              <div>Входные данные:
                <pre>{result.testCase.stdin}<br/></pre>
              </div>
            </div>

            <div className={styles.solutionData}>
              <div>Правильный ответ:
                <pre>{result.testCase.stdout}<br/></pre>
              </div>
            </div>
            <div className={styles.solutionData}>
              <div>Ошибка:
                <pre>{result.output}<br/></pre>
              </div>
            </div>
          </div>}

          {result.status === 3 && <div>
            <div className={styles.solutionStatus}>Превышен лимит времени</div>
              <div className={styles.solutionData}>
                <div>Установленный лимит: {result.testCase.timelimit} c
                </div>
              </div>
              <div className={styles.solutionData}>
                <div>Входные данные:
                  <pre>{result.testCase.stdin}<br/></pre>
                </div>
              </div>

              <div className={styles.solutionData}>
                <div>Правильный ответ:
                  <pre>{result.testCase.stdout}<br/></pre>
                </div>
              </div>
          </div>}


        </> : <p>Для получения вердикта нажмите на жёлтую кнопку «Сдать решение».</p>
      }


      {!!result && <>


        {result.status === 4 && <>
        <div className={styles.solutionStatus}>Отправлено на проверку</div>
          <p>Учитель проверит ваше решение вручную.</p>
        </>}
      </>}
    </div>
  </div>;
}

const Task = ({profile, tasks, topic, attempts, attempt = {}, task: {id, title, text, formatInText, formatOutText} = {}}) => {
  const [result, setResult] = useState(attempt)
  const [codeError, setCodeError] = useState(null)
  const [indicatorStatus, setIndicatorStatus] = useState(null)

  let tasksStatuses = {};

  attempts = attempts === undefined ? [] : attempts

  for (let i = 0; i < attempts.length; i ++) {
    let attempt = attempts[i];
    let task = attempt.task;
    let task_id = task.id
    tasksStatuses[task_id] = attempt.status;
  }

  const onCodeSubmit = async () => {
    const formData = new FormData()
    formData.append('task', id)
    formData.append('code', code === undefined ? '' : code)

    const result = await AttemptsApi.create(formData)
    if (result.ok) {
      let _result = await result.json();
      setResult(_result)
      codeError ? setCodeError(null) : null
      setTest(0);
      setIndicatorStatus(_result.status);
    } else if (result.status === 400) {
      let errors = await result.json();

      if ("code" in errors) {
        setCodeError(errors.code)
      }
    }
  }

  const [code, setCode] = useState(result ? result.code : "")

  let [test, setTest] = useState(result.status !== undefined ? 0 : 1);
  return <Layout profile={profile} topic={topic} tasks={tasks} attempts={tasksStatuses} indicatorStatus={indicatorStatus}>

    <div className={styles.taskContent}>

    <div className={styles.task}>
      <h1 className={styles.taskTitle}>{title}</h1>
      <div>
        <div>{text}</div>
      </div>

      <div>
        <h2 className={styles.taskTitle}>
          Формат входных данных
        </h2>
        <div>{formatInText}</div>
      </div>

      <div>
        <h2 className={styles.taskTitle}>
          Формат выходных данных
        </h2>
        <div>{formatOutText}</div>
      </div>

    </div>

    <div className={styles.sendingSolutionBlock}>
      <div>
        <CodeBlock code={code} setCode={setCode} onCodeSubmit={onCodeSubmit} status={result.status} error={codeError} />
      </div>
      <div>
        <div className={styles.tabsHeader}>
          <div
              onClick={() => setTest(1)}
              className={classNames(styles.button, styles.test, test ? styles.active : null)}>
            <span>
              Тестирование
            </span>
          </div>

          <div
              className={classNames(styles.button, styles.verdict, test ? null : styles.active)}
              onClick={() => setTest(0)}>
            <span>
              Вердикт
            </span>
          </div>

          <div className={styles.space}></div>
        </div>
        <div>
          {test ? <TestTabPage /> : <VerdictTabPage result={result} />}
        </div>
      </div>
    </div>
    </div>
  </Layout>
}

export default Task
