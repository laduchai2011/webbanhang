import React, { useRef, useState } from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { SERVERADDRESS } from '../../utils/Constant';
import { valid_Vietkey, valid_Capital, valid_SpecialChar, vali_Space } from '../../utils/Common';
import { setCompanyInfor, setUserInfor } from '../../utils/Common';

/** 
*@typedef {
*Account_Name: string,
*Password: string,
*} LoginOptions
*/

const Login = () => {

    const [note, setNote] = useState();
    const verifySuccess = useRef(true); // glo-variable to manager verify
    const loginState = useRef(false);

    // check user login or not login
    let token = window.localStorage.getItem('token webbanhang');
    if (token !== null) {
        loginState.current = true;
    }

    const oke_login = () => {
        let arr_id = ['account', 'password'];
        let getElementByIdArr = [];
        for (let i = 0; i < arr_id.length; i++) {
            getElementByIdArr[i] = document.getElementById(`${arr_id[i]}`);
        }

        // verify the inputs (null or not null)
        for (let i = 0; i < arr_id.length; i++) {
            if (!(getElementByIdArr[i] && getElementByIdArr[i].value)) {
                getElementByIdArr[i].style.border = "3px solid red";
                verifySuccess.current = false;
            }
        }
        
        let loginOptions = {
            Account_Name: getElementByIdArr[0].value,
            Password: getElementByIdArr[1].value
        };

        // send login infor to server via axios
        axios({
            method: 'post',
            url: `${SERVERADDRESS}/login`,
            data: loginOptions
        }).then(res => { 
            // if login successly, save token here
            if (res.data.loginState) {
                window.localStorage.setItem('token webbanhang', res.data.token.tokenLogin);
                setCompanyInfor();
                setUserInfor();
                setNote('Đăng nhập thành công');
                loginState.current = true;
            } else {
                setNote('Tài khoản hoặc mật khẩu không chính xác');
            }
            
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            window.location.reload();
        })
    }
    
    const inputClick = (id) => {       
        document.getElementById(`${id}`).style.border = "1px solid black";
    }

    const handleString = (id) => {
        setNote('');
        verifySuccess.current = true;
        const value = document.getElementById(id).value;
        valid_Vietkey(value) && (verifySuccess.current = false);
        valid_Capital(value) && (verifySuccess.current = false);
        valid_SpecialChar(value) && (verifySuccess.current = false);
        vali_Space(value) && (verifySuccess.current = false);
        if (!verifySuccess.current) {
            document.getElementById(id).style.border = "4px solid red";
            setNote('Không sử dụng ký tự có dấu, chữ viết hoa, ký tự đặc biệt và khoảng trống');
        }
    }

    return (
        !loginState.current 
        ?
        <div className="Login">
            <div>  
                <input onClick={() => inputClick('account')} className='input' id='account' placeholder='tài khoản' onChange={() => handleString('account')} />
                <input onClick={() => inputClick('password')} className='input' id='password' placeholder='mật khẩu' onChange={() => handleString('password')} />
            </div>
            <div className='btnContainer'>
                <button onClick={() => oke_login()} className='btn btnLogin'>Đăng nhập</button>
                <button className='btn btnSignup'><Link className='nav-link' to='/signup'>Đăng ký</Link></button>
            </div>

            <div className='note'>
                <p>{note}</p>
                {
                    loginState.current ?
                    <Link to='/'>Đi tới trang chủ</Link>:<p></p>
                }
            </div>
        </div>
        :
        <Link to='/'>Đi tới trang chủ</Link>
    )
}

export default Login;