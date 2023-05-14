import React from 'react';
import './styles.css';
import { Link } from 'react-router-dom';

import Header from '../../utils/Header';

const Home = () => {
    return (
        <div className="Home">
            <Header />
            <div className="topHome">
                <div className="top-leftHome">
                    <p>Gioi thieu</p>
                </div>
                <div className="top-rightHome">
                    <img src="https://tse1.mm.bing.net/th?id=OIP.RUzbCmngC_ayTpeWBwlMNwHaE-&pid=Api&P=0" alt="Girl in a jacket" />
                </div>
            </div>
            <div className="bottomHome">
                <div>
                    <h3>DOANH NGHIỆP</h3>
                    <Link className='nav-link nav-link_bottomHome' to='/recommend'>Về chúng tôi</Link>
                    <Link className='nav-link nav-link_bottomHome' to='/rule'>Điều khoản</Link>
                    <Link className='nav-link nav-link_bottomHome' to='/privacyPolicy'>Chính sách bảo mật</Link>
                    <Link className='nav-link nav-link_bottomHome' to='/warranty'>Bảo hành</Link>
                    <Link className='nav-link nav-link_bottomHome' to='/contact'>Liên hệ</Link>
                    <Link className='nav-link nav-link_bottomHome'>Email:</Link>
                    <p>laduchaibk20142015@gmail.com</p>
                </div>
                <div>
                    <h3>Hỗ trợ</h3>
                    <Link className='nav-link nav-link_bottomHome' to='/instruct'>Video hướng dẫn</Link>
                    <Link className='nav-link nav-link_bottomHome' to='/question'>Câu hỏi thường gặp</Link>
                    <Link className='nav-link nav-link_bottomHome' to='/blog'>BLOG</Link>
                </div>
                <div>
                    <h3>Giải pháp</h3>
                    <Link className='nav-link nav-link_bottomHome' to='/product/footwear'>Giày dép</Link>
                    <Link className='nav-link nav-link_bottomHome' to='/product/clothes'>Quần áo</Link>
                    <Link className='nav-link nav-link_bottomHome' to='/product/bags'>Túi sách</Link>
                    <Link className='nav-link nav-link_bottomHome' to='/product/homeElectric'>Đồ điện gia dụng</Link>
                    <Link className='nav-link nav-link_bottomHome' to='/product/bedroom'>Đồ phòng ngủ</Link>
                    <Link className='nav-link nav-link_bottomHome' to='/product/cooker'>Đồ bếp</Link>
                </div>
                <div>
                    <h3>Địa chỉ</h3>
                    <Link className='nav-link nav-link_bottomHome' to='/address/haNoi'>Hà Nội</Link>
                    <Link className='nav-link nav-link_bottomHome' to='/address/hoChiMinh'>Hồ Chí Minh</Link>
                </div>
            </div>
        </div>
    )
}

export default Home;