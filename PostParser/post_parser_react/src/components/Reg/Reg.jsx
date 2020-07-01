import React, { useState } from "react";
import { Form, Input, Button, Checkbox } from 'antd';
import css from './Reg.module.css';
import {axiosAllowAny} from '../../api/api';
import { Redirect } from 'react-router-dom';

const layout = {
  labelCol: {
    span: 11,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 11,
    span: 16,
  },
};

const RegForm = (props) => {
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
        label="Имя"
        name="first_name"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Фамилия"
        name="last_name"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
            {
              type: 'email',
              message: 'Некорректный email!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
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
            message: 'Пожалуйста, введите пароль!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Повторите пароль"
        name="password_again"
        dependencies={['password']}
        rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('Пароли не совпадают!');
              },
            }),
          ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Зарегистрироваться
        </Button>
      </Form.Item>
    </Form>
  );
}

const Reg = (props) => {
    const [redirect, setRedirect] = useState(false);
    const [showMsg, setShowMsg] = useState(false);
    
    const onRedirectBtnClick = () => {
        setRedirect(true);
    }

    const onFinish = (values) => {
        axiosAllowAny.post('/user/create/',
        {
            user:{
                username: values.username,
                password: values.password,
                email: values.email,
                first_name: values.first_name? values.first_name : null,
                last_name: values.last_name? values.last_name : null,
            }
            
        })
        .then(response => {
            if (response.status === 200) setShowMsg(true);
                
        })
        .catch(err => {
            if (err.status === 400)
                alert("Аккаунт с такими данными уже зарегистрирован.")
        });

    }
    
    const onFinishFailed = (err) => {
        alert(err);
    }

    return (
            !redirect?
                    <div className={css.container}>
                        {!showMsg?
                            <RegForm onFinish={onFinish} onFinishFailed={onFinishFailed}/>
                         :
                            <div className={css.msg}>
                                <span className={css.span}>Вы успешно зарегистрированы!</span><br/>
                                <span className={css.span2}>Ожидайте, пока Ваш аккаунт активируют.</span><br/>
                                <Button onClick={onRedirectBtnClick}>ОК</Button>
                            </div>
                        }
                    </div>
            :
                <Redirect to="/login/"/>
    )
}

export default Reg;