'use client'

import React from "react";

import FormItem     from "@/app2/components/FormItem";
import Links        from "@/app2/components/Links";
import FormRowSided from "@/app2/components/FormRowSided";
import Button       from "@/app2/components/Button";

export default function LoginPage() {
  const onFormSubmit = async formData => {
    await fetch('/api/sign_in/', {
      method: 'POST',
      body: formData
    })
    location.reload()
  }

  return (
    <main>
      <h1 className="h3">Вход</h1>

      <form action={onFormSubmit}>
        <FormItem title="E-mail:" name="email" type="email"/>
        <FormItem title="Пароль:" name="password" type="password"/>
        <FormRowSided
          leftSide={<Links type="login"/>}
          rightSide={<Button type="submit" text="Войти"/>}
        />
      </form>
    </main>
  );
}
