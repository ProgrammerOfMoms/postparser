import React, { useState, useEffect } from "react";
import css from './Poster.module.css';
import moment from "moment";
import locale from  'antd/es/date-picker/locale/ru_RU';
import ll from 'antd/es/date-picker/locale/en_US';
import {axiosAuth, getAllHeaders} from '../../api/api';
import { Form,
         Input, 
         Button,
         DatePicker,
         InputNumber,
         Card,
         Pagination   } from 'antd';
import Preloader from "../Preloader/Preloader";
import { Redirect } from "react-router-dom";
import $ from 'jquery';



const { RangePicker } = DatePicker;

moment.locale('ru');
  
const FilterForm= (props) => {
    const [form] = Form.useForm();
    const formLayout = 'horizontal';
  
    const formItemLayout =
      formLayout === 'horizontal'
        ? {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
          }
        : null;
  
    const buttonItemLayout =
      formLayout === 'horizontal'
        ? {
            wrapperCol: { span: 14, offset: 6 },
          }
        : null;
  
    return (
      <div>
        <Form
          {...formItemLayout}
          layout={formLayout}
          form={form}
          initialValues={{ layout: formLayout }}
          onFinish={props.onFinish}
          onFinishFailed={props.onFinishFailed}
        //   style={{border: "1px solid black"}}
        >
          <Form.Item 
            label="Запрос"
            name="q"
            rules={[
            {
                required: true,
                message: 'Пожалуйста, введите поисковый запрос!',
            },
            ]}>
            <Input onChange = {props.onQueryChange} />
          </Form.Item>
          <Form.Item label="Диапозон" name="time">
            <RangePicker 
                         placeholder={["от", "до"]}
                         size="middle"
                         inputReadOnly={true}
                         onCalendarChange={props.onCalendarChange}/>
          </Form.Item>
          <Form.Item label="Количество" name="count">
            <InputNumber min={1}
                         max={1000}
                         onChange = {props.onCountChange} />
          </Form.Item>
          <Form.Item {...buttonItemLayout}>
            <Button type="primary" htmlType="submit">Отправить</Button>
          </Form.Item>
        </Form>
      </div>
    );
}


const Poster = (props) => {
    const [posts, setPosts] = useState([]);
    const [count, setCount] = useState(3);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [query, setQuery] = useState("");
    const [is_show, setShow] = useState(true);
    const [preloader, setPreloader] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(19);

    const pageSize = 20;

    const unixToDate = (unix_time) => {
        let unix_timestamp = 1549312452
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        let date = new Date(unix_time * 1000);
        // Hours part from the timestamp
        let hours = date.getHours();
        // Minutes part from the timestamp
        let minutes = "0" + date.getMinutes();
        let day = date.getDate();
        day = Number(day) < 10 ? "0"+day : day;
        let month = date.getMonth();
        month = ""+(Number(month)+1)
        month = Number(month) < 10? "0"+month: month;
        let year = date.getFullYear();
        // Will display time in 10:30:23 format
        let formattedTime = day +'.'+month+'.'+year+' '+ hours + ':' + minutes.substr(-2);
        return formattedTime;
    }

    const getTitle = (v) => {
        return (<div className={css.title}>
                    <a target="_blank" href={`https://vk.com/public${Math.abs(v.owner_id)}`}>
                        {`https://vk.com/public${Math.abs(v.owner_id)}`}
                    </a>
                    <span>
                        {unixToDate(v.date)}
                    </span>
                </div>)
    }



    const getMaxPhoto = (array) => {
        if (array.length === 1) return array[0];
        let max = array.reduce((a, b) => {
            return a.height > b.height? a : b
        })
        return max
    }

    const onPaginationChange = value => {
      let s = (value -1) * pageSize;
      let e = value * pageSize;
      $("html, body").animate({ scrollTop: 0 }, 1000);
      setStart(s);
      setEnd(e);
    }

    const onQueryChange = (e) => {
        setQuery(e.currentTarget.value);
    }
    const onCountChange = (e) =>{
        setCount(e);
    }
    const onCalendarChange = (dates, datesStrings) => {
        setStartTime(datesStrings[0]);
        setEndTime(datesStrings[1]);
    }
    const onFinish = (values) => {
        setShow(false);
        setPreloader(true);
        let config = getAllHeaders();
        let slug = `posts/get/?q=${query}`;
        if (!!startTime) slug += `&start_time=${startTime}`;
        if (!!endTime) slug += `&end_time=${endTime}`;
        if (!!count) slug += `&count=${count}`;
        axiosAuth.get(slug, config)
        .then(response => {
            if (response.status === 200){
                setPosts(response.data)
                setPreloader(false);
            }
        })
        .catch(err => {
                alert(err.data)
                alert("Ваш аккаунт больше недействителен!");
                localStorage.removeItem("token");
                setPreloader(false);
                setRedirect(true);
        })
    }
    const onFinishFailed = (err) => {
        return
    }

    const onToggleForm = () => {
        setShow(!is_show)
    }

    return (
        !redirect?
            <div className={css.container}>
                {
                is_show?
                    <div className={css.form}>
                    <FilterForm
                    onQueryChange = {onQueryChange}
                    onCountChange = {onCountChange}
                    onCalendarChange = {onCalendarChange}
                    onFinish = {onFinish}
                    onFinishFailed = {onFinishFailed}/>
                    <Button onClick={onToggleForm}>Скрыть</Button>
                    </div>
                :
                    <Button disabled = {preloader? true : false}
                            className={css.btn}
                            type="primary"
                            onClick={onToggleForm}>Показать</Button>
                }
                {
                    preloader?
                        <div className={css.preloader}>
                            <Preloader/>
                        </div>
                    :
                        posts.length>0?
                            <div className={css.cards_block} style={{animation: "fadeIn 1s"}}>
                            {
                            posts.slice(start, end).map((v, i) => {
                                return (
                                    <div key = {i} className={css.card}>
                                        <Card style={{"background-color": "#EDEEF0"}} title={getTitle(v)}>
                                            <div className={css.card_content}>
                                                    <div className = {css.text}>
                                                        {v.text}
                                                    </div>
                                                        {
                                                        v.attachments?
                                                        <div className={css.attach}>
                                                            {
                                                                v.attachments.map((av, ai) => {
                                                                    return av.type === "photo"
                                                                    ?
                                                                    <div key={ai} className={css.photo_container}>
                                                                        <a target="_blank" href={getMaxPhoto(av.photo.sizes).url}>
                                                                        <img className={css.photo} 
                                                                            src={getMaxPhoto(av.photo.sizes).url}
                                                                        />
                                                                        </a>
                                                                    </div>
                                                                    :
                                                                        null
                                                                })
                                                            }
                                                        </div>
                                                        :
                                                            null
                                                        }
                                            </div>
                                        </Card>
                                    </div>
                                )
                            })}
                                <div className={css.pagination}>
                                    <Pagination
                                        defaultCurrent={1}
                                        defaultPageSize={pageSize}
                                        onChange={onPaginationChange}
                                        total={posts.length}
                                        />
                                </div>
                            </div>
                        :
                            null
                }
            </div>
        :
            <Redirect to = "/login/"/>
    )
}

export default Poster;