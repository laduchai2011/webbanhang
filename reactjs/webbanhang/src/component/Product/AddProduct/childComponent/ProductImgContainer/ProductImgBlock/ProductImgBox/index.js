import React, { memo } from 'react';
import './styles.css';
import { TiDelete } from 'react-icons/ti';

const ProductImgBox = ({index, onData, onImgStt, onDeleteImg}) => {
    const handleProductImgBoxDelete = () => {
        onImgStt.current = index;
        onDeleteImg();
    }

    // console.log('ProductImgBox', index)

    return (
        onData &&
        <div className="ProductImgBox">
            <img src={onData} alt='ProductImgBox'/>
            <div className='ProductImgBox-Delete'>
                <TiDelete size={25} color='red' onClick={() => handleProductImgBoxDelete()} />
            </div>
        </div>
    )
}

export default memo(ProductImgBox);