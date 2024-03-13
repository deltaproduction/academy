import React         from "react";
import { useRouter } from "next/router";

import { getProfileData } from "@/lib/api";

import FormItem     from "@/components/FormItem";
import Links        from "@/components/Links";
import FormRowSided from "@/components/FormRowSided";
import Button       from "@/components/Button";
import AuthLayout   from "@/layouts/AuthLayout";

export async function getServerSideProps({query: {next = '/'}, req, res}) {
  const response = await getProfileData({req, res})
  if (response.ok) {
    return {redirect: {destination: next, permanent: false}}
  }
  return {props: {next}}
}

export default function LoginPage({next}) {
  const router = useRouter()
  const onFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    await fetch('/api/sign_in/', {
      method: 'POST',
      body: formData
    })
    location.href = next
  }

  return (
    <AuthLayout>
      <h1 className="h3">Вход</h1>
      <form onSubmit={onFormSubmit}>
        <FormItem title="E-mail:" name="email" type="email"/>
        <FormItem title="Пароль:" name="password" type="password"/>
        <FormRowSided
          leftSide={<Links type="login"/>}
          rightSide={<Button type="submit" text="Войти"/>}
        />
      </form>
    </AuthLayout>
  );
}
