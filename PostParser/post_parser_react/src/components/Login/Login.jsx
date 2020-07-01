import React, { useState } from "react";
import { Form, Input, Button, Checkbox } from 'antd';
import css from './Login.module.css';
import {axiosAllowAny} from '../../api/api';
import { Redirect } from 'react-router-dom';

const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 7,
    span: 16,
  },
};

const LoginForm = (props) => {
  const onFinish = values => {
    props.onFinish(values);
  };

  const onFinishFailed = errorInfo => {
    props.onFinishFailed(errorInfo);
  };

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{
        remember: false,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Логин"
        name="username"
        rules={[
          {
            required: true,
            message: 'Пожалуйста, введите имя пользователя!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Пароль"
        name="password"
        rules={[
          {
            required: true,
            message: 'Пожалуйста, введите Ваш пароль!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>Запомнить меня</Checkbox>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Войти
        </Button> <br/>
        Или <a href="/signup/">зарегистрируйтесь сейчас!</a>
      </Form.Item>
    </Form>
  );
}

const Login = (props) => {
    const [redirect, setRedirect] = useState(!!localStorage.getItem("token"));
    
    const onFinish = (values) => {
        axiosAllowAny.post('/user/login/',
        {
            username: values.username,
            password: values.password
        })
        .then(response => {
            if (response.status === 200)
                localStorage.setItem("token", response.data.token);
                setRedirect(true);
                
        })
        .catch(err => {
            if (err.status === 400)
                alert("Неверное имя пользователя или пароль\nВозможно Ваш аккаунт еще не активирован.")
        });

    }
    
    const onFinishFailed = (err) => {
        alert(err);
    }

    return (
            !redirect?
                <div className={css.container}>
                    <LoginForm onFinish={onFinish} onFinishFailed={onFinishFailed}/>
                </div>
            :
                <Redirect to="/post_parser/"/>
    )
}

export default Login;