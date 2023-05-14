import React, { memo, useState, useRef } from 'react';
import './styles.css';

import QRCode from "react-qr-code";

import { handleNumberString } from '../../../../../../utils/Common';


const carry = 10000;
const ProductDetailPay = ({onData}) => {
    const [text, setText] = useState();
    const payState = useRef('cash');
    const sale = useRef(0);
    const vat = useRef(0);
    const [total, setTotal] = useState(0);
    const totalAll = useRef(0);
    const [order, setOrder] = useState(false);

    const handlePayType = (id) => {
        const type = document.getElementById(id).value;
        switch(type) {
            case 'cash':
                payState.current = 'cash';
                setText('Bạn đã chọn thanh toán tiền mặt');
                break;
            case 'transfer':
                payState.current = 'transfer';
                setText('Bạn đã chọn thanh toán chuyển khoản');
                break;
            case 'QRcode':
                payState.current = 'QRcode';
                setText('Bạn đã chọn thanh toán quét mã QR');
                break;

            default:
                new Error('Invalid parameter')
        }
    }

    const handleMoney = (e) => {
        const amount = e.target.value;
        if (isNaN(amount)) {
            alert('Bạn phải nhập số');
        } else {
            const price_1 = onData.Product_Price*Number(amount);
            const sale_1 = price_1*(onData.Product_Sale/100);
            const vat_1 = (price_1 - sale_1)*(10/100);
            sale.current = handleNumberString(sale_1.toString());
            vat.current = handleNumberString(vat_1.toString());
            totalAll.current = price_1 -sale_1 + vat_1 + carry;
            setTotal(handleNumberString((price_1 - sale_1 + vat_1).toString()));
        }
    }

    return (
        <div className="ProductDetailPay">
            <div>
                <label htmlFor="payments">Hình thức thanh toán:</label>
                <select name="payments" id="payments" onChange={() => handlePayType('payments')}>
                    <option value='cash'>Tiền mặt</option>
                    <option value='transfer'>Chuyển khoản</option>
                    <option value='QRcode'>Quét mã QR</option>
                </select>
            </div>
            <div>{text}</div>
            <div className="ProductDetailPay-orderInfor">
                <div>
                    <div>Giá</div>
                    <div className='ProductDetailPay-orderInfor-number'>
                        <div>{handleNumberString(onData.Product_Price.toString())}</div>
                        <div>VND</div>
                    </div>
                </div>
                <div>
                    <div>{`Khuyến mãi (${onData.Product_Sale} %)`}</div>
                    <div className='ProductDetailPay-orderInfor-number'>
                        <div>{sale.current}</div>
                        <div>VND</div>
                    </div>
                </div>
                <div>
                    <div>Thuế (VAT 10%)</div>
                    <div className='ProductDetailPay-orderInfor-number'>
                        <div>{vat.current}</div>
                        <div>VND</div>
                    </div>
                </div>
                <div>
                    <div>Số lượng</div>
                    <div className='ProductDetailPay-orderInfor-number'>
                        <input onChange={(e) => handleMoney(e)} />
                        <div>chiếc/cái</div>
                    </div>
                </div>
                <div className='ProductDetailPay-orderInfor-number-total'>
                    <div>Tổng</div>
                    <div className='ProductDetailPay-orderInfor-number'>
                        <div>{total}</div>
                        <div>VND</div>
                    </div>
                </div>
                <div className='ProductDetailPay-orderInfor-number-total'>
                    <div>Chi phi vận chuyển</div>
                    <div className='ProductDetailPay-orderInfor-number'>
                        <div>{handleNumberString(carry.toString())}</div>
                        <div>VND</div>
                    </div>
                </div>
                <div className='ProductDetailPay-orderInfor-number-total'>
                    <div>Thành tiền</div>
                    <div className='ProductDetailPay-orderInfor-number'>
                        <div>{handleNumberString(totalAll.current.toString())}</div>
                        <div>VND</div>
                    </div>
                </div>
            </div>
            {
                order===false ?
                <div>
                    <button onClick={() => setOrder(true)}>Đặt hàng</button>
                </div>:
                <div className="ProductDetailPay-payInfor">
                    <div>Bạn đã đặt hàng thành công, vui lòng thanh thoán</div>
                    {payState.current==='cash' && <div>Thanh toán tiền mặt khi nhận hàng</div>}
                    {payState.current==='transfer' && <div>Chuyển khoản vào stk: 544454545</div>}
                    {payState.current==='QRcode' && 
                        <div>
                            <div>Quét mã QR để thanh toán</div>
                            <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
                                <QRCode
                                    size={256}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    viewBox={`0 0 256 256`}
                                    value='asfsaf'
                                />
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default memo(ProductDetailPay);