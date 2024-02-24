"use client"

import styles       from "./page.module.scss";
import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")

  const onChangeValue = setStateFunction => e => {
    setStateFunction(e.target.value)
  }

  return <div>
    <form>
      <div>Создание аккаунта</div>
      <input type="text" placeholder="Имя" value={name} onChange={onChangeValue(setName)}/>
      <input type="text" placeholder="Фамилия" value={surname} onChange={onChangeValue(setSurname)}/>
      <input type="text" placeholder="Фамилия" value={surname} onChange={onChangeValue(setSurname)}/>
    </form>
  </div>
}