import React, { useMemo, useState, memo } from 'react';
import './styles.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// import { SERVERADDRESS, TOKENENCODESTRING } from '../../../utils/Constant';
import { SERVERADDRESS, TOKENENCODESTRING } from '../../../../../utils/Constant';
import ProductDetailP from './ProductDetailP';
import ProductDetailC from './ProductDetailC';
import ProductDetailPay from './ProductDetailPay';


const ProductDetail = () => {
    const { id } = useParams();
    const [pData, setPData] = useState(); 
    const [cData, setCData] = useState();

    const token = window.localStorage.getItem('token webbanhang');
    
    // const { state } = useLocation();
    // const { data } = state || {};

    const getP = () => {
        axios({
            method: 'get',
            url: `${SERVERADDRESS}/product?type=getProductDetail&productId=${id}`,
            headers: {
                Authorization: `${TOKENENCODESTRING} ${token}`
            }
        }).then(res => {
            if (res.data.state) {
                let dataP_1 = res.data.data[0].recordset[0];
                dataP_1.Product_Image = res.data.data[1].recordset;
                setPData(dataP_1);
                getC(dataP_1.Product_Company_Id);
                // console.log(dataP_1.Product_Company_Id)
            }
            // console.log(res.data.data[1].recordset)
        }).catch(err => console.error(err))
    }

    const getC = (product_Company_Id) => {
        axios({
            method: 'get',
            url: `${SERVERADDRESS}/company${product_Company_Id}`,
            headers: {
                Authorization: `${TOKENENCODESTRING} ${token}`
            }
        }).then(res => {
            if (res.data.state) {
                setCData(res.data.data.recordset[0]);

            }
        }).catch(err => console.error(err))
    }

    useMemo(() => {
        getP();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="ProductDetail">
            <div className='ProductDetail-column1'>
                <h3>Cửa hàng</h3>
                {cData && <ProductDetailC onData={cData} />}
            </div>
            <div className='ProductDetail-column2'>
                <h3>Sản phẩm</h3>
                {pData && <ProductDetailP onData={pData} />}
            </div>
            <div className='ProductDetail-column3'>
                <h3>Thanh toán</h3>
                {pData && <ProductDetailPay onData={pData} />}
            </div>
        </div>
    )
}

export default memo(ProductDetail);