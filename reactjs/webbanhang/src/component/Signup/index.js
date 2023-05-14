import React, { useRef, useState } from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Header from '../../utils/Header';
import { SERVERADDRESS, UC_UserInfor_Account_Name, UC_UserInfor_Phone, UC_UserInfor_Email } from '../../utils/Constant';
import { MyError } from './MyError/index';
import { valid_Vietkey, valid_Capital, valid_SpecialChar, vali_Space } from '../../utils/Common';

/** 
*@typedef {
*User_Id: string,
*Account_Name: string,
*Password: string,
*Email: string,
*Phone: string,
*First_Name: string,
*Last_Name: string,
*Birthday: string,
*Sex: string
*} SignupOptions, // as: InformationOptions
*/

const Signup = () => {
    const [note, setNote] = useState();
    const checkMale = useRef('');
    const checkFemail = useRef('');
    const verifySuccess = useRef(true); // glo-variable to manager verify

    const oke_signup = () => {
        setNote('');
        let arr = ['accountName', 'password', 'rePassword', 'phone', 'email', 'firstName', 'lastName', 'birthday', 'male', 'female'];
        let querySelectorArr = [];
        for (let i = 0; i < arr.length; i++) {
            querySelectorArr[i] = document.getElementById(`${arr[i]}`);
        }

        // check password and rePassword
        if (querySelectorArr[1].value !== querySelectorArr[2].value) {
            setNote('Mật khẩu không trùng khớp');
            verifySuccess.current = false;
        } else {
            setNote('');
        }

        // verify the inputs (null or not null)
        for (let i = 0; i < arr.length; i++) {
            if (!(querySelectorArr[i] && querySelectorArr[i].value)) {
                querySelectorArr[i].style.border = "3px solid red";
                verifySuccess.current = false;
            }
        }

        if (verifySuccess.current) {
            let sex; // choosed-sex to send server. No need to be trict, because we check in below inputClick() function
            if (checkMale.current.length > 0) {
                sex = '1';
            } else {
                sex = '0';
            }

            let signupOptions = {
                Use_Id: '',
                Account_Name: querySelectorArr[0].value,
                Password: querySelectorArr[1].value,
                Phone: querySelectorArr[3].value,
                Email: querySelectorArr[4].value,
                First_Name: querySelectorArr[5].value,
                Last_Name: querySelectorArr[6].value,
                Birthday: querySelectorArr[7].value,
                Sex: sex
            };

            // send signupOptions to server via axios
            axios({
                method: 'post',
                url: `${SERVERADDRESS}/signup`,
                data: signupOptions
            }).then(res => { 
                // check duplicate infor
                if (!res.data.state) {
                    const signupErr = new MyError(res.data.err, signupOptions);
                    signupErr.errDuplicate(err => {
                        const arr_uc = [UC_UserInfor_Account_Name, UC_UserInfor_Phone, UC_UserInfor_Email];
                        const arr_s = ['Tài khoản', 'Số điện thoại', 'Email'];
                        const arr_id = ['accountName', 'phone', 'email'];
                        for (let i = 0; i < arr_uc.length; i++) {
                            if (err === arr_uc[i]) {
                                document.getElementById(`${arr_id[i]}`).style.border = "3px solid red";
                                setNote(`${arr_s[i]} đã được sử dụng`);
                            }
                        }
                    });
                } else {
                    setNote('Đăng ký thành công. Hãy đi đến đăng nhập.');
                    alert('Đăng ký thành công. Hãy đi đến đăng nhập.');
                }
                // console.log(res.data);
            }).catch(err => console.error(err));
        }
    }

    
    
    const inputClick = (id) => {       
        // only choose 1 in 2 (male or female)
        if (id === 'male') {
            if (checkMale.current.length === 0) {
                checkMale.current = document.getElementById('male').value;
            } else {
                checkMale.current = '';
            }
        } else if (id === 'female') {
            if (checkFemail.current.length === 0) {
                checkFemail.current = document.getElementById('female').value;
            } else {
                checkFemail.current = '';
            }
        } else {
            document.getElementById(`${id}`).style.border = "1px solid black";
        }  
        if ((checkMale.current.length > 0) && (checkFemail.current.length > 0)) {
            setNote('Bạn đang chọn cả 2 giới tính. Hãy chọn 1 giới tính.');
            verifySuccess.current = false;
        } else {
            setNote('');
            verifySuccess.current = true;
        }
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
        <div className="Signup">
            <Header />
            <div className='inforcontainer'>
                <div className='note'>
                    <p>{note}</p>
                </div>
                <div className='inputContainer'>
                    <input onClick={() => inputClick('accountName')} id='accountName' placeholder='tên tài khoản' maxLength={50} onChange={() => handleString('accountName')} />
                    <input onClick={() => inputClick('firstName')} id='firstName' placeholder='Họ' maxLength={20} onChange={() => handleString('firstName')}/>
                </div>
                <div className='inputContainer'>
                    <input onClick={() => inputClick('password')} id='password' placeholder='Mật khẩu' maxLength={50} onChange={() => handleString('password')} />
                    <input onClick={() => inputClick('lastName')} id='lastName' placeholder='Tên' maxLength={20} onChange={() => handleString('lastName')} />
                </div>
                <div className='inputContainer'>
                    <input onClick={() => inputClick('rePassword')} id='rePassword' placeholder='Nhập lại mật khẩu' maxLength={50} onChange={() => handleString('rePassword')} />
                    <input onClick={() => inputClick('email')} type='email' id='email' pattern=".+@globex\.com" maxLength={50} required placeholder='Email' onChange={() => handleString('email')} />
                </div>
                <div className='inputContainer'>
                    <label htmlFor="birthday">Sinh nhật:</label>
                    <input onClick={() => inputClick('birthday')} type="date" id='birthday' name="birthday" />
                    <input onClick={() => inputClick('phone')} type="tel" id='phone' name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required placeholder='SĐT' maxLength={15} onChange={() => handleString('phone')} />
                </div>
                <div className='inputContainer'>
                    <div>
                        <label htmlFor="male">Nam</label>
                        <input onClick={() => inputClick('male')} type="checkbox" id='male' name="male" value='male' />
                    </div>
                    <div>
                        <label htmlFor="female">Nữ</label>
                        <input onClick={() => inputClick('female')} type="checkbox" id="female" name="female" value='female' />
                    </div>
                </div>      
                <div className='btnContainer'>
                    <button onClick={()=> oke_signup()}>Đồng ý</button>
                    <button><Link className='nav-link' to='/login'>Hủy bỏ</Link></button>
                </div>
            </div>
        </div>
    )
}

export default Signup;