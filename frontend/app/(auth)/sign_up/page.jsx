"use client"

import { useState } from "react";
import Link         from "next/link";


export default function Register() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")

  const onChangeValue = setStateFunction => e => {
    setStateFunction(e.target.value)
  }

  const onFormSubmit = async formData => {
    await fetch('/api/sign_up/', {
      method:'POST',
      body: formData
    })
    location.reload()
  }

  return <div>
    <form action={onFormSubmit}>
      <div>Создание аккаунта</div>
      <input type="text" placeholder="Имя" name="first_name" value={firstName} onChange={onChangeValue(setFirstName)}/>
      <input type="text" placeholder="Фамилия" name="last_name" value={lastName} onChange={onChangeValue(setLastName)}/>
      <input type="email" placeholder="Email" name="email" value={email} onChange={onChangeValue(setEmail)}/>
      <input type="password" placeholder="Пароль" name="password" value={password}
             onChange={onChangeValue(setPassword)}/>
      <input type="password" placeholder="Повторите пароль" name="confirm_password" value={repeatPassword}
             onChange={onChangeValue(setRepeatPassword)}/>
      <input type="submit" value="Войти"/>
    </form>
    <Link href="/sign_in">Уже есть аккаунт?</Link>
  </div>
}