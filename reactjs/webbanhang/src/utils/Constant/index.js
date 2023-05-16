// export const SERVERADDRESS = `${process.env.REACT_APP_API_KEY}/api`;
export const SERVERADDRESS = '/api';
export const SERVERSOCKET = '';
// export const SERVERSOCKET = `${process.env.REACT_APP_CHATAPI_KEY}`

// encode token
export const TOKENENCODESTRING = 'Bearer';
export const TOKEN = window.localStorage.getItem('token webbanhang');
export const USERINFOR = JSON.parse(window.sessionStorage.getItem('userInfor'));

// Constant in TABLE UserInfor in database webbanhang
export const UC_UserInfor_Account_Name = 'UC_UserInfor_Account_Name';
export const UC_UserInfor_Phone = 'UC_UserInfor_Phone';
export const UC_UserInfor_Email = 'UC_UserInfor_Email';