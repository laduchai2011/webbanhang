import React, { memo } from 'react';
import './styles.css';

import { USERINFOR } from '../../../../utils/Constant';

const ProductSearchBlock = ({setOptionSearch}) => {
    
    const handleSearch = () => {
        if (USERINFOR) {
            if (checkInput()) {
                setOptionSearch({
                    type: 'productWithOptions',
                    productType: document.getElementById('type').value,
                    productIndustry: document.getElementById('industry').value,
                    productPrice1 : Number(document.getElementById('price1').value),
                    productPrice2: Number(document.getElementById('price2').value),
                    productSale1: Number(document.getElementById('sale1').value),
                    productSale2: Number(document.getElementById('sale2').value)
                })
            }
        } else {
            alert('Bạn chưa đăng nhập');
        }
        
    }

    const checkInput = () => {
        const type = document.getElementById('type');
        if (type.value === 'null') {
            type.style.border = "3px solid red";
            alert('Hãy chọn kiểu');
            return false;
        }

        const industry = document.getElementById('industry');
        if (industry.value === 'null') {
            industry.style.border = "3px solid red";
            alert('Hãy chọn ngành');
            return false;
        }

        let inputId = ['price1', 'price2', 'sale1', 'sale2'];
        let getElementByIdArr = [];
        for (let i = 0; i < inputId.length; i++) {
            getElementByIdArr[i] = document.getElementById(`${inputId[i]}`);
        }

        // verify the inputs (null or not null)
        for (let i = 0; i < inputId.length; i++) {
            if (!(getElementByIdArr[i] && getElementByIdArr[i].value)) {
                getElementByIdArr[i].style.border = "3px solid red";
                return false;
            }

            if (isNaN(getElementByIdArr[i].value)) {
                alert('Hãy nhập 1 số');
                return false;
            }
        }

        return true;
    }

    const inputClick = (id) => {       
        document.getElementById(`${id}`).style.border = "1px solid black";
    }

    return (
        <div className="ProductSearchBlock">
            <div className='ProductSearchBlock-optionContainer'>
                <div>
                    <label htmlFor="type">Kiểu :</label>
                    <select name="type" id="type" onClick={() => inputClick("type")}>
                        <option value='null'>Trống</option>
                        <option value="consume">Tiêu dùng</option>
                        <option value="beautify">Làm đẹp</option>
                        <option value="technology">Công nghệ</option>
                        <option value="construct">Xây dựng</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="industry">Ngành :</label>
                    <select name="industry" id="industry" onClick={() => inputClick("industry")}>
                        <option value="null">Trống</option>
                        <option value="medical">Y tế</option>
                        <option value="education">Giáo dục</option>
                        <option value="technology">Công nghệ</option>
                        <option value="construct">Xây dựng</option>
                    </select>
                </div>
            </div>
            <div className='ProductSearchBlock-inputContainer'>
                <p>Giá:</p>
                <div className='ProductSearchBlock-input'>
                    <div>Từ :</div>
                    <input id='price1' placeholder='VND' onClick={() => inputClick('price1')} />
                </div>
                <div className='ProductSearchBlock-input'>
                    <div>Tới :</div>
                    <input id='price2' placeholder='VND' onClick={() => inputClick('price2')} />
                </div>
            </div>

            <div className='ProductSearchBlock-inputContainer'>
                <p>Khuyến mãi:</p>
                <div className='ProductSearchBlock-input'>
                    <div>Từ :</div>
                    <input id='sale1' placeholder='%' onClick={() => inputClick('sale1')} />
                </div>
                <div className='ProductSearchBlock-input'>
                    <div>Tới :</div>
                    <input id='sale2' placeholder='%' onClick={() => inputClick('sale2')} />
                </div>
            </div>
            <div>
                <button onClick={() => handleSearch()}>Tìm kiếm</button>
            </div>
        </div>
    )
}

export default memo(ProductSearchBlock);