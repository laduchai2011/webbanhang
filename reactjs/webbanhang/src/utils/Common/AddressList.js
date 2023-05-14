import axios from "axios";
import { SERVERADDRESS } from "../Constant";

export class AddressList {
    constructor() {
        console.log('create AddressList successly')
    }

    getProvince(callback) {
        axios({
            method: 'get',
            url: `${SERVERADDRESS}/addressList?type=Province`,
        }).then(function (res) {
            let arr = [];
            for (let index = 0; index < res.data.data.recordset.length; index++) {
                arr.push(res.data.data.recordset[index].Province_Name);
            }
            callback(arr);
        }).catch(err => console.error(err));
    }

    getDistrict(condition, callback) {
        axios({
            method: 'get',
            url: `${SERVERADDRESS}/addressList?type=District&condition=${condition}`,
        }).then(function (res) {
            let arr = [];
            for (let index = 0; index < res.data.data.recordset.length; index++) {
                arr.push(res.data.data.recordset[index].District_Name);
            }
            callback(arr);
        }).catch(err => console.error(err));
    }

    getCommune(condition, callback) {
        axios({
            method: 'get',
            url: `${SERVERADDRESS}/addressList?type=Commune&condition=${condition}`,
        }).then(function (res) {
            let arr = [];
            for (let index = 0; index < res.data.data.recordset.length; index++) {
                arr.push(res.data.data.recordset[index].Commune_Name);
            }
            callback(arr);
        }).catch(err => console.error(err));
    }

    getHamlet(condition, callback) {
        axios({
            method: 'get',
            url: `${SERVERADDRESS}/addressList?type=Hamlet&condition=${condition}`,
        }).then(function (res) {
            let arr = [];
            for (let index = 0; index < res.data.data.recordset.length; index++) {
                arr.push(res.data.data.recordset[index].Hamlet_Name);
            }
            callback(arr);
        }).catch(err => console.error(err));
    }

    getHome_Number(condition, callback) {
        axios({
            method: 'get',
            url: `${SERVERADDRESS}/addressList?type=Home_Number&condition=${condition}`,
        }).then(function (res) {
            let arr = [];
            for (let index = 0; index < res.data.data.recordset.length; index++) {
                arr.push(res.data.data.recordset[index].Home_Number_Name);
            }
            callback(arr);
        }).catch(err => console.error(err));
    }
}