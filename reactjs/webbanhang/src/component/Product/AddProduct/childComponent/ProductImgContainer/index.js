import React, { memo } from 'react';
import './styles.css';

import ProductImgBlock from './ProductImgBlock';

const ProductImgContainer = ({index, onData, onImgStt, onDeleteImg}) => {
    // console.log('ProductImgContainer', index)
    return (
        <div className="ProductImgContainer">
            <ProductImgBlock index={index} onData={onData} onImgStt={onImgStt} onDeleteImg={onDeleteImg}/>
        </div>
    )
}

export default memo(ProductImgContainer);