import React, { memo, useState, useRef, useMemo } from 'react';
import './styles.css';

import { BiLike } from 'react-icons/bi';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { reduxStore } from '../../../../utils/redux';
import { handleNumberString } from '../../../../utils/Common';
import { SERVERADDRESS, TOKENENCODESTRING, USERINFOR } from '../../../../utils/Constant';



/**
*@typedef {
*ProductLike_Id?: string,
*User_Id: string,
*Product_Id: string
*} ProductLikeOptions
*/

/**
*@typedef {
*Cart_Id: string,
*Cart_Product_Id: string,
*Cart_User_Id: string,
*Cart_Type: string
*} CartOptions
*/
    


const ProductInforBlock = () => {
    const [data, setData] = useState();
    const [total, setTotal] = useState(0);
    const VAT = useRef(0);
    const [imgIndex, setImgIndex] = useState(0);
    const [like, setLike] = useState(false);

    const navigate = useNavigate();
    const token = window.localStorage.getItem('token webbanhang');
    let userInfor = JSON.parse(window.sessionStorage.getItem('userInfor'));

    // const clickme = () => {
    //     axios({
    //         method: 'get',
    //         url: 'http://localhost:4000/text/Company/0a89d3d9-f55c-4147-8e3b-ee9c8d588e53-Mon%20Apr%2024%202023-aeda5465-407c-4621-8876-2b4260fd6a14.txt',

    //     }).then(function (res) {
    //         console.log(res.data)
            
    //     });
    // }

    useMemo(() => {
        reduxStore.subscribe(() => {
            // console.log(reduxStore.getState());
            if (reduxStore.getState().type === 'viewProduct-productBox-productInforBlock') {
                setImgIndex(0);
                setData(reduxStore.getState().data);

                let token = window.localStorage.getItem('token webbanhang');
                if (token !== null) {
                    getLike(userInfor.User_Id, reduxStore.getState().data.Product_Id, product_LikeState => {
                        setLike(product_LikeState);
                    });
                }
            }  
        });

        // stop complaining with comment:
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleAmount = (e) => {
        const price = data.Product_Price;
        const sale = data.Product_Sale;
        if (isNaN(e.target.value)) {
            alert('Số lượng phải là chữ sô');
        } else {
            const price_1 = price - price*(sale/100);
            const vat = price_1*(10/100)*Number(e.target.value);
            VAT.current = handleNumberString(`${vat}`);
            const total_1 = (price_1 + vat)*Number(e.target.value);
            setTotal(handleNumberString(`${total_1}`));
        }
    }

    const hanleImg = (condition) => {
        if ((condition === 'f') && (imgIndex < (data.Product_Image.length-1))) {
            setImgIndex(x => x + 1);
        }
        if ((condition === 'b') && (imgIndex > 0)) {
            setImgIndex(x => x - 1);
        }
    }

    // hanle to like product here
    const getLike = (userId, productId, callback) => {
        let product_LikeState = false;
        axios({ 
            method: 'get',
            url: `${SERVERADDRESS}/product?type=getProductLike&userId=${userId}&productId=${productId}`,
            headers: {
                Authorization: `${TOKENENCODESTRING} ${token}`
            }
        }).then(function (res) {
            if (res.data.data.recordset.length > 0) {
                product_LikeState = true;
            } else {
                product_LikeState = false;
            }
            callback(product_LikeState);
        }).catch(err => console.error(err));
    } 

    const haneleLike = () => {
        if (USERINFOR) {
            if (like) {
                let productLikeOptions = {
                    User_Id: userInfor.User_Id,
                    Product_Id: data.Product_Id
                }
                axios({ 
                    method: 'post',
                    url: `${SERVERADDRESS}/product?type=disLikeProduct`,
                    headers: {
                        Authorization: `${TOKENENCODESTRING} ${token}`
                    }, 
                    data: productLikeOptions
                }).then(function (res) {
                    if (res.data.state) {
                        setLike(false);
                    }
                }).catch(err => console.error(err));
            } else {
                let productLikeOptions = {
                    ProductLike_Id: '',
                    User_Id: userInfor.User_Id,
                    Product_Id: data.Product_Id
                }
                axios({ 
                    method: 'post',
                    url: `${SERVERADDRESS}/product?type=likeProduct`,
                    headers: {
                        Authorization: `${TOKENENCODESTRING} ${token}`
                    }, 
                    data: productLikeOptions
                }).then(function (res) {
                    if (res.data.state) {
                        setLike(true);
                    }
                }).catch(err => console.error(err));
            }
        } else {
            alert('Bạn chưa đăng nhập');
        }
        
    }

    const detailView = () => {
        navigate(`/product/productDetail/${data.Product_Id}`, { state: {data: data}});
    }

    const addCart = () => {
        let cartOptions = {
            Cart_Id: '',
            Cart_Product_Id: data.Product_Id,
            Cart_User_Id: userInfor.User_Id,
            Cart_Type: 'cart'
        }

        axios({
            method: 'post',
            url: `${SERVERADDRESS}/cart?type=addCart`,
            headers: {
                Authorization: `Bearer ${token}`
            }, 
            data: cartOptions
        }).then(res => {
            if (res.data.state) {
                reduxStore.dispatch({type: 'addCart', data: {}});
            }
        }).catch(err => console.error(err));
    }

    return (
        data && 
        <div className="ProductInforBlock">
            <div>
                <div>
                    <h3>{data.Product_Name}</h3>
                </div>
                <iframe className='ProductInforBlock-pre ProductInforBlock-pre-des' title='Product_Describe_URL' src={data.Product_Describe_URL}></iframe>
                <div className='ProductInforBlock-img'>
                    <div className='ProductInforBlock-imgContainer'>
                        <img src={data.Product_Image[imgIndex].ProductImage_URL} alt='img'/>
                    </div>
                    <div className='ProductInforBlock-amount'>
                        <div>{`${imgIndex + 1}/${data.Product_Image.length}`}</div>
                        <div onClick={() => hanleImg('b')}>Quay lại</div>
                        <div onClick={() => hanleImg('f')}>Tiếp</div>
                    </div>
                </div>
                <div className='ProductInforBlock-amount'>
                    <div>
                        <BiLike color={like ? 'blue':'black'} title='ewrwet' size='18' onClick={() => haneleLike()} />
                        <div>{`: ${data.Product_Like}`}</div>
                    </div>
                    <div>
                        <div>Đã bán</div>
                        <div>{`: ${data.Product_AmountOfSold}`}</div>
                    </div>
                    <div>
                        <div>Còn</div>
                        <div>{`: ${data.Product_Amount}`}</div>
                    </div>
                </div>  
                <p>Thông tin chi tiết</p>
                <iframe className='ProductInforBlock-pre' title='Product_Infor_URL' src={data.Product_Infor_URL}></iframe>
                <div className='ProductInforBlock-productOptions'>
                    <div>
                        <div>Số lượng</div>
                        <input type='text' onChange={(e) => handleAmount(e)}/>
                    </div>
                    <div>
                        <div>Giá</div>
                        <div>{`: ${handleNumberString(data.Product_Price.toString())}`}</div>
                    </div>
                    <div>
                        <div>Khuyến mãi</div>
                        <div>{`: ${data.Product_Sale} %`}</div>
                    </div>
                    <div>
                        <div>VAT (10%)</div>
                        <div>{`: ${VAT.current}`}</div>
                    </div>
                    <div>
                        <div>Tổng</div>
                        <div>{`: ${total}`}</div>
                    </div>
                </div>
                {
                    USERINFOR ?
                    <div className='ProductInforBlock-btn'>
                        <div>
                            <button onClick={() => detailView()}>Đặt hàng</button>
                            <button onClick={() => addCart()}>Thêm vào giỏ hàng</button>
                            <button onClick={() => detailView()}>Chi tiết</button>
                        </div>
                    </div>:
                    <div className='ProductInforBlock-btn'>
                        <div>
                            <button onClick={() => detailView()}>Chi tiết</button>
                        </div>
                    </div>
                }
                
            </div>
        </div>
    )
}

export default memo(ProductInforBlock);