"use client"

import { useState } from "react";
import Link         from "next/link";


export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onChangeValue = setStateFunction => e => {
    setStateFunction(e.target.value)
  }

  const onFormSubmit = async formData => {
    await fetch('/api/sign_in/', {
      method: 'POST',
      body: formData
    })
    location.reload()
  }

  // Если у sign_in есть параметр next то нужно его передать в sign_up
  return <div>
    <form action={onFormSubmit}>
      <div>Вход</div>
      <input type="email" placeholder="Email" name="email" value={email} onChange={onChangeValue(setEmail)}/>
      <input type="password" placeholder="Пароль" name="password" value={password}
             onChange={onChangeValue(setPassword)}/>
      <input type="submit" value="Войти"/>
    </form>
    <Link href="/sign_up">Регистрация</Link>
  </div>
}