import React, { memo } from 'react';
import './styles.css';

import ProductImgBox from './ProductImgBox';

const ProductImgBlock = ({index, onData, onImgStt, onDeleteImg}) => {
    // console.log('ProductImgBlock', index);
    return (
        <div className="ProductImgBlock">
            <div>
                <ProductImgBox index={index*4+0} onData={onData[0]} onImgStt={onImgStt} onDeleteImg={onDeleteImg} />
            </div>
            <div>
                <ProductImgBox index={index*4+1} onData={onData[1]} onImgStt={onImgStt} onDeleteImg={onDeleteImg} />
            </div>
            <div>
                <ProductImgBox index={index*4+2} onData={onData[2]} onImgStt={onImgStt} onDeleteImg={onDeleteImg} />
            </div>
            <div>
                <ProductImgBox index={index*4+3} onData={onData[3]} onImgStt={onImgStt} onDeleteImg={onDeleteImg} />
            </div>
        </div>
    )
}

export default memo(ProductImgBlock);