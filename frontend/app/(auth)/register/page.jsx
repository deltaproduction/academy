"use client"

import { useState } from "react";


export default function Register() {
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onChangeValue = setStateFunction => e => {
    setStateFunction(e.target.value)
  }

  const onFormSubmit = formData => {

  }

  return <div>
    <form action={onFormSubmit}>
      <div>Создание аккаунта</div>
      <input type="text" placeholder="Имя" value={name} onChange={onChangeValue(setName)}/>
      <input type="text" placeholder="Фамилия" value={surname} onChange={onChangeValue(setSurname)}/>
      <input type="email" placeholder="Email" value={email} onChange={onChangeValue(setEmail)}/>
      <input type="password" placeholder="Пароль" value={password} onChange={onChangeValue(setPassword)}/>
      <input type="submit" value="Войти"/>
    </form>
  </div>
}