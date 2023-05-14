import React, { useEffect, useState, useRef } from 'react';
import './styles.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Address from './components/Address';
import { addAddress } from '../../../utils/Common/Addess';
import { SERVERADDRESS, TOKENENCODESTRING } from '../../../utils/Constant';
import { setCompanyInfor } from '../../../utils/Common';

/** 
*@typedef {
*Company_Id: string,
*Company_Name: string,
*Company_BackgroudImage_URL: string,
*Company_Avatar_URL: string,
*Company_Infor_URL: string,
*Company_Describe_URL: string,
*Company_Tax_Code: string,
*Company_Star: number,
*Company_User_Id: string
*} AddCompanyOptions, // as: InformationOptions
*/

/**
*@typedef {
*Address_Id: string,
*Address_Province: string,
*Address_District: string,
*Address_Commune: string,
*Address_Hamlet: string,
*Address_Home_Number: string,
*Address_Company_User: bit,  --0: USER, 1: Company
*Address_User_Id: string, 
*Address_Company_Id: string
*} AddressOptions
*/


const SignupCompany = () => {
    const public_object = 'Company';

    const [avatar, setAvatar] = useState('');
    const [backGround, setBackGround] = useState('');
    const avatarFile = useRef();
    const backGroundFile = useRef(); 
    const avatarPath = useRef('');
    const backGroundPath = useRef('');
    const describePath = useRef('');
    const inforPath = useRef('');
    const [signupState, setSignupState] = useState(false);
    const [myAddress, setMyAddress] = useState({});


    const token = window.localStorage.getItem('token webbanhang');
    let userInfor = JSON.parse(window.sessionStorage.getItem('userInfor'));

    useEffect(() => {
        auto_addRows();
    }, [])

    const auto_addRows = () => {
        let textateaArr = ['textarea-des', 'textarea-infor']
        for (let i = 0; i < textateaArr.length; i++) {
            let textarea = document.getElementById(textateaArr[i]);
            let limit = 1000; //height limit
            textarea.oninput = function() {
                textarea.style.height = "";
                textarea.style.height = Math.min(textarea.scrollHeight, limit) + "px";
            };
        }
    }

    const hanleFile = (type, e) => {
        if (type === 'avatar') {
            setAvatar(URL.createObjectURL(e.target.files[0]));
            avatarFile.current = e.target.files[0];
        }
        if (type === 'backGround') {
            setBackGround(URL.createObjectURL(e.target.files[0]));
            backGroundFile.current = e.target.files[0];
        }
    }


    const handleSignhupCompany = async () => {
        if (checkInput()) {
            await uploadTxt('textarea-des');
            await uploadTxt('textarea-infor');
            await uploadImg('avatar', avatarFile.current);
            await uploadImg('backGround', backGroundFile.current);

            const companyName = document.getElementById('companyName').value;
            const taxCode = document.getElementById('taxCode').value;

            let addCompanyOptions = {
                Company_Id: '',
                Company_Name: companyName,
                Company_BackgroudImage_URL: backGroundPath.current,
                Company_Avatar_URL: avatarPath.current,
                Company_Infor_URL: inforPath.current,
                Company_Describe_URL: describePath.current,
                Company_Tax_Code: taxCode,
                Company_Star: 0,
                Company_User_Id: userInfor.User_Id
            }


            let company_Id;
            await signupCompany(addCompanyOptions, (Company_Id) => company_Id = Company_Id);

            let addressOptions = myAddress;
            addressOptions.Address_Company_User = 1;
            addressOptions.Address_User_Id = userInfor.User_Id;
            addressOptions.Address_Company_Id = company_Id;

            addAddress(addressOptions, () => {
                setCompanyInfor();
                setSignupState(true)
            });
        } 
    }

    const signupCompany = async (addCompanyOptions, callback) => {
        try {
            const res = await axios({
                method: 'post',
                url: `${SERVERADDRESS}/company/signupCompany`,
                headers: {
                    Authorization: `${TOKENENCODESTRING} ${token}`
                },
                data: addCompanyOptions
            })
            if (res.data.state) {
                callback(res.data.data.Company_Id);
            } else {
                alert('Tên công ty hoặc mã sô thuế bị trùng')
            }
        } catch (error) {
            console.error(error);
        }
    }

    const uploadImg = async (type, file) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await axios.post(
                `${SERVERADDRESS}/upload/photo?object=${public_object}`,
                formData,
                {
                    headers: {
                        Authorization: `${TOKENENCODESTRING} ${token}`
                    }
                }
            )

            // set path to store url to database
            if (type === 'avatar') {
                avatarPath.current = SERVERADDRESS + `/photo/${public_object}/` + res.data.path;
            }
            if (type === 'backGround') {
                backGroundPath.current = SERVERADDRESS + `/photo/${public_object}/` + res.data.path;
            }
        } catch (error) {
            console.error(error);
        }
    }

    const uploadTxt = async (type) => {
        try {
            const res = await axios({
                method: 'post',
                url: `${SERVERADDRESS}/upload/text?object=${public_object}`,
                headers: {
                    Authorization: `${TOKENENCODESTRING} ${token}`
                },
                data: {
                    userId: userInfor.User_Id,
                    data: document.getElementById(type).value,
                }
            });
            if (res.data.state) {
                if (type === 'textarea-des') {
                    describePath.current = SERVERADDRESS + `/text/${public_object}/` + res.data.data;
                }
                if (type === 'textarea-infor') {
                    inforPath.current = SERVERADDRESS + `/text/${public_object}/` + res.data.data;
                }
            } else {
                console.log('SignupCompany uploadTxt', res.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const checkInput = () => {
        let arr = ['companyName', 'taxCode', 'textarea-des', 'textarea-infor'];
        let getElementById = [];
        for (let i = 0; i < arr.length; i++) {
            getElementById[i] = document.getElementById(`${arr[i]}`);
        }


        // verify the inputs (null or not null)
        for (let i = 0; i < arr.length; i++) {
            if (!(getElementById[i] && getElementById[i].value)) {
                getElementById[i].style.border = "3px solid red";
                return false;
            }
        }

        return true;
    };

    const inputClick = (type) => {
        if ((type === 'companyName') || (type === 'taxCode')) {
            document.getElementById(type).style.border = "1px solid black";
        } else {
            document.getElementById(type).style.border = "0px solid rgba(63,63,63,1)";
        }
    };
    

    return (
        <div className="SignupCompany">
            {
                !signupState ? 
                <div>
                    <div>
                        <input placeholder='Tên công ty' id='companyName' onClick={() => inputClick('companyName')} />
                    </div>
                    <div>
                        <input placeholder='Mã số thuế' id='taxCode' onClick={() => inputClick('taxCode')} />
                    </div>
                    <div>
                        <p>Ảnh đại diện (có thể thêm sau)</p>
                        <input type='file' onChange={(e) => hanleFile('avatar', e)}/>
                        <img src={avatar} alt='Avatar_URL'/>
                    </div>
                    <div>
                        <p>Ảnh nền (có thể thêm sau)</p>
                        <input type='file' onChange={(e) => hanleFile('backGround', e)}/>
                        <img src={backGround} alt='Background_URL'/>
                    </div>
                    <div>
                        <p>Mô tả công ty (Tối đa 200 ký tự)</p>
                        <textarea className='signCompany-textarea' id='textarea-des' onClick={() => inputClick('textarea-des')} maxLength={200} />
                    </div>
                    <div>
                        <p>Thông tin chi tiết</p>
                        <textarea className='signCompany-textarea' id='textarea-infor' onClick={() => inputClick('textarea-infor')} />
                    </div>
                    <div>
                        <Address setMyAddress={setMyAddress}/>
                    </div>
                    <div>
                        <p></p>
                        
                    </div>
                    <div>
                        <button onClick={() => handleSignhupCompany()}>Đăng ký</button>
                    </div>
                </div>:
                <div>
                    <div>
                        <Link className='nav-link' to='/product/addProduct'>Thêm sản phẩm</Link>
                    </div>
                </div>
            }
            
            
        </div>
    )
}

export default SignupCompany;