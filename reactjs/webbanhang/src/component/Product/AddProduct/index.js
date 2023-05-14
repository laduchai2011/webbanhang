import React, { useState, useRef, useCallback, useEffect } from 'react';
import './styles.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FcAddImage } from 'react-icons/fc';

import { SERVERADDRESS, TOKENENCODESTRING } from '../../../utils/Constant';
import ProductImgContainer from './childComponent/ProductImgContainer';

import { Arr_1d_to_2d } from '../../../utils/Common';


/**
*@typedef {
*Product_Id: string,
*Product_Type: string,
*Product_Industry: string,
*Product_Name: string,
*Product_Title: string,
*Product_Hastag: string,
*Product_Infor_URL: string,
*Product_Describe_URL: string,
*Product_Price: float,
*Product_VAT: float,
*Product_Like: int,
*Product_Sale: float,
*Product_AmountOfSold: int,
*Product_Amount: int,
*Product_User_Id: string,
*Product_Company_Id: string
*} ProductOptions
*/

/**
*@typedef {
*ProductImage_Id: string,
*ProductImage_URL: string,
*ProductImage_Product_Id: string
*} ProductImageOptions
*/


const AddProduct = () => {
    const public_object = 'Product';
    // console.log('AddProduct');
    // init
    const loginState = useRef(false);
    const companyState = useRef(false);
    const token = window.localStorage.getItem('token webbanhang');

    // add product part
    const productImgs_1d = useRef([]);          // this files is to send to server
    const [productImgsURL, setProductImgsURL] = useState([]); // this data is to display (array-2d)             productImgsURL
    const productImgsURL_1d = useRef([]);       // array-1d to save data, then convert to array-2d to save into productImgsURL above
    const productImgPaths = useRef([]);        // this is image path array-1d to store into database
    const imgStt = useRef(0);          // stt of images display on screen, is used to delete images via useCallback
    const describePath = useRef('');   // fileName of describe part
    const inforPath = useRef('');      // fileName of infor part
    const VAT = useRef(0);
    const [total, setTotal] = useState();
    const [note, setNote] = useState('');

    let userInfor = JSON.parse(window.sessionStorage.getItem('userInfor'));
    let companyInfor = JSON.parse(window.sessionStorage.getItem('companyInfor'));


    useEffect(() => {
        // auto_addRows();

        return () => {
            //delete all Image URL (add product part)
            for (let i = 0; i < productImgsURL_1d.current.length; i++) {
                URL.revokeObjectURL(productImgsURL_1d.current[i]);
            }
        }

        // stop complaining with comment:
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // const auto_addRows = () => {
    //     let textateaArr = ['textarea-des', 'textarea-infor']
    //     for (let i = 0; i < textateaArr.length; i++) {
    //         let textarea = document.getElementById(textateaArr[i]);
    //         let limit = 1000; //height limit
    //         textarea.oninput = function() {
    //             textarea.style.height = "";
    //             textarea.style.height = Math.min(textarea.scrollHeight, limit) + "px";
    //         };
    //     }
    // }

    // check login or not
    if (token !== null) {
        loginState.current = true;
    } else {
        loginState.current = false;
    }

    // check company login or not
    if (companyInfor !== null) {
        companyState.current = true;
    } else {
        companyState.current = false;
    }

    // check login or not
    if (token !== null) {
        loginState.current = true;
    } else {
        loginState.current = false;
    }

    /** ----------------------code addProduct part------------------------ */
    const SelectImage = (e) => {
        for(let i = 0; i < e.target.files.length; i++) {
            productImgsURL_1d.current = productImgsURL_1d.current.concat([URL.createObjectURL(e.target.files[i])]);
            productImgs_1d.current = productImgs_1d.current.concat(e.target.files[i]);
        }

        changeImgsURLList(productImgsURL_1d.current);
    }

    const changeImgsURLList = (arr) => {
        let arr_2d = Arr_1d_to_2d(arr, 4);
        setProductImgsURL(arr_2d); // array 2d to diplay image list
    }

    const handleDeleteImg = useCallback(() => {
        // delete image
        URL.revokeObjectURL(productImgsURL_1d.current[imgStt.current]);
        productImgsURL_1d.current.splice(imgStt.current, 1);
        changeImgsURLList(productImgsURL_1d.current);

        productImgs_1d.current.splice(imgStt.current, 1);
    }, [])
    
    const checkInput = () => {
        let arr = ['productName', 'title', 'hastag', 'textarea-des', 'textarea-infor', 'amount', 'price', 'sale'];
        let getElementById = [];
        for (let i = 0; i < arr.length; i++) {
            getElementById[i] = document.getElementById(`${arr[i]}`);
        }

        // verify the inputs (null or not null)
        for (let i = 0; i < arr.length; i++) {
            if (!(getElementById[i] && getElementById[i].value)) {
                getElementById[i].style.border = "3px solid red";
                return false;
            } 
        }

        if (productImgs_1d.current.length < 1) {
            setNote('Bạn chưa có hình ảnh sản phẩm');
            return false;
        }

        if (!checkisNaNNumber()) {
            return false
        }

        return true;
    };

    // check 'amount', 'price', 'sale' is number or string
    const checkisNaNNumber = () => {
        let arr1 = ['amount', 'price', 'sale']
        for (let i = 0; i < arr1.length; i++) {
            if(isNaN(Number(document.getElementById(arr1[i]).value))) {
                document.getElementById('animateTxt').style.display = 'flex';
                document.getElementById(arr1[i]).style.border = "3px solid red";
                return false;
            } 
            document.getElementById('animateTxt').style.display = 'none';
            document.getElementById(arr1[i]).style.border = "1px solid black";
        }
        
        return true;
    }

    const inputClick = (type) => {
        if ((type === 'textarea-des') || (type === 'textarea-infor')) {
            document.getElementById(type).style.border = "0px solid rgba(63,63,63,1)";
        } else {
            document.getElementById(type).style.border = "1px solid black";
        }
    };

    // upload texts and images to server, then send data to database (image URLs is save in other table, after save common infor in database )
    const handleAddProduct = async () => {
        // type: ['productName', 'title', 'hastag', 'textarea-des', 'textarea-infor'], oncly 'textarea-des' and 'textarea-infor' id save to file.txt, the other is save directly to datavase
        if(checkInput()) {
            // upload tex and image
            for (let i = 0; i < productImgs_1d.current.length; i++) {
                await uploadImg(productImgs_1d.current[i]);
            }
            await uploadTxt('textarea-des');
            await uploadTxt('textarea-infor');
            
            // begin save into database
            // save common infor
            const productOptions = {
                Product_Id: '',
                Product_Type: document.getElementById('type').value,
                Product_Industry: document.getElementById('industry').value,
                Product_Name: document.getElementById('productName').value,
                Product_Title: document.getElementById('title').value,
                Product_Hastag: document.getElementById('hastag').value,
                Product_Infor_URL: inforPath.current,
                Product_Describe_URL: describePath.current,
                Product_Price: Number(document.getElementById('price').value),
                Product_VAT: VAT.current,
                Product_Like: 0,
                Product_Sale: Number(document.getElementById('sale').value),
                Product_AmountOfSold: 0,
                Product_Amount: Number(document.getElementById('amount').value),
                Product_User_Id: userInfor.User_Id,
                Product_Company_Id: companyInfor.Company_Id
            }
            const Product_Id = await storeProduct(productOptions);

            for (let i = 0; i < productImgPaths.current.length; i++) {
                const productImageOptions = {
                    ProductImage_Id: '',
                    ProductImage_URL: productImgPaths.current[i],
                    ProductImage_Product_Id: Product_Id
                }
                await storeProductImage(productImageOptions);
            }

            // set array again
            productImgPaths.current = [];

            alert('Thêm sản phẩm thành công');
        }
        

    }

    const storeProduct = async (productOptions) => {
        try {
            const res = await axios({
                method: 'post',
                url: `${SERVERADDRESS}/product?type=product`,
                headers: {
                    Authorization: `Bearer ${token}`
                }, 
                data: productOptions
            })
            return res.data.data.Product_Id;
        } catch (error) {
            console.error(error);
            return;
        }
    }

    const storeProductImage = async (productImageOptions) => {
        try {
            await axios({
                method: 'post',
                url: `${SERVERADDRESS}/product?type=productImage`,
                headers: {
                    Authorization: `Bearer ${token}`
                }, 
                data: productImageOptions
            })
        } catch (error) {
            console.error(error);
        }
    }

    const uploadImg = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await axios.post(
                `${SERVERADDRESS}/upload/photo?object=${public_object}`,
                formData,
                {
                    headers: {
                        Authorization: `${TOKENENCODESTRING} ${token}`
                    }
                }
            )

            // set path to store url to database
            productImgPaths.current = productImgPaths.current.concat([SERVERADDRESS + `/photo/${public_object}/` + res.data.path]);
        } catch (error) {
            console.error(error);
        }
    }

    const uploadTxt = async (type) => {
        try {
            const res = await axios({
                method: 'post',
                url: `${SERVERADDRESS}/upload/text?object=${public_object}`,
                headers: {
                    Authorization: `${TOKENENCODESTRING} ${token}`
                },
                data: {
                    userId: userInfor.User_Id,
                    data: document.getElementById(type).value,
                }
            });
            if (res.data.state) {
                if (type === 'textarea-des') {
                    describePath.current = SERVERADDRESS + `/text/${public_object}/` + res.data.data;
                }
                if (type === 'textarea-infor') {
                    inforPath.current = SERVERADDRESS + `/text/${public_object}/` + res.data.data;
                }
                // console.log(SERVERADDRESS)
                // console.log(describePath.current)
                // console.log(inforPath.current)
            } else {
                console.log('AddProduct uploadTxt', res.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handlePrice = () => {
        if (checkisNaNNumber()) {
            const price = Number(document.getElementById('price').value);
            const sales = Number(document.getElementById('sale').value);
            const amount = Number(document.getElementById('amount').value);

            VAT.current = (price - price*(sales/100))*(10/100);

            setTotal((price - price*(sales/100) + VAT.current)*amount);
        }
    }

    const imgs = productImgsURL.map((data, index) => {
        return (
            <div key={ index }>
                <ProductImgContainer index={index} onData={data} onImgStt={imgStt} onDeleteImg={handleDeleteImg}/>
            </div>
        )
    })

    return (
        <div className="AddProduct">
            {
                loginState.current ? 
                <div>
                    {
                        companyState.current ? 

                        // main componets for add product in here
                        <div>
                            <div className='AddProduct-container'>
                                <input placeholder='Tên sản phẩm' id='productName' onClick={() => inputClick('productName')} />
                            </div>
                            <div className='AddProduct-container'>
                                <input placeholder='Tiêu đề' id='title' onClick={() => inputClick('title')} />
                            </div>
                            <div className='AddProduct-container'>
                                <input placeholder='Hastag' id='hastag' onClick={() => inputClick('hastag')} />
                            </div>
                            <div className='AddProduct-container'>
                                <label htmlFor="type">Kiểu :</label>
                                <select name="type" id="type">
                                    <option value="null">Trống</option>
                                    <option value="consume">Tiêu dùng</option>
                                    <option value="beautify">Làm đẹp</option>
                                    <option value="technology">Công nghệ</option>
                                    <option value="construct">Xây dựng</option>
                                </select>
                            </div>
                            <div className='AddProduct-container'>
                                <label htmlFor="industry">Ngành :</label>
                                <select name="industry" id="industry">
                                    <option value="null">Trống</option>
                                    <option value="medical">Y tế</option>
                                    <option value="education">Giáo dục</option>
                                    <option value="technology">Công nghệ</option>
                                    <option value="construct">Xây dựng</option>
                                </select>
                            </div>
                            <div className='AddProduct-container'>
                                <p>Thêm hình ảnh</p>
                                <label htmlFor='inputImg'><FcAddImage  size={50} /></label>
                                <input id='inputImg' type='file' hidden="hidden" multiple onChange={(e) => SelectImage(e)} />
                                { imgs }
                            </div>
                            <div className='AddProduct-container'>
                                <p>Mô tả sản phẩm (Tối đa 200 ký tự)</p>
                                <textarea className='addProduct-textarea' id='textarea-des' onClick={() => inputClick('textarea-des')} maxLength={200} />
                            </div>
                            <div className='AddProduct-container'>
                                <p>Thông tin sản phẩm</p>
                                <textarea className='addProduct-textarea' id='textarea-infor' onClick={() => inputClick('textarea-infor')} />
                            </div>
                            <div className='AddProduct-container AddProduct-container-amount-price-sale-VAT'>
                                <div>
                                    <input placeholder='Số lượng' id='amount' onClick={() => inputClick('amount')} onChange={() => handlePrice()} />
                                    <div id='animateTxt' className='AddProduct-container-amount-price-sale-VAT-note'>Phải là 1 sô</div>
                                </div>
                            </div>
                            <div className='AddProduct-container AddProduct-container-amount-price-sale-VAT'>
                                <div>
                                    <input placeholder='Giá' id='price' onClick={() => inputClick('price')} onChange={() => handlePrice()} />
                                    <div id='animateTxt' className='AddProduct-container-amount-price-sale-VAT-note'>Phải là 1 sô</div>
                                </div>
                            </div>
                            <div className='AddProduct-container AddProduct-container-amount-price-sale-VAT'>
                                <div>
                                    <input placeholder='Khuyến mãi' id='sale' onClick={() => inputClick('sale')} onChange={() => handlePrice()} />
                                    <div>%</div>
                                    <div id='animateTxt' className='AddProduct-container-amount-price-sale-VAT-note'>Phải là 1 sô</div>
                                </div>
                            </div>
                            <div className='AddProduct-container AddProduct-container-amount-price-sale-VAT'>
                                <div>
                                    <div>VAT ( 10% ) : </div>
                                    <div>{VAT.current}</div>
                                </div>
                            </div>
                            <div className='AddProduct-container AddProduct-container-amount-price-sale-VAT'>
                                <div>
                                    <div>Tổng : </div>
                                    <div>{total}</div>
                                </div>
                            </div>
                            <div>
                                <button onClick={() => handleAddProduct()}>Thêm</button>
                            </div>
                            <div>
                                <p>{note}</p>
                            </div>
                        </div>
                        // ----------------------------------------

                        :<div>
                            <Link className='nav-link' to='/company/signupCompany'>Bạn chưa có công ty</Link>
                        </div>
                    }
                </div>:
                <div>
                    <Link className='nav-link' to='/login'>Bạn chưa đăng nhập</Link>
                </div>
            }
        </div>
    )
}

export default AddProduct;