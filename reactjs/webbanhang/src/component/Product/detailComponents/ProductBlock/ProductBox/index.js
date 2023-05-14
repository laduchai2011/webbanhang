import React, { memo } from 'react';
import './styles.css';
import  { FcLike } from 'react-icons/fc';

import { reduxStore } from '../../../../../utils/redux/index';
 
/** 
*@typedef {
*image: string,
*title: string,
*price: number,
*sales: number,
*like: number,
*amountOfSold: number
*} ProductBoxOptions, // as: InformationOptions
*/

/**
*@typedef {
*type: 'viewProduct-productBox-productInforBlock'
*index: number
*} detailView_action
*/

const ProductBox = ({props}) => {
    const productInfor = () => {
        let detailView_action = {
            type: 'viewProduct-productBox-productInforBlock', 
            data: props
        }
        reduxStore.dispatch(detailView_action);
    }
    return (
        <div className="ProductBox" onClick={() => productInfor()}>
            <div className='imgContainer-ProductBox'>
                {
                    props.Product_Sale > 0 ?
                    <div className='number-basic-infor-imgContainer-ProductBox'>{`${props.Product_Sale}%`}</div>:<></>
                }
                
                {props.Product_Image.length > 0 && (<img src={props.Product_Image[0].ProductImage_URL} alt='imgp'/>)} 
                <div className='describeContainer-imgContainer-ProductBox'>
                    <div>
                        <div>{props.Product_Title}</div>
                    </div>
                </div>          
            </div>
            
            <div className='basic-infor-Container-ProductBox'>
                <div>
                    <div>
                        <FcLike />
                        <div className='number-basic-infor-Container-ProductBox'>{`: ${props.Product_Like}`}</div>
                    </div>
                    <div>
                        <div>Bán</div>
                        <div className='number-basic-infor-Container-ProductBox'>{`: ${props.Product_AmountOfSold}`}</div>
                    </div>
                    <div>
                        <div>Giá</div>
                        <div className='number-basic-infor-Container-ProductBox'>{`: ${props.Product_Price}`}</div>
                    </div>
                </div>  
            </div>
        </div>
    )
}

export default memo(ProductBox);