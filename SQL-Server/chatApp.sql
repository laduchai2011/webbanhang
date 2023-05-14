CREATE TABLE ChatRooms
(
	Stt INT IDENTITY(1,1) NOT NULL,
	ChatRomms_Id VARCHAR(50) NOT NULL,
	ChatRooms_User1_Id VARCHAR(50) NOT NULL,
	ChatRooms_User2_Id VARCHAR(50) NOT NULL,
	ChatRooms_Day DATE NOT NULL,
	ChatRooms_Time TIME NOT NULL

	CONSTRAINT PK_ChatRooms_ChatRomms_Id PRIMARY KEY(ChatRomms_Id),
	CONSTRAINT UC_ChatRooms_Stt UNIQUE (Stt),
	CONSTRAINT UC_ChatRooms_User_Id UNIQUE (ChatRooms_User1_Id, ChatRooms_User2_Id),
	CONSTRAINT FK_ChatRooms_User1_Id FOREIGN KEY (ChatRooms_User1_Id) REFERENCES dbo.UserInfor(User_Id),
	CONSTRAINT FK_ChatRooms_User2_Id FOREIGN KEY (ChatRooms_User2_Id) REFERENCES dbo.UserInfor(User_Id)
)
GO

DROP TABLE dbo.ChatRooms
GO

SELECT * FROM dbo.ChatRooms WHERE (ChatRooms_User1_Id = 1234 AND ChatRooms_User2_Id = 123) OR (ChatRooms_User1_Id = 123 AND ChatRooms_User2_Id = 1234)
GO

CREATE TABLE Messages
(
	Stt INT IDENTITY(1,1) NOT NULL,
	Messages_Id VARCHAR(50) NOT NULL,
	Messages_ChatRoom_Id VARCHAR(50) NOT NULL,
	Messages_Message NVARCHAR(250) NOT NULL,
	Messages_User_Id VARCHAR(50) NOT NULL,
	Messages_Type VARCHAR(10) NOT NULL,
	Messages_State VARCHAR(10) NOT NULL,
	Messages_Day DATE NOT NULL,
	Messages_Time TIME NOT NULL

	CONSTRAINT PK_Messages_Messages_Id PRIMARY KEY(Messages_Id),
	CONSTRAINT UC_Messages_Stt UNIQUE (Stt),
	CONSTRAINT FK_Messages_ChatRoom_Id FOREIGN KEY (Messages_ChatRoom_Id) REFERENCES dbo.ChatRooms(ChatRomms_Id),
	CONSTRAINT FK_Messages_User_Id FOREIGN KEY (Messages_User_Id) REFERENCES dbo.UserInfor(User_Id)
)
GO

DROP TABLE dbo.Messages
GO

SELECT * FROM dbo.Messages

CREATE TABLE SocketIo
(
	Stt INT IDENTITY(1,1) NOT NULL,
	SocketIo_Id VARCHAR(50) NOT NULL,
	SocketIo_SocketId VARCHAR(50) NOT NULL,
	SocketIo_User_Id VARCHAR(50) NOT NULL,
	SocketIo_Day DATE NOT NULL,
	SocketIo_Time TIME NOT NULL

	CONSTRAINT PK_SocketIo_SocketIo_Id PRIMARY KEY(SocketIo_Id),
	CONSTRAINT UC_SocketIo_Stt UNIQUE (Stt),
	CONSTRAINT UC_SocketIo_SocketIo_SocketId UNIQUE (SocketIo_SocketId),
	CONSTRAINT FK_SocketIo_User1_Id FOREIGN KEY (SocketIo_User_Id) REFERENCES dbo.UserInfor(User_Id)
)
GO

DROP TABLE dbo.SocketIo
GO

-------------PROC----------------
CREATE PROC proc_getChatRoom
@ChatRooms_User1_Id VARCHAR(50),
@ChatRooms_User2_Id VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.ChatRooms 
	WHERE (ChatRooms_User1_Id = @ChatRooms_User1_Id AND ChatRooms_User2_Id = @ChatRooms_User2_Id) 
	OR (ChatRooms_User1_Id = @ChatRooms_User2_Id AND ChatRooms_User2_Id = @ChatRooms_User1_Id)
END
GO
--example:
EXEC proc_getRoom @ChatRooms_User1_Id, @ChatRooms_User2_Id

ALTER PROC proc_getChatRooms
@ChatRooms_User_Id VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.ChatRooms 
	WHERE (ChatRooms_User1_Id = @ChatRooms_User_Id) OR (ChatRooms_User2_Id = @ChatRooms_User_Id)
END
GO
--example:
EXEC proc_getRooms @ChatRooms_User_Id

CREATE PROC proc_addChatRoom
@ChatRomms_Id VARCHAR(50),
@ChatRooms_User1_Id VARCHAR(50),
@ChatRooms_User2_Id VARCHAR(50)
AS
BEGIN
	INSERT dbo.ChatRooms
	(
		ChatRomms_Id,
		ChatRooms_User1_Id,
		ChatRooms_User2_Id,
		ChatRooms_Day,
		ChatRooms_Time
	)
	VALUES
	(
		@ChatRomms_Id,
		@ChatRooms_User1_Id,
		@ChatRooms_User2_Id,
		GETDATE(),
		CONVERT(TIME, GETDATE())
	)
END
GO

--example:
EXEC proc_addChatRoom 3453453463456435346543, 'de7e478d-90f2-4309-a87f-e5394b037ca6', 'de7e478d-90f2-4309-a87f-e5394b037ca6'


-------------------add message----------------------
ALTER PROC proc_addMessage
@Messages_Id VARCHAR(50),
@Messages_ChatRoom_Id VARCHAR(50),
@Messages_Message NVARCHAR(250),
@Messages_User_Id VARCHAR(50),
@Messages_Type VARCHAR(10),
@Messages_State VARCHAR(10)
AS
BEGIN
	INSERT dbo.Messages
	(
		Messages_Id,
		Messages_ChatRoom_Id,
		Messages_Message,
		Messages_User_Id,
		Messages_Type,
		Messages_State,
		Messages_Day,
		Messages_Time
	)
	VALUES
	(
		@Messages_Id,
		@Messages_ChatRoom_Id,
		@Messages_Message,
		@Messages_User_Id,
		@Messages_Type,
		@Messages_State,
		GETDATE(),
		CONVERT(TIME, GETDATE())
	)
END
GO

ALTER PROC proc_getMessages
@ChatRoom_Id VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.Messages WHERE Messages_ChatRoom_Id = @ChatRoom_Id
END
GO

CREATE PROC proc_getMessages_pagination
@PageIndex INT,
@PageSize INT,
@ChatRoom_Id VARCHAR(50)
AS
BEGIN
	DECLARE @StartIndex INT = (@PageIndex-1)*@PageSize

	SELECT * FROM dbo.Messages M WHERE Messages_ChatRoom_Id = @ChatRoom_Id
	ORDER BY M.Stt DESC
	OFFSET @StartIndex ROWS
	FETCH NEXT @PageSize ROWS ONLY
END
GO

ALTER PROC proc_getMessages
@ChatRoom_Id VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.Messages WHERE Messages_ChatRoom_Id = @ChatRoom_Id
END
GO

ALTER PROC proc_getMessages_notSeen
@Messages_User_Id VARCHAR(50),
@ChatRoom_Id VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.Messages M 
	WHERE (Messages_ChatRoom_Id = @ChatRoom_Id) 
	AND (Messages_State = 'sent' OR Messages_State = 'received')
	AND (NOT Messages_User_Id = @Messages_User_Id)
	ORDER BY M.Stt DESC
END
GO
---- example------
EXEC proc_getMessages_notSeen 'de7e478d-90f2-4309-a87f-e5394b037ca6', '50b4ddb0-89bf-42aa-8c8e-eedabbb9387e' 

CREATE PROC proc_updateMessageState
@Messages_User_Id VARCHAR(50),
@ChatRoom_Id VARCHAR(50)
AS
BEGIN
	UPDATE dbo.Messages
	SET Messages_State = 'seen'
	WHERE (Messages_ChatRoom_Id = @ChatRoom_Id) 
	AND (Messages_State = 'sent' OR Messages_State = 'received')
	AND (NOT Messages_User_Id = @Messages_User_Id)
END
GO