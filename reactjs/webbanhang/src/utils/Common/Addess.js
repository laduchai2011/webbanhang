import axios from "axios";
import { SERVERADDRESS, TOKENENCODESTRING } from "../Constant";

/**
*@typedef {
*Address_Id: string,
*Address_Province: string,
*Address_District: string,
*Address_Commune: string,
*Address_Hamlet: string,
*Address_Home_Number: string,
*Address_Company_User: bit, --0: USER, 1: Company
*Address_User_Id: string, 
*Address_Company_Id: string
*} AddressOptions
*/

const token = window.localStorage.getItem('token webbanhang');
export const addAddress = (addressOptions, callback) => {
    axios({
        method: 'post',
        url: `${SERVERADDRESS}/address/addAdress`,
        headers: {
            Authorization: `${TOKENENCODESTRING} ${token}`
        },
        data: addressOptions
    }).then(res => {
        if (res.data.state) {
            callback();
        }
    }).catch(err => console.error(err));
}