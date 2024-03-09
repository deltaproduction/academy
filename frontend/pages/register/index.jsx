import { useState } from "react";

import FormItem     from "@/components/FormItem";
import FormRowSided from "@/components/FormRowSided";
import Button       from "@/components/Button";
import Links        from "@/components/Links";


import styles from "./register.module.scss";
import AuthLayout from "@/layouts/AuthLayout";


function RoleButtons(props) {
  let [isTeacherActive, setIsTeacherActive] = useState(false);

  return (
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
  );
}

export default function RegisterPage() {
  const onFormSubmit = async formData => {
    await fetch('/api/sign_up/', {
      method: 'POST',
      body: formData
    })
    location.reload()
  }

  return (
    <AuthLayout>
      <h1 className="h3">Создание аккаунта</h1>
      <RoleButtons/>
      <form action={onFormSubmit}>
        <FormItem title="Имя:" name="first_name" type="text"/>
        <FormItem title="Фамилия:" name="last_name" type="text"/>
        <FormItem title="Отчество:" name="middle_name" type="text"/>
        <FormItem title="E-mail:" name="email" type="email"/>
        <FormItem title="Пароль:" name="password" type="password"/>
        <FormItem title="Повторите пароль:" name="confirm_password" type="password"/>
        <FormRowSided
          leftSide={<Links type="register"/>}
          rightSide={<Button type="submit" text="Создать"/>}
        />
      </form>
    </AuthLayout>
  );
}

