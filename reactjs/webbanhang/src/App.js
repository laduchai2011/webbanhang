//import logo from './logo.svg';
import './App.css';
import React, { useLayoutEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { setUserInfor, setCompanyInfor } from './utils/Common/index';
import { USERINFOR } from './utils/Constant';

import MiniInboxContainer from './component/Inbox/MiniInboxContainer';
// import MiniInboxBox from './component/Inbox/MiniInboxBox';
import Home from './component/Home';
import Product from './component/Product';
import Contact from './component/Contact';
import Report from './component/Report';
import Login from './component/Login';
import Signup from './component/Signup';
import Profile from './component/Profile';
import Recommend from './component/moreComponent/Recommend';
import Rule from './component/moreComponent/Rule';
import PrivacyPolicy from './component/moreComponent/PrivacyPolicy';
import Warranty from './component/moreComponent/Warranty';
import Instruct from './component/moreComponent/Instruct';
import Question from './component/moreComponent/Question';
import Blog from './component/moreComponent/Blog';
import AddProduct from './component/Product/AddProduct';
import SignupCompany from './component/Company/SignupCompany';
import ProductDetail from './component/Product/detailComponents/ProductInforBlock/ProductDetail';



function App() {
  useLayoutEffect(() => {
    setUserInfor(); // user infor is save in sessionStorage with key: userInfor
    setCompanyInfor(); 
  }, [])
  
  return (
    <div className="App">
      <Routes>
        {/* main component */}
        <Route exact path='/' element={<Home />} />
        <Route exact path='/product' element={<Product />} />
        <Route exact path='/contact' element={<Contact />} />
        <Route exact path='/report' element={<Report />} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/signup' element={<Signup />} />
        <Route exact path='/profile/:id' element={<Profile />} />

        {/* more component */}
        <Route exact path='/recommend' element={<Recommend />} />
        <Route exact path='/rule' element={<Rule />} />
        <Route exact path='/privacyPolicy' element={<PrivacyPolicy />} />
        <Route exact path='/warranty' element={<Warranty />} />
        <Route exact path='/instruct' element={<Instruct />} />
        <Route exact path='/question' element={<Question />} />
        <Route exact path='/blog' element={<Blog />} />

        {/* add product */}
        <Route exact path='/product/addProduct' element={<AddProduct />} />
        <Route exact path='/product/productDetail/:id' element={<ProductDetail />} />

        {/* add Company */}
        <Route exact path='/company/signupCompany' element={<SignupCompany />} />
      </Routes>
      {USERINFOR && <MiniInboxContainer />}
    </div>
  );
}

export default App;
