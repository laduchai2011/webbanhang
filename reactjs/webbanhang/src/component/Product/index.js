import React, { useState, useRef, useEffect, useMemo } from 'react';
import './styles.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import Header from '../../utils/Header';
import ProductBlock from './detailComponents/ProductBlock';
import ProductInforBlock from './detailComponents/ProductInforBlock';
import ProductSearchBlock from './detailComponents/ProductSearchBlock';
import { SERVERADDRESS, TOKENENCODESTRING } from '../../utils/Constant/index';
import { Arr_1d_to_2d } from '../../utils/Common';


const Product = () => {
    const [data, setData] = useState([]);
    // const [textValue, setTextValue] = useState("");
    // const [preValue, setPreValue] = useState("");
    const pageIndex = useRef(1);
    const remainState = useRef(true);
    const [optionSearch, setOptionSearch] = useState({
        searching: false,
        type: 'product'
    });
    
    const pageSize = 20;
    const dataLen = useRef(pageSize);
    const token = window.localStorage.getItem('token webbanhang');

    // respinsive /* samsung galaxy A51/71: 412px*/
    const isSamsungGalaxy = useMediaQuery({
        query: '(max-width: 500px)'
    })

    const getProduct = async (pageIndex) => {
        if (dataLen.current === pageSize) {
            let url = '';
            if (optionSearch.type === 'product') {
                url = `${SERVERADDRESS}/product?type=${optionSearch.type}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
            } else if (optionSearch.type === 'productWithOptions'){
                url = `${SERVERADDRESS}/product?type=${optionSearch.type}&pageIndex=${pageIndex}&pageSize=${pageSize}&productType=${optionSearch.productType}&productIndustry=${optionSearch.productIndustry}&productPrice1=${optionSearch.productPrice1}&productPrice2=${optionSearch.productPrice2}&productSale1=${optionSearch.productSale1}&productSale2=${optionSearch.productSale2}`
            } else if (optionSearch.type === 'productWithSearch') {
                url = `${SERVERADDRESS}/product?type=${optionSearch.type}&pageIndex=${pageIndex}&pageSize=${pageSize}&productName=${optionSearch.productName}`;
            }

            try {
                const res = await axios({
                    method: 'get',
                    url: url,
                    headers: {
                        Authorization: `${TOKENENCODESTRING} ${token}`
                    }
                })
                if (res.data.state) {
                    dataLen = res.data.data.rowsAffected[1];
                    if (res.data.data.rowsAffected[1] < pageSize) {
                        remainState.current = false;
                    }
                    return res.data.data.recordset;
                } 
                return [];
            } catch (error) {
                console.error(error);
            }
        }
    }

    const getProductImage = async (Product_Id) => {
        try {
            const res = await axios({
                method: 'get',
                url: `${SERVERADDRESS}/product?type=productImage&productId=${Product_Id}`,
                headers: {
                    Authorization: `${TOKENENCODESTRING} ${token}`
                }
            })
            if (res.data.state) {
                return res.data.data.recordset;
            } 
            return [];
        } catch (error) {
            console.error(error);
        }
    }

    const getData = async (pageIndex) => {
        let productArr = await getProduct(pageIndex);
        let new_productArr = [];
        for (let i = 0; i < productArr.length; i++) {
            let imgArr = [];
            imgArr = await getProductImage(productArr[i].Product_Id);
            productArr[i].Product_Image = imgArr;
            new_productArr.push(productArr[i]);
        }
        const arr_2d = Arr_1d_to_2d(new_productArr, 4);
        setData(pre => pre.concat(arr_2d));
    }

    useEffect(() => {
        if (optionSearch.searching) {
            pageIndex.current = 1;
            setData([]);
            getData(pageIndex.current);
        }
         
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optionSearch])

    useMemo(() => {
        getData(pageIndex.current);  

        // load more
        window.onscroll = function() {
            const scrollable = window.innerHeight + document.documentElement.scrollTop - document.documentElement.offsetHeight;
            if((scrollable >= -500) && remainState.current) {
                pageIndex.current = pageIndex.current + 1; 
                getData(pageIndex.current);
            }
        } 

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const LoadMore = data.map((data1, index) => {
        return (
            <div key={index}>
                <ProductBlock props={data1} />
                <div>test</div>
            </div>
        )
    })
    
    const handleSearch = () => {
        setOptionSearch({
            searching: true,
            type: 'productWithSearch',
            productName: document.getElementById('search').value
        });
    }
   

    return (
        <div className="Product">
            <div className='headerProduct'>
                <Header />
            </div>
            <div className='bodyProduct'>
                {
                    !isSamsungGalaxy ?
                    <div className='searchContainer'>
                        <div>
                            <input className='input' id='search' placeholder='Tìm kiếm' />
                            <div onClick={() => handleSearch()}>Tìm kiếm</div>
                        </div>
                    </div>:<div></div>
                }
                <div className='productContainer'>
                    <div className='smartSearch'>
                        <div>
                            <h4>Tìm kiếm tùy chọn</h4>
                        </div>
                        <ProductSearchBlock setOptionSearch={setOptionSearch}/>
                        <div>
                            <button><Link className='nav-link' to='/product/addProduct'>Thêm sản phẩm</Link></button>
                        </div>
                    </div>
                    <div className='loadSearch'>
                    { LoadMore }
                    </div>
                    <div className='detailProduct'>
                        <ProductInforBlock />
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Product;