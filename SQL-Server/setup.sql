CREATE DATABASE Webbanhang
GO

USE Webbanhang
GO

----------------USER------------------------
CREATE TABLE UserInfor
(
	Stt INT IDENTITY(1,1) NOT NULL,
	User_Id VARCHAR(50),
	Account_Name VARCHAR(50) NOT NULL,
	Password VARCHAR(50) NOT NULL,
	Phone VARCHAR(15) NOT NULL,
	Email VARCHAR(50) NOT NULL,
	First_Name VARCHAR(20) NOT NULL,
	Last_Name VARCHAR(20) NOT NULL,
	Birthday VARCHAR(10) NOT NULL,
	Sex BIT NOT NULL,
	Day DATE NOT NULL,
	Time TIME NOT NULL

	CONSTRAINT PK_UserInfor_User_Id PRIMARY KEY(User_Id),
	CONSTRAINT UC_UserInfor_Stt UNIQUE (Stt),
	CONSTRAINT UC_UserInfor_Account_Name UNIQUE (Account_Name),  --UNIQUE đảm bảo rằng tất cả các giá trị trong một cột là khác nhau. 
	CONSTRAINT UC_UserInfor_Phone UNIQUE (Phone),
	CONSTRAINT UC_UserInfor_Email UNIQUE (Email) 
)
GO

CREATE PROC proc_signup
@UserId VARCHAR(50),
@AccountName VARCHAR(50),
@Password VARCHAR(50),
@Phone VARCHAR(15),
@Email VARCHAR(50),
@FirstName VARCHAR(20),
@LastName VARCHAR(20),
@Birthday VARCHAR(20),
@Sex BIT
AS
BEGIN
	INSERT dbo.UserInfor 
	(
		User_Id,
		Account_Name,
		Password,
		Phone,
		Email,
		First_Name,
		Last_Name,
		Birthday,
		Sex,
		Day,
		Time
	)
	VALUES
	(
		@UserId,
		@AccountName,
		@Password,
		@Phone,
		@Email,
		@FirstName, 
		@LastName,
		@Birthday,
		@Sex,
		GETDATE(),
		CONVERT(TIME, GETDATE())
	)
END
GO

CREATE PROC proc_login
@AccountName VARCHAR(50),
@Password VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.UserInfor WHERE @AccountName = Account_Name AND @Password = Password
END
GO

CREATE PROC proc_getUserName
@User_Id VARCHAR(50)
AS
BEGIN
	SELECT First_Name, Last_Name FROM dbo.UserInfor WHERE User_Id = @User_Id
END
GO
--------------------------------------------

-----------------COMPANY--------------------
CREATE TABLE Company
(
	Stt INT IDENTITY(1,1) NOT NULL,
	Company_Id VARCHAR(50) NOT NULL,
	Company_Name NVARCHAR(200) NOT NULL,
	Company_BackgroudImage_URL VARCHAR(150) NOT NULL,
	Company_Avatar_URL VARCHAR(150) NOT NULL,
	Company_Infor_URL NVARCHAR(150) NOT NULL,
	Company_Describe_URL NVARCHAR(150) NOT NULL,
	Company_Tax_Code VARCHAR(50) NOT NULL,
	Company_Star FLOAT(1) NOT NULL,
	Company_User_Id VARCHAR(50) NOT NULL,
	Company_Day DATE NOT NULL,
	Company_Time TIME NOT NULL

	CONSTRAINT PK_Company_Company_Id PRIMARY KEY(Company_Id),
	CONSTRAINT UC_Company_Stt UNIQUE (Stt),
	CONSTRAINT UC_Company_Company_Name UNIQUE (Company_Name),
	CONSTRAINT FK_Company_User_Id FOREIGN KEY (Company_User_Id) REFERENCES dbo.UserInfor(User_Id)
)
GO

CREATE PROC proc_getMyCompany
@myUserId VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.Company WHERE @myUserId = Company_User_Id
END
GO

CREATE PROC proc_addCompany
@Company_Id VARCHAR(50),
@Company_Name NVARCHAR(200),
@Company_BackgroudImage_URL VARCHAR(150),
@Company_Avatar_URL VARCHAR(150),
@Company_Infor_URL NVARCHAR(150),
@Company_Describe_URL NVARCHAR(150),
@Company_Tax_Code VARCHAR(50),
@Company_Star FLOAT(1),
@Company_User_Id VARCHAR(50)
AS
BEGIN
INSERT dbo.Company 
	(
		Company_Id,
		Company_Name,
		Company_BackgroudImage_URL,
		Company_Avatar_URL,
		Company_Infor_URL,
		Company_Describe_URL,
		Company_Tax_Code,
		Company_Star,
		Company_User_Id,
		Company_Day,
		Company_Time
	)
	VALUES
	(
		@Company_Id,
		@Company_Name,
		@Company_BackgroudImage_URL,
		@Company_Avatar_URL,
		@Company_Infor_URL, 
		@Company_Describe_URL,
		@Company_Tax_Code,
		@Company_Star,
		@Company_User_Id,
		GETDATE(),
		CONVERT(TIME, GETDATE())
	)
END
GO

CREATE PROC proc_getCompany_withId
@Company_Id VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.Company WHERE Company_Id = @Company_Id
END
GO
--------------------------------------------

------------------ADDRESS-------------------
CREATE TABLE Address
(
	Stt INT IDENTITY(1,1) NOT NULL,
	Address_Id VARCHAR(50) NOT NULL,
	Address_Province NVARCHAR(50) NOT NULL,
	Address_District NVARCHAR(50) NOT NULL,
	Address_Commune NVARCHAR(50) NOT NULL,
	Address_Hamlet NVARCHAR(50) NOT NULL,
	Address_Home_Number NVARCHAR(50) NOT NULL,
	Address_Company_User BIT NOT NULL, --0: USER, 1: Company
	Address_User_Id VARCHAR(50) NOT NULL, 
	Address_Company_Id VARCHAR(50) NOT NULL,
	Address_Day DATE NOT NULL,
	Address_Time TIME NOT NULL

	CONSTRAINT PK_Address_AccountId PRIMARY KEY(Address_Id),
	CONSTRAINT UC_Address_Stt UNIQUE (Stt),
	CONSTRAINT FK_Address_User_Id FOREIGN KEY (Address_User_Id) REFERENCES dbo.UserInfor(User_Id),
	CONSTRAINT FK_Address_Company_Id FOREIGN KEY (Address_Company_Id) REFERENCES dbo.Company(Company_Id)
)
GO

CREATE PROC proc_addAddress
@Address_Id VARCHAR(50),
@Address_Province NVARCHAR(50),
@Address_District NVARCHAR(50),
@Address_Commune NVARCHAR(50),
@Address_Hamlet NVARCHAR(50),
@Address_Home_Number NVARCHAR(50),
@Address_Company_User BIT,
@Address_User_Id VARCHAR(50), 
@Address_Company_Id VARCHAR(50)
AS
BEGIN
	INSERT dbo.Address 
	(
		Address_Id,
		Address_Province,
		Address_District,
		Address_Commune,
		Address_Hamlet,
		Address_Home_Number,
		Address_Company_User,
		Address_User_Id, 
		Address_Company_Id,
		Address_Day,
		Address_Time
	)
	VALUES
	(
		@Address_Id,
		@Address_Province,
		@Address_District,
		@Address_Commune,
		@Address_Hamlet, 
		@Address_Home_Number,
		@Address_Company_User,
		@Address_User_Id,
		@Address_Company_Id,
		GETDATE(),
		CONVERT(TIME, GETDATE())
	)
END
GO

CREATE TABLE Province
(
	Province_Name NVARCHAR(50) NOT NULL
	CONSTRAINT PK_Province PRIMARY KEY(Province_Name)
)
GO

CREATE TABLE District
(
	District_Name NVARCHAR(50) NOT NULL,
	District_Province NVARCHAR(50) NOT NULL

	CONSTRAINT PK_District PRIMARY KEY(District_Name),
	CONSTRAINT FK_District FOREIGN KEY (District_Province) REFERENCES dbo.Province(Province_Name)
)
GO

CREATE TABLE Commune
(
	Commune_Name NVARCHAR(50) NOT NULL,
	Commune_District NVARCHAR(50) NOT NULL

	CONSTRAINT PK_Commune PRIMARY KEY(Commune_Name),
	CONSTRAINT FK_Commune FOREIGN KEY (Commune_District) REFERENCES dbo.District(District_Name)
)
GO

CREATE TABLE Hamlet
(
	Hamlet_Name NVARCHAR(50) NOT NULL,
	Hamlet_Commune NVARCHAR(50) NOT NULL

	CONSTRAINT PK_Hamlet PRIMARY KEY(Hamlet_Name),
	CONSTRAINT FK_Hamlet FOREIGN KEY (Hamlet_Commune) REFERENCES dbo.Commune(Commune_Name)
)
GO

CREATE TABLE Home_Number
(
	Home_Number_Name NVARCHAR(50) NOT NULL,
	Home_Number_Hamlet NVARCHAR(50) NOT NULL

	CONSTRAINT PK_Home_Number PRIMARY KEY(Home_Number_Name),
	CONSTRAINT FK_Home_Number FOREIGN KEY (Home_Number_Hamlet) REFERENCES dbo.Hamlet(Hamlet_Name)
)
GO

INSERT dbo.Province (Province_Name) VALUES ( N'Hà Nội' )
GO
INSERT dbo.District (District_Name, District_Province) VALUES ( N'Hà Đông' , N'Hà Nội' )
GO
INSERT dbo.Commune (Commune_Name, Commune_District) VALUES ( N'Phan Đình Giót' , N'Hà Đông' )
GO
INSERT dbo.Hamlet (Hamlet_Name, Hamlet_Commune) VALUES ( N'La Khê' , N'Phan Đình Giót' )
GO
INSERT dbo.Home_Number (Home_Number_Name, Home_Number_Hamlet) VALUES ( N'11' , N'La Khê' )
GO
--------------------------------------------

------------------PRODUCT-------------------
CREATE TABLE Product
(
	Stt INT IDENTITY(1,1) NOT NULL,
	Product_Id VARCHAR(50) NOT NULL,
	Product_Type NVARCHAR(100) NOT NULL,
	Product_Industry NVARCHAR(100) NOT NULL,
	Product_Name NVARCHAR(100) NOT NULL,
	Product_Title NVARCHAR(50) NOT NULL,
	Product_Hastag VARCHAR(100) NOT NULL,
	Product_Infor_URL NVARCHAR(150) NOT NULL,
	Product_Describe_URL NVARCHAR(150) NOT NULL,
	Product_Price FLOAT(53) NOT NULL,
	Product_VAT FLOAT(53) NOT NULL,
	Product_Like INT NOT NULL,
	Product_Sale FLOAT(53) NOT NULL,
	Product_AmountOfSold INT NOT NULL,
	Product_Amount INT NOT NULL,
	Product_User_Id VARCHAR(50) NOT NULL,
	Product_Company_Id VARCHAR(50) NOT NULL,
	Product_Day DATE NOT NULL,
	Product_Time TIME NOT NULL

	CONSTRAINT PK_Product_Product_Id PRIMARY KEY(Product_Id),
	CONSTRAINT UC_Product_Stt UNIQUE (Stt),
	CONSTRAINT FK_Product_User_Id FOREIGN KEY (Product_User_Id) REFERENCES dbo.UserInfor(User_Id),
	CONSTRAINT FK_Product_Company_Id FOREIGN KEY (Product_Company_Id) REFERENCES dbo.Company(Company_Id)
)
GO

CREATE TABLE ProductImage
(
	Stt INT IDENTITY(1,1) NOT NULL,
	ProductImage_Id VARCHAR(50) NOT NULL,
	ProductImage_URL VARCHAR(150) NOT NULL,
	ProductImage_Product_Id VARCHAR(50) NOT NULL,
	ProductImage_Day DATE NOT NULL,
	ProductImage_Time TIME NOT NULL

	CONSTRAINT PK_ProductImage_ProductImage_Id PRIMARY KEY(ProductImage_Id),
	CONSTRAINT UC_ProductImage_Stt UNIQUE (Stt),
	CONSTRAINT FK_ProductImage_Product_Id FOREIGN KEY (ProductImage_Product_Id) REFERENCES dbo.Product(Product_Id)
)
GO

CREATE TABLE ProductLike
(
	Stt INT IDENTITY(1,1) NOT NULL,
	ProductLike_Id VARCHAR(50) NOT NULL,
	ProductLike_User_Id VARCHAR(50) NOT NULL,
	ProductLike_Product_Id VARCHAR(50) NOT NULL,
	ProductLike_Day DATE NOT NULL,
	ProductLike_Time TIME NOT NULL

	CONSTRAINT PK_ProductLike_ProductLike_Id PRIMARY KEY(ProductLike_Id),
	CONSTRAINT UC_ProductLike_Stt UNIQUE (Stt),
	CONSTRAINT FK_ProductLike_User_Id FOREIGN KEY (ProductLike_User_Id) REFERENCES dbo.UserInfor(User_Id),
	CONSTRAINT FK_ProductLike_Product_Id FOREIGN KEY (ProductLike_Product_Id) REFERENCES dbo.Product(Product_Id)
)
GO

CREATE TABLE Cart
(
	Stt INT IDENTITY(1,1) NOT NULL,
	Cart_Id VARCHAR(50) NOT NULL,
	Cart_Type VARCHAR(50) NOT NULL,
	Cart_Product_Id VARCHAR(50) NOT NULL,
	Cart_User_Id VARCHAR(50) NOT NULL,
	Cart_Day DATE NOT NULL,
	Cart_Time TIME NOT NULL

	CONSTRAINT PK_Cart_Cart_Id PRIMARY KEY(Cart_Id),
	CONSTRAINT UC_Cart_Stt UNIQUE (Stt),
	CONSTRAINT FK_Cart_User_Id FOREIGN KEY (Cart_User_Id) REFERENCES dbo.UserInfor(User_Id),
	CONSTRAINT FK_Cart_Product_Id FOREIGN KEY (Cart_Product_Id) REFERENCES dbo.Product(Product_Id)
)
GO

CREATE PROC proc_addProduct
@Product_Id VARCHAR(50),
@Product_Type NVARCHAR(100),
@Product_Industry NVARCHAR(100),
@Product_Name NVARCHAR(100),
@Product_Title NVARCHAR(50),
@Product_Hastag VARCHAR(100),
@Product_Infor_URL NVARCHAR(150),
@Product_Describe_URL NVARCHAR(150),
@Product_Price FLOAT(53),
@Product_VAT FLOAT(53),
@Product_Like INT,
@Product_Sale FLOAT(53),
@Product_AmountOfSold INT,
@Product_Amount INT,
@Product_User_Id VARCHAR(50),
@Product_Company_Id VARCHAR(50)
AS 
BEGIN
	INSERT dbo.Product 
	(
		Product_Id,
		Product_Type,
		Product_Industry,
		Product_Name,
		Product_Title,
		Product_Hastag,
		Product_Infor_URL,
		Product_Describe_URL,
		Product_Price,
		Product_VAT,
		Product_Like,
		Product_Sale,
		Product_AmountOfSold,
		Product_Amount,
		Product_User_Id,
		Product_Company_Id,
		Product_Day,
		Product_Time
	)
	VALUES
	(
		@Product_Id,
		@Product_Type,
		@Product_Industry,
		@Product_Name,
		@Product_Title,
		@Product_Hastag,
		@Product_Infor_URL,
		@Product_Describe_URL,
		@Product_Price,
		@Product_VAT,
		@Product_Like,
		@Product_Sale,
		@Product_AmountOfSold,
		@Product_Amount,
		@Product_User_Id,
		@Product_Company_Id,
		GETDATE(),
		CONVERT(TIME, GETDATE())
	)
END
GO

CREATE PROC proc_addProductImage
@ProductImage_Id VARCHAR(50),
@ProductImage_URL VARCHAR(150),
@ProductImage_Product_Id VARCHAR(50)
AS
BEGIN
	INSERT dbo.ProductImage 
	(
		ProductImage_Id,
		ProductImage_URL,
		ProductImage_Product_Id,
		ProductImage_Day,
		ProductImage_Time
	)
	VALUES
	(
		@ProductImage_Id,
		@ProductImage_URL,
		@ProductImage_Product_Id,
		GETDATE(),
		CONVERT(TIME, GETDATE())
	)
END
GO

CREATE PROC proc_product_pagination
@PageIndex INT,
@PageSize INT
AS
BEGIN
	DECLARE @StartIndex INT = (@PageIndex-1)*@PageSize

	SELECT * FROM dbo.Product P ORDER BY P.Stt DESC
	OFFSET @StartIndex ROWS
	FETCH NEXT @PageSize ROWS ONLY
END
GO

CREATE PROC proc_product_pagination_withOptions
@PageIndex INT,
@PageSize INT,
@Product_Type NVARCHAR(100), 
@Product_Industry NVARCHAR(100), 
@Product_Price1 FLOAT(53), 
@Product_Price2 FLOAT(53),
@Product_Sale1 FLOAT(53),
@Product_Sale2 FLOAT(53)
AS
BEGIN
	DECLARE @StartIndex INT = (@PageIndex-1)*@PageSize

	SELECT * FROM dbo.Product P
	WHERE P.Product_Type = @Product_Type 
	AND P.Product_Industry = @Product_Industry 
	AND P.Product_Price >= @Product_Price1
	AND P.Product_Price <= @Product_Price2
	AND P.Product_Sale >= @Product_Sale1
	AND P.Product_Sale <= @Product_Sale2
	ORDER BY P.Stt DESC
	OFFSET @StartIndex ROWS
	FETCH NEXT @PageSize ROWS ONLY
END
GO

CREATE PROC proc_product_pagination_withSearch
@PageIndex INT,
@PageSize INT,
@Product_Name NVARCHAR(100) 
AS
BEGIN
	DECLARE @StartIndex INT = (@PageIndex-1)*@PageSize

	SELECT * FROM dbo.Product P
	WHERE CHARINDEX(@Product_Name, P.Product_Name) > 0
	ORDER BY P.Stt DESC
	OFFSET @StartIndex ROWS
	FETCH NEXT @PageSize ROWS ONLY
END
GO

CREATE PROC proc_productImage_pagination
@Product_Id VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.ProductImage P WHERE P.ProductImage_Product_Id = @Product_Id ORDER BY P.Stt ASC
END
GO

CREATE PROC proc_likeProduct
@ProductLike_Id VARCHAR(50),
@User_Id VARCHAR(50),
@Product_Id VARCHAR(50)
AS
BEGIN
	--update product table
	DECLARE @like INT;
	SELECT @like = Product_Like FROM dbo.Product WHERE Product_Id = @Product_Id;
	SELECT @like = @like + 1
	UPDATE dbo.Product
	SET Product_Like = @like
	WHERE Product_Id = @Product_Id;

	-- Add into productLike table
	INSERT dbo.ProductLike 
	(
		ProductLike_Id,
		ProductLike_User_Id,
		ProductLike_Product_Id,
		ProductLike_Day,
		ProductLike_Time
	)
	VALUES
	(
		@ProductLike_Id,
		@User_Id,
		@Product_Id,
		GETDATE(),
		CONVERT(TIME, GETDATE())
	)
END
GO

CREATE PROC proc_disLikeProduct
@User_Id VARCHAR(50),
@Product_Id VARCHAR(50)
AS
BEGIN
	--update product table
	DECLARE @like INT;
	SELECT @like = Product_Like FROM dbo.Product WHERE Product_Id = @Product_Id;
	SELECT @like = @like - 1
	UPDATE dbo.Product
	SET Product_Like = @like
	WHERE Product_Id = @Product_Id;

	--reject infor in productLike table
	DELETE FROM dbo.ProductLike WHERE ProductLike_User_Id = @User_Id AND ProductLike_Product_Id = @Product_Id
END
GO

CREATE PROC proc_getProductLike
@User_Id VARCHAR(50),
@Product_Id VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.ProductLike WHERE ProductLike_User_Id = @User_Id AND ProductLike_Product_Id = @Product_Id
END
GO

CREATE PROC proc_getProduct_withId
@Product_Id VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.Product WHERE Product_Id = @Product_Id
END
GO

CREATE PROC proc_addCart
@Cart_Id VARCHAR(50),
@Cart_Type VARCHAR(50),
@Cart_Product_Id VARCHAR(50),
@Cart_User_Id VARCHAR(50)
AS
BEGIN
	INSERT dbo.Cart 
	(
		Cart_Id,
		Cart_Type,
		Cart_Product_Id,
		Cart_User_Id,
		Cart_Day,
		Cart_Time
	)
	VALUES
	(
		@Cart_Id,
		@Cart_Type,
		@Cart_Product_Id,
		@Cart_User_Id,
		GETDATE(),
		CONVERT(TIME, GETDATE())
	)
END 
GO

CREATE PROC proc_getCart
@Cart_User_Id VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.Cart WHERE Cart_User_Id = @Cart_User_Id
END
GO
--------------------------------------------

------------------CHATAPP-------------------
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

CREATE PROC proc_getChatRooms
@ChatRooms_User_Id VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.ChatRooms 
	WHERE (ChatRooms_User1_Id = @ChatRooms_User_Id) OR (ChatRooms_User2_Id = @ChatRooms_User_Id)
END
GO

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

CREATE PROC proc_addMessage
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

CREATE PROC proc_getMessages
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

CREATE PROC proc_getMessages
@ChatRoom_Id VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.Messages WHERE Messages_ChatRoom_Id = @ChatRoom_Id
END
GO

CREATE PROC proc_getMessages_notSeen
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
--------------------------------------------