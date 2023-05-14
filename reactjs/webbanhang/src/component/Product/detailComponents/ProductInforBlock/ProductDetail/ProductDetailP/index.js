import React, { useState, useRef, memo } from 'react';
import './styles.css';

import { FiStar } from 'react-icons/fi';

const ProductDetailP = ({onData}) => {
    const [imgs, setImg] = useState(onData.Product_Image);
    const imgIndex = useRef(onData.Product_Image.length);
    const [startColor, setStartColor] = useState(['black', 'black', 'black', 'black', 'black']);

    let images = imgs.map((data, index) => {
        return (
            <div key={index}>
                <img src={data.ProductImage_URL} alt='ProductDetail_P'/>
            </div>
        )
    })

    const select1 = () => {
        imgIndex.current = 1;
        setImg([onData.Product_Image[0]])
    }

    const selectAll = () => {
        imgIndex.current = onData.Product_Image.length;
        setImg(onData.Product_Image);
    }

    const selectChange = (e) => {
        const value = e.target.value;
        if (isNaN(value)) {
            alert('Hãy điền vào 1 số');
        } else {
            if (Number(value) < onData.Product_Image.length) {
                imgIndex.current = Number(value);
                let imgArr = [];
                for (let i = 0; i < imgIndex.current; i++) {
                    imgArr.push(onData.Product_Image[i]);
                }
                setImg(imgArr);
            } else {
                imgIndex.current = onData.Product_Image.length;
                setImg(onData.Product_Image);
            }
        }
    }

    const haneleStart = (value) => {
        let arr = [];
        for(let i = 0; i < value; i++) {
            arr.push('yellow');
        }
        setStartColor(arr);
    }

    return (
        <div className="ProductDetailP">
            <h4>{onData.Product_Name}</h4>
            <div className='ProductDetailP-imgContainer'>
                <div>
                    <div>{`${imgIndex.current}/${onData.Product_Image.length}`}</div>
                    <input placeholder='Số lượng hình ảnh' onChange={(e) => selectChange(e)} />
                    <button onClick={() => select1()}>1</button>
                    <button onClick={() => selectAll()}>Tất cả</button>
                </div>
                {images}
            </div>
            <div>
                <div>Thông tin sản phẩm</div>
                <iframe className='ProductDetailP-infor' title='ProductDetailP-infor' src={onData.Product_Infor_URL}></iframe>
            </div>
            <div className='ProductDetailP-startContainer'>
                <div>Đánh giá</div>
                <div>
                    <FiStar className='ProductDetailP-startIcon' onClick={() => haneleStart(1)} color={startColor[0]} />
                    <FiStar className='ProductDetailP-startIcon' onClick={() => haneleStart(2)} color={startColor[1]} />
                    <FiStar className='ProductDetailP-startIcon' onClick={() => haneleStart(3)} color={startColor[2]} />
                    <FiStar className='ProductDetailP-startIcon' onClick={() => haneleStart(4)} color={startColor[3]} />
                    <FiStar className='ProductDetailP-startIcon' onClick={() => haneleStart(5)} color={startColor[4]} />
                </div>
            </div>
            <div>
                <div>Bình luận</div>
                <div>Sắp ra mắt</div>
            </div>
        </div>
    )
}

export default memo(ProductDetailP);