import React, { useRef, memo, useState, useMemo, } from "react";
import './styles.css';
import { Link } from 'react-router-dom';

import { FiShoppingCart } from 'react-icons/fi';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { AiOutlineMessage } from 'react-icons/ai';
import axios from "axios";

import { reduxStore } from "../redux";
import { SERVERADDRESS, TOKENENCODESTRING } from "../Constant";
import MessageContainerHeader from "./MessageContainerHeader";
import { ThemeContext } from "./Context";



const Header = () => {
    const loginState = useRef(false);
    const [messages, setMessages] = useState();
    const [props, setProps] = useState({
        notification: 0,
        message: 0,
        cart: 0
    });

    // check user login or not login
    let token = window.localStorage.getItem('token webbanhang');
    if (token !== null) {
        loginState.current = true;
    }

    let userInfor = JSON.parse(window.sessionStorage.getItem('userInfor'));


    const promise_getCart = new Promise((resolve, reject) => {
        userInfor && axios({ 
            method: 'get',
            url: `${SERVERADDRESS}/cart?type=getCart&userId=${userInfor.User_Id}`,
            headers: {
                Authorization: `${TOKENENCODESTRING} ${token}`
            }
        }).then(function (res) {
            if (res.data.state) {
                resolve({
                    type: 'getCart', 
                    data: res.data.data.recordset
                })
            }
        }).catch(err => reject(err));
    })

    useMemo(() => {
        // init data
        if (loginState.current) {
            Promise.all([promise_getCart]).then((values) => {
                // console.log(values[0]);
                let prop = {
                    notification: 0,
                    message: 0,
                    cart: 0
                }
                for (let i = 0; i< values.length; i++) {
                    if (values[i].type === 'getCart') {
                        prop = {...prop, cart: values[i].data.length}
                    }
                }
    
                setProps(prop);
            }).catch(err => console.error(err))
        }
        
        reduxStore.subscribe(() => {
            if (reduxStore.getState().type === 'addCart') {
                setProps(pre => {return {...pre, cart: pre.cart + 1}})
            }

            if (reduxStore.getState().type === 'saveMessageQueue') {
                let messagesData = reduxStore.getState().data;
                setMessages(messagesData);
                let messageCounter = 0;
                for (let i = 0; i < messagesData.length; i++) {
                    messageCounter = messageCounter + messagesData[i].data.length + props.message;
                }
                setProps(pre => {
                    return {...pre, message: messageCounter}
                })
            }
        })



        // stop complaining with comment:
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const oke_logout = () => {
        window.localStorage.removeItem('token webbanhang');
        window.sessionStorage.removeItem('userInfor');
    }

    const display_message = useRef(false);
    const handleSeeMessage = () => {
        if (!display_message.current) {
            document.getElementById('Header-messageContainer').style.display = 'block';
            display_message.current = true;
        } else {
            document.getElementById('Header-messageContainer').style.display = 'none';
            display_message.current = false;
        }
    }

    return (
        <div>
           <nav>
                <ul className="Header">
                    <div>
                        <li className="HeaderComponent"><Link className='nav-link' to='/'>Trang chủ</Link></li>
                        <li className="HeaderComponent"><Link className='nav-link' to='/product'>Sản phẩm</Link></li>
                        <li className="HeaderComponent"><Link className='nav-link' to='/contact'>Liên hệ</Link></li>
                        <li className="HeaderComponent"><Link className='nav-link' to='/report'>Báo cáo</Link></li>
                        {
                            loginState.current ?
                            <li onClick={() => oke_logout()} className="HeaderComponent"><Link className='nav-link' to='/login'>Thoát</Link></li>:
                            <li className="HeaderComponent"><Link className='nav-link' to='/login'>Đăng nhập</Link></li>
                        }
                    </div>
                    {
                        loginState.current ?
                        <div className="Header-iconContainer">
                            <div>
                                <IoMdNotificationsOutline className="Header-icon" size={24} />
                                {props.notification !==0 &&
                                <div className="Header-notifiNumber">
                                    <div>{props.notification}</div>
                                </div>}
                                <div className="Header-notifiContainer">

                                </div>
                            </div>
                            <ThemeContext.Provider value={setProps}>
                                <div>
                                    <AiOutlineMessage className="Header-icon" size={24} onClick={() => handleSeeMessage()} />
                                    {props.message !==0 &&
                                    <div className="Header-notifiNumber">
                                        <div>{props.message}</div>
                                    </div>}
                                    <div className="Header-messageContainer" id="Header-messageContainer">
                                        <MessageContainerHeader onData={messages} />
                                    </div>
                                </div>
                                <div>
                                    <FiShoppingCart className="Header-icon" size={24} />
                                    {props.cart !==0 &&
                                    <div className="Header-notifiNumber">
                                        <div>{props.cart}</div>
                                    </div>}
                                </div>
                                <div>
                                    <Link className='nav-link' to='/profile/myProfile'><img className="Header-avatar" src="https://tse4.mm.bing.net/th?id=OIP.Dc9z4uo9fSeFHzKyRvimbQHaEK&pid=Api&P=0" alt="avatar" /></Link>
                                </div>
                            </ThemeContext.Provider>
                        </div>:<div></div>
                    }
                </ul>    
            </nav>
        </div>
    )
}

export default memo(Header);