import React, { memo, useState, useMemo, useRef } from 'react';
import './styles.css';

import { AddressList } from '../../../../../utils/Common/AddressList.js';


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


const addressList = new AddressList();

const Address = ({setMyAddress}) => {
    const [ADDRESS_PROVINCE, set_ADDRESS_PROVINCE] = useState(['Chọn']);
    const [ADDRESS_District, set_ADDRESS_District] = useState(['Chọn']);
    const [ADDRESS_Commune, set_ADDRESS_Commune] = useState(['Chọn']);
    const [ADDRESS_Hamlet, set_ADDRESS_Hamlet] = useState(['Chọn']);
    const [ADDRESS_Home_Number, set_ADDRESS_Home_Number] = useState(['Chọn']);
    const [textAddress, setTextAddress] = useState('');
    const addressString = useRef('');
    const myAddress = useRef({});

    useMemo(() => {
        myAddress.current.Address_Id = '';
        addressList.getProvince(data => set_ADDRESS_PROVINCE(pre => pre.concat(data)));

        // stop complaining with comment:
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    
    const handleChangeSelect = (type) => {
        const condition = document.getElementById(type).value; 
        if (type !== 'homeNumber') {
            addressString.current = addressString.current + condition + '-';
        } else {
            addressString.current = addressString.current + condition + '.';
        }
        
        switch(type) {
            case 'province':
                myAddress.current.Address_Province = condition;
                addressList.getDistrict(condition, data => set_ADDRESS_District(pre => pre.concat(data)));
                break;

            case 'district':
                myAddress.current.Address_District = condition;
                addressList.getCommune(condition, data => set_ADDRESS_Commune(pre => pre.concat(data)));
                break;

            case 'commune':
                myAddress.current.Address_Commune = condition;
                addressList.getHamlet(condition, data => set_ADDRESS_Hamlet(pre => pre.concat(data)));
                break;

            case 'hamlet':
                myAddress.current.Address_Hamlet = condition;
                addressList.getHome_Number(condition, data => set_ADDRESS_Home_Number(pre => pre.concat(data)));
                break;

            case 'homeNumber':
                myAddress.current.Address_Home_Number = condition;
                setTextAddress(addressString.current);
                setMyAddress(myAddress.current);
                break;

            default:
                throw new Error('Invalid parameter');
        }
    }

    return (
        <div className="Address">
            <p>{'Địa chỉ: ' + textAddress}</p>
            <div>
                <label htmlFor="province">Tỉnh (Thành phố) :</label>
                <select name="province" id="province" onChange={() => handleChangeSelect('province')}>
                    {
                        ADDRESS_PROVINCE.map((data, index) => {
                            return (
                                <option key={index} value={data}>{data}</option>
                            )
                        })
                    }
                </select>
            </div>
            <div>
                <label htmlFor="district">Huyện (Quận) :</label>
                <select name="district" id="district" onChange={() => handleChangeSelect('district')}>
                    {
                        ADDRESS_District.map((data, index) => {
                            return (
                                <option key={index} value={data}>{data}</option>
                            )
                        })
                    }
                </select>
            </div>
            <div>
                <label htmlFor="commune">Xã (Phường) :</label>
                <select name="commune" id="commune" onChange={() => handleChangeSelect('commune')}>
                    {
                        ADDRESS_Commune.map((data, index) => {
                            return (
                                <option key={index} value={data}>{data}</option>
                            )
                        })
                    }
                </select>
            </div>
            <div>
                <label htmlFor="hamlet">Thôn (Xóm) :</label>
                <select name="hamlet" id="hamlet" onChange={() => handleChangeSelect('hamlet')}>
                    {
                        ADDRESS_Hamlet.map((data, index) => {
                            return (
                                <option key={index} value={data}>{data}</option>
                            )
                        })
                    }
                </select>
            </div>
            <div>
                <label htmlFor="homeNumber">Số nhà :</label>
                <select name="homeNumber" id="homeNumber" onChange={() => handleChangeSelect('homeNumber')}>
                    {
                        ADDRESS_Home_Number.map((data, index) => {
                            return (
                                <option key={index} value={data}>{data}</option>
                            )
                        })
                    }
                </select>
            </div>
        </div>
    )
}

export default memo(Address);