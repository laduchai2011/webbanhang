import { UC_UserInfor_Account_Name, UC_UserInfor_Phone, UC_UserInfor_Email} from '../../../utils/Constant';
/**
 * Handle errors from database as duplicate account, phone, email ..... as:
 * "Violation of UNIQUE KEY constraint 'UC_UserInfor_Email'. Cannot insert duplicate key in object 'dbo.UserInfor'. The duplicate key value is (laduchai1ertuert@gmail.com)."
 */

/** 
*@typedef {
*User_Id: string,
*Account_Name: string,
*Password: string,
*Email: string,
*Phone: string,
*Firs_tName: string,
*Last_Name: string,
*Birthday: string,
*Sex: string
*} SignupOptions
*/

export class MyError {
    constructor (error, signupOptions) {
        this._error = error;
        this._signupOptions = signupOptions;
        console.log(error)
    }

    errDuplicate (callback) {
        // get message err (is a string)
        const err = this._error.originalError.info.message;

        // check Account_Name
        const errAccount = `Violation of UNIQUE KEY constraint '${UC_UserInfor_Account_Name}'. Cannot insert duplicate key in object 'dbo.UserInfor'. The duplicate key value is (${this._signupOptions.Account_Name}).`
        if (err === errAccount) {
            callback(UC_UserInfor_Account_Name);
        }

        // check Phone
        const errPhone = `Violation of UNIQUE KEY constraint '${UC_UserInfor_Phone}'. Cannot insert duplicate key in object 'dbo.UserInfor'. The duplicate key value is (${this._signupOptions.Phone}).`
        if (err === errPhone) {
            callback(UC_UserInfor_Phone);
        }

        // check Email
        const errEmail = `Violation of UNIQUE KEY constraint '${UC_UserInfor_Email}'. Cannot insert duplicate key in object 'dbo.UserInfor'. The duplicate key value is (${this._signupOptions.Email}).`
        if (err === errEmail) {
            callback(UC_UserInfor_Email);
        }
    }
}