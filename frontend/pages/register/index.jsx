import { useState } from "react";

import FormItem     from "@/components/FormItem";
import FormRowSided from "@/components/FormRowSided";
import Button       from "@/components/Button";
import Links        from "@/components/Links";

import AuthLayout from "@/layouts/AuthLayout";

import styles from "./register.module.scss";
import { getProfileData } from "@/lib/api";
import {CharField} from "@/components/Fields";


export async function getServerSideProps({req, res}) {
  const response = await getProfileData({req, res})
  if (response.ok) {
    return {redirect: {destination: '/', permanent: false}}
  }
  return {props:{}}
}

export default function RegisterPage() {
  const [errors, setErrors] = useState('');
  let [isTeacherActive, setIsTeacherActive] = useState(false);

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('role', isTeacherActive ? 'teacher' : 'student');
    const response = await fetch('/api/sign_up/', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      location.reload();
    } else {
      setErrors(await response.json());
    }
  }

  return (
    <AuthLayout>
      <h1 className="h3">Создание аккаунта</h1>
      <div className={styles.roleButtonsBlock}>
        <div
          className={`${styles.roleButtonsChoice} ${!isTeacherActive ? styles.active : ''}`}
          onClick={() => setIsTeacherActive(false)}
        >Я ученик
        </div>
        <div
          className={`${styles.roleButtonsChoice} ${isTeacherActive ? styles.active : ''}`}
          onClick={() => setIsTeacherActive(true)}
        >Я учитель
        </div>
      </div>
      <form onSubmit={onFormSubmit}>
        <div className={styles.formFieldsWrapper}>
          <CharField label="Имя" name="first_name" type="text" error={errors ? errors["firstName"] : null}/>
          <CharField label="Фамилия" name="last_name" type="text" error={errors ? errors["lastName"] : null}/>
          <CharField label="Отчество" name="middle_name" type="text" error={errors ? errors["middleName"] : null}/>
          <CharField label="E-mail" name="email" type="email" error={errors ? errors["email"] : null}/>
          <CharField label="Пароль" name="password" type="password" error={errors ? errors["password"] : null}/>
          <CharField label="Повторите" name="confirm_password" type="password" error={errors ? errors["confirmPassword"] : null}/>
        </div>

          <FormRowSided
              leftSide={<Links type="register"/>}
              rightSide={<Button type="submit" text="Создать"/>}
          />
      </form>
    </AuthLayout>
);
}

