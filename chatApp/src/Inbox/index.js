const { v4: uuidv4 } = require('uuid');

/**
*@typedef {
*ChatRomms_Id?: string,
*ChatRooms_User1_Id: string,
*ChatRooms_User2_Id: string
*} ChatRoomsOptions
*/

class Inbox {
    constructor(myQuery) {
       this._myQuery = myQuery;
    }

    setupRoom(chatRoomsOptions, callback) {
        let err;
        let chatRomms_Id;

        const promise_getRoom = () => { return new Promise((resolve, reject) => {
            try {
                this._myQuery.getRoom(chatRoomsOptions, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                })
            } catch (err) {
                reject(err);
            }   
        })}
        const promise_addRoom = () => { return new Promise((resolve, reject) => {
            try {
                let chatRoomsOptions_1 = chatRoomsOptions;
                chatRoomsOptions_1.ChatRomms_Id = uuidv4();
                this._myQuery.addRoom(chatRoomsOptions_1, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        data && resolve(chatRoomsOptions_1.ChatRomms_Id);
                    }
                })
            } catch (err) {
                reject(err);
            }
            
        })}

        const promise = new Promise((resolve, reject) => {
            resolve();
        })
        promise.then(() => {
            return promise_getRoom();
        }).then((data_1) => {
            if (data_1.rowsAffected[0] > 0) {
                return data_1.recordset[0].ChatRomms_Id;
            } else {
                return promise_addRoom();
            }
        }).then((data_2) => {
            return data_2;
        }).then((ChatRomms_Id) => {
            chatRomms_Id = ChatRomms_Id;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, chatRomms_Id);
        });
        
    }
}

exports.Inbox = Inbox;