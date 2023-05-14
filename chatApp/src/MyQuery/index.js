/**
*@typedef {
*ChatRomms_Id?: string,
*ChatRooms_User1_Id: string,
*ChatRooms_User2_Id: string
*} ChatRoomsOptions
*/

/**
*@typedef {
*Messages_Id: string,
*Messages_ChatRoom_Id: string,
*Messages_Message: string,
*Messages_User_Id: string,
*Messages_Type: string,
*Messages_State: string,  
*} MessageOptions 
*/

class MyQuery {

    constructor(sql) {
        this._sql = sql;
    }

    getRoom(chatRoomsOptions, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_getRoom 
        ${chatRoomsOptions.ChatRooms_User1_Id},
        ${chatRoomsOptions.ChatRooms_User2_Id}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    getRomms(chatRoomsUserId, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_getRooms 
        ${chatRoomsUserId}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    addRoom(chatRoomsOptions, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_addRoom 
        ${chatRoomsOptions.ChatRomms_Id},
        ${chatRoomsOptions.ChatRooms_User1_Id},
        ${chatRoomsOptions.ChatRooms_User2_Id}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    addMessage(messageOptions, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_addMessage 
        ${messageOptions.Messages_Id},
        ${messageOptions.Messages_ChatRoom_Id},
        ${messageOptions.Messages_Message},
        ${messageOptions.Messages_User_Id},
        ${messageOptions.Messages_Type},
        ${messageOptions.Messages_State}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    testgetroom(callback) {
        let err;
        let data;
        this._sql.query `SELECT * FROM dbo.ChatRooms`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

}

exports.MyQuery = MyQuery;