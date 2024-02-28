'use client'

import {useState} from "react";

import FormItem from "@/app/components/FormItem";
import FormRowSided from "@/app/components/FormRowSided";
import BlueButton from "@/app/components/BlueButton";
import Links from "@/app/components/Links";

import styles from "./register.module.scss";

function RoleButtons(props) {
    let [isTeacherActive, setIsTeacherActive] = useState(false);

    return (
        <div className={styles.roleButtonsBlock}>
            <div
                className={`${styles.roleButtonsChoice} ${!isTeacherActive ? styles.active : ''}`}
                onClick={() => setIsTeacherActive(false)}
            >Я ученик</div>
            <div
                className={`${styles.roleButtonsChoice} ${isTeacherActive ? styles.active : ''}`}
                onClick={() => setIsTeacherActive(true)}
            >Я учитель</div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <main>
            <h1>Создание аккаунта</h1>
            <RoleButtons />
            <FormItem title="Имя:" name="name" type="text" />
            <FormItem title="Фамилия:" name="surname" type="text" />
            <FormItem title="Отчество:" name="lastname" type="text" />
            <FormItem title="E-mail:" name="email" type="email" />
            <FormItem title="Пароль:" name="password" type="password" />
            <FormRowSided
                leftSide={<Links type="register" />}
                rightSide={<BlueButton text="Создать" />}
            />
        </main>
    );
}

