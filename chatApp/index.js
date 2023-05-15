require('dotenv').config();
const sql = require('mssql');
const { v4: uuidv4 } = require('uuid');
const { Server } = require('socket.io');
const io = new Server({
    path: "/chatSocketIo",
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    }
})
const { createClient } = require('redis'); 
const { createAdapter } = require("@socket.io/redis-adapter");
const { sqlParameter, redisParameter } = require('./src/config/config');
const { MyQuery } = require('./src/MyQuery');
// const { Inbox } = require('./src/Inbox');
const { JwtVerify } = require('./src/Middle/JwtVerify');
const PORT = process.env.NODE_SERVER_PORT_KEY||5000;
const sqlConfig = {
    user: sqlParameter.user,
    password: sqlParameter.password,
    database: sqlParameter.database,
    server: sqlParameter.server,
    port: sqlParameter.port,
    synchronize: true,
    trustServerCertificate: true,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}
sql.connect(sqlConfig)  
const myQuery = new MyQuery(sql);
// const inbox = new Inbox(myQuery);


const pubClient = createClient({ 
    url: `redis://${redisParameter.user}:${redisParameter.password}@${redisParameter.server}:${redisParameter.port}` 
});
const subClient = pubClient.duplicate();
Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));
    io.listen(PORT);
});

// (async() => {
//     pubClient.get('socketId-de7e478d-90f2-4309-a87f-e5394b037ca6').then(res => {
//         console.log('test', res)
//     })
    
// })()

io.use((socket, next) => { 
    setTimeout(() => {
        const token = socket.handshake.auth.token;
        JwtVerify(token, next);
    }, 1000);

    socket.on("disconnect", () => {
        console.log('disconnect');
    });
});

// let b = await pubClient.flushAll();
// let c = await pubClient.keys('*');

io.on('connection', (client) => {
    let rooms = []; // all room that client join
    const userId = client.handshake.query.userId;
    let socket_redis = {
        key: `socketId-${userId}`,
        value: client.id
    }

    // when 1 user online, the will join a room with their socketid and save it' information in redis
    client.join(client.id);
    pubClient.set(`socketId-${userId}`, client.id);


    // Let begin the first setup to both sender and receiver join a roomid in database
    // here the will talk to the each other
    // the setup main is to between sender and receiver have a roomid in database

    // server listen a inbox require from sender to receive and send to receiver,
    // if receiver online, they with send again at once, the time they accept not yet require
    client.on ('sender-receiver-inboxRequire', ({chatRooms_Id_inDatabase, receiverId}) => {
        // console.log('sender-receiver-inboxRequire', chatRooms_Id_inDatabase, receiverId)
        // server get roomid (is a socketid) via receiver, to send require from sender to reciver
        pubClient.get(`socketId-${receiverId}`).then(socketId => {
            // console.log('pubClient', socketId)
            // socketId !== null is receiver online 
            if (socketId !== null) { 
                // if receiver online, server do 2 work
                // work 1: send require to reciver
                // work 2: send notification to sender that receiver is online
                client.to(socketId).emit('sender-receiver-inboxRequire', chatRooms_Id_inDatabase);
            } else {
                // receiver is not online
            }
        })
    })


    // server listen user join a common roomid (in database)
    // here sender and receiver is equal
    client.on('user-join-roomId-inDatabase', chatRooms_Id_inDatabase => {
        // console.log('user-join-roomId-inDatabase', chatRooms_Id_inDatabase)
        client.join(chatRooms_Id_inDatabase);

        // let add roomid (in database) to rooms variavle to manage
        // all roomid in rooms variable wil is deleted user disconnect
        rooms.push(chatRooms_Id_inDatabase);
    })

    // in the receiver role, user transfer from back-ground to chatting,
    // work 1: they will leave roomid (in database) in old scoketid
    // work 2: join a roomid (in database) with new socket
    client.on('transfer-backGround-Chatting', chatRooms_Id_inDatabase => {
        // console.log('transfer-backGround-Chatting', chatRooms_Id_inDatabase)
        client.leave(chatRooms_Id_inDatabase);
        client.emit('transfer-backGround-Chatting', chatRooms_Id_inDatabase)
    })


    // here server listen a check user in roomid (in database) is online or offline
    // check message is sent via roomid (in database), if they online, they will receive a message in here
    client.on('check-inboxUser-online-offline', ({senderId, chatRooms_Id_inDatabase}) =>{
        client.to(chatRooms_Id_inDatabase).emit('check-inboxUser-online-offline', {
            senderId: senderId, 
            chatRooms_Id_inDatabase: chatRooms_Id_inDatabase
        });
    }) 


    // handle responsive of event (check-inboxUser-online-offline)
    // server listen responsive and transfer it to the other user
    // because server send responsive to common roomid (in database), 
    // so between sender and receiver, param (sender) is sent to all user in room to only handle event in the receiver role
    client.on('responsive-check-inboxUser-online-offline', ({senderId, chatRooms_Id_inDatabase}) => {
        client.to(chatRooms_Id_inDatabase).emit('responsive-check-inboxUser-online-offline', {
            senderId: senderId, 
            chatRooms_Id_inDatabase: chatRooms_Id_inDatabase
        });
    })

    // begin inbox in here, every messages is sent to roomid (in database),
    // all user in room will receive it
    // server listen messages is sent, tranfer it to all user
    // note: Messages_ChatRoom_Id is roomid (in database)
    client.on('message-roomId-inDatabase', message => {
        // console.log('message-roomId-inDatabase', message)
        let messageOptions_1 = message;
        messageOptions_1.Messages_Id = uuidv4();
        myQuery.addMessage(messageOptions_1, (err, data) => {
            if (err) {
                console.error(err)
            } else {
                client.to(message.Messages_ChatRoom_Id).emit('message-roomId-inDatabase', messageOptions_1);
            }
        })
    })


    // // send to receiver
    // client.on('client-server-chatInvitation', receiveUserInfor => {
    //     pubClient.get(`socketId-${receiveUserInfor.Invite_User_Id}`).then(socketId => {
    //         if (socketId !== null) { 
    //             // sender send a RoomId (in database) to receiver and serder join a RoomId (in database)
    //             const roomId_inDatabase = receiveUserInfor.ChatRomms_Id;
    //             client.join(roomId_inDatabase);
    //             rooms.push(roomId_inDatabase);
    //             client.to(socketId).emit('server-client-chatInvitation', roomId_inDatabase);
    //         } else {
    //             // receiver is not online
    //         }
    //     })
    // })

    // // receiver accept auto
    // client.on('client-server-notifi-receiverOnline', roomId_inDatabase => {
    //     // receiver auto join a RoomId (in database) 
    //     client.join(roomId_inDatabase);

    //     // receiver send to sender a message to notifi receiver online
    //     client.to(roomId_inDatabase).emit('server-client-notifi-receiverOnline', roomId_inDatabase);
    // })

    // // when user offline, they send notification to the other user in a RoomId (in database) 
    // client.on('client-server-UserOffline', roomId_inDatabase => {
    //     client.to(roomId_inDatabase).emit('server-client-UserOffline', {})
    // })

    // client.on('client-server-sendMessage', messageOptions => {
    //     let messageOptions_1 = messageOptions;
    //     messageOptions_1.Messages_Id = uuidv4();
    //     myQuery.addMessage(messageOptions_1, (err, data) => {
    //         if (err) {
    //             console.error(err)
    //         } else {
    //             client.to(messageOptions.Messages_ChatRoom_Id).emit('server-client-sendMessage', messageOptions_1)
    //         }
    //     })
    // })

    // client.on('client-server-message', (data) => {
    //     // console.log(data)
    //     client.broadcast.emit("server-client-message", data)
    // })

    // client.broadcast.emit('hello', 'to all clients except sender');
    client.on('disconnect', async () => { 
        for (let i = 0; i < rooms.length; i++) {
            client.leave(rooms[i]);
        }
        client.leave(client.id);
        await pubClient.del(socket_redis.key);
        let a = await pubClient.get(socket_redis.key);
        let c = await pubClient.keys('*');
        console.log('dis', a)
        console.log('keys', c)
        console.log('disconnect');
    });
});