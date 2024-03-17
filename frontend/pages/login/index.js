import React, { useState } from "react";
import { useRouter }       from "next/router";

import { getProfileData } from "@/lib/api";

import FormItem     from "@/components/FormItem";
import Links        from "@/components/Links";
import FormRowSided from "@/components/FormRowSided";
import Button       from "@/components/Button";
import AuthLayout   from "@/layouts/AuthLayout";

import styles from "./login.module.scss";

export async function getServerSideProps({query: {next = '/'}, req, res}) {
  const response = await getProfileData({req, res})
  if (response.ok) {
    return {redirect: {destination: next, permanent: false}}
  }
  return {props: {next}}
}

export default function LoginPage({next}) {
  const [errors, setErrors] = useState('')
  const onFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const response = await fetch('/api/sign_in/', {
      method: 'POST',
      body: formData
    })
    if (response.ok) {
      location.href = next
    } else if (response.status === 400) {
      setErrors(JSON.stringify(await response.json()));
    }
    console.log(errors ? Array.from(JSON.parse(errors)) : null);
  }

  return (
    <AuthLayout>
      <h1 className="h3">Вход</h1>
      <form onSubmit={onFormSubmit}>
        <FormItem title="E-mail:" name="email" type="email" errors={errors} />
        <FormItem title="Пароль:" name="password" type="password" errors={errors}/>

        {
          errors ?
              <div className={styles.errorsBlock}>
                <ul>
                  {JSON.parse(errors).email ? <li>E-mail: {JSON.parse(errors).email}</li> : null}
                  {JSON.parse(errors).password ? <li>Пароль: {JSON.parse(errors).password}</li> : null}
                </ul>
              </div>
              : null
        }

        <FormRowSided
          leftSide={<Links type="login"/>}
          rightSide={<Button type="submit" text="Войти"/>}
        />
      </form>
    </AuthLayout>
  );
}
