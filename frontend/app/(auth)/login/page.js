'use client'

import React from "react";

import FormItem     from "@/app/components/FormItem";
import Links        from "@/app/components/Links";
import FormRowSided from "@/app/components/FormRowSided";
import Button       from "@/app/components/Button";

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
