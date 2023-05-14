import axios from "axios";

import { SERVERADDRESS, TOKENENCODESTRING } from "../Constant";

// get user infor
export const setUserInfor = () => {
    if ((window.sessionStorage.getItem('userInfor') === null) && (window.localStorage.getItem('token webbanhang') !== null)) {
        const token = window.localStorage.getItem('token webbanhang');
        axios({
            method: 'get',
            url: `${SERVERADDRESS}/getUserInfor`,
            headers: {
                Authorization: `${TOKENENCODESTRING} ${token}`
            }
        }).then(res => {
            if (res.data.state) {
                window.sessionStorage.setItem('userInfor', JSON.stringify(res.data.data));
                window.location.reload();
            } else {
                console.log('get user infor failure');
            }
        }).catch(err => {
            console.error(err);
        })
    }
}

// get company infor
export const setCompanyInfor = () => {
    const token = window.localStorage.getItem('token webbanhang');
    axios({
        method: 'get',
        url: `${SERVERADDRESS}/companymyCompany`,
        headers: {
            Authorization: `${TOKENENCODESTRING} ${token}`
        }
    }).then(res => {
        // res.data.data.rowsAffected[0] > 0 is that company exist
        if (res.data.data.rowsAffected[0] > 0) {
            window.sessionStorage.setItem('companyInfor', JSON.stringify(res.data.data.recordset[0]));
        } else {
            console.log('get company infor failure');
        }
    }).catch(err => console.error(err));
}

// conver array 1d to 2
export const Arr_1d_to_2d = (arr_1d, column) => {
    let arr_2d = [];
    let m = 0;
    let arr = [];
    while(true) {
        arr = [];
        if (m < arr_1d.length) {
            for(let j = 0; j < column; j++) {
                if (m < arr_1d.length) {
                    arr.push(arr_1d[m]);
                    m++;
                }  
            }
            arr_2d.push(arr);
        } else {
            break;
        }
    }
    
    return arr_2d;
}

// handle number string
export const handleNumberString = (string) => {
    let count = 0;
    let s = '';
    for (let i = string.length; i > 0; i--) {
        if (count < 3) { 
            count++;
        } else {
            s = '.' + s;
            count = 1;
        }
        s = string[i-1] + s;
    }

    return s;
}

// string validation
export function valid_Vietkey(string) {
    const reunicode = /(á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ặ|ẵ|â|ấ|ầ|ẩ|ậ|ẫ|đ|é|è|ẻ|ẹ|ẽ|ê|ế|ề|ể|ệ|ễ|í|ì|ỉ|ị|ĩ|ú|ù|ủ|ụ|ũ|ư|ứ|ừ|ử|ự|ữ|ó|ò|ỏ|ọ|õ|ơ|ớ|ờ|ở|ợ|ỡ|ô|ố|ồ|ổ|ộ|ỗ|ý|ỳ|ỷ|ỵ|ỹ|Á|À|Ả|Ạ|Ã|Ă|Ắ|Ằ|Ẳ|Ặ|Ẵ|Â|Ấ|Ầ|Ẩ|Ậ|Ẫ|Đ|É|È|Ẻ|Ẹ|Ẽ|Ê|Ế|Ề|Ể|Ệ|Ễ|Í|Ì|Ỉ|Ị|Ĩ|Ú|Ù|Ủ|Ụ|Ũ|Ư|Ứ|Ừ|Ử|Ự|Ữ|Ó|Ò|Ỏ|Ọ|Õ|Ơ|Ớ|Ờ|Ở|Ợ|Ỡ|Ô|Ố|Ồ|Ổ|Ộ|Ỗ|Ý|Ỳ|Ỷ|Ỵ|Ỹ)/g;
    if (string.match(reunicode)) {
        return true;
    }
    return false;
}

export function valid_Capital(string) {
    const reunicode = /(Q|W|E|R|T|Y|U|I|O|P|A|S|D|F|G|H|J|K|L|Z|X|C|V|B|N|M)/g;
    if (string.match(reunicode)) {
        return true;
    }
    return false;
}

export function valid_SpecialChar(string) {
    let bool = false;
    const charString = '`~!@#$%^&*()_-=+:;<,.>?/|"';
    for (let i = 0; i < string.length; i++) {
        if(charString.indexOf(string[i]) === -1) {
            bool = false;
        } else {
            bool = true;
            return true;
        }
    }
    return bool;
    // var reunicode = /(`|~|!|@|#|$|%|^|&|*|(|)|_|-|=|+|:|;|'|"|\|||<|,|.|>|?|/|/)/g;  
}

export function vali_Space(string) {
    const reunicode = /( )/g;
    if (string.match(reunicode)) {
        return true;
    }
    return false;;
}
