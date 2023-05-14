-------------Create table--------------
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

DROP TABLE dbo.Product
GO

DELETE FROM dbo.Product
GO

SELECT * FROM dbo.Product
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

DROP TABLE dbo.ProductImage
GO

DELETE FROM dbo.ProductImage
GO

SELECT * FROM dbo.ProductImage
GO
SELECT * FROM dbo.Product
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

DROP TABLE dbo.ProductLike
GO

DELETE FROM dbo.ProductLike WHERE Stt = 5
GO

SELECT * FROM dbo.ProductLike
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

DROP TABLE dbo.Cart
GO

DELETE FROM dbo.Cart
GO

SELECT * FROM dbo.Cart
GO




-----------------insert-product-------------------
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
--example:
EXEC proc_addProduct 
Product_Id, 
Product_Type,
Product_Industry,
Product_Name,
Product_Title,
Product_Hastag,
Product_Infor_URL,
Product_Describe_URL,
85476.74574,
6346.435346,
5,
345345.34534,
534636346,
'aeda5465-407c-4621-8876-2b4260fd6a14',
'cb038532-ef8e-4758-ade7-5af2826059fc'


-----------------insert-product-image-------------------
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
--example:
EXEC proc_addProductImage ProductImage_Id, ProductImage_URL, Product_Id

--------------pagination--------------
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
--example:
EXEC proc_product_pagination 1, 20

ALTER PROC proc_product_pagination_withOptions
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
--example:
EXEC proc_product_pagination_withOptions 1, 16, technology, technology, 12000, 130000, 0, 100

ALTER PROC proc_product_pagination_withSearch
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
--example:
EXEC proc_product_pagination_withSearch 1, 16, es

ALTER PROC proc_productImage_pagination
@Product_Id VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.ProductImage P WHERE P.ProductImage_Product_Id = @Product_Id ORDER BY P.Stt ASC
END
GO
--example:
EXEC proc_productImage_pagination '131c0fa3-7f70-4361-9cdf-a43f4f7d8f0a'

--------------like product--------------
ALTER PROC proc_likeProduct
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
--example:
EXEC proc_likeProduct dfghdfdhSDGfiduhg,'aeda5465-407c-4621-8876-2b4260fd6a14', '03c102ff-ba37-49fa-9c7d-cb189e5aba5d'

ALTER PROC proc_disLikeProduct
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
--example:
EXEC proc_disLikeProduct 'aeda5465-407c-4621-8876-2b4260fd6a14', '03c102ff-ba37-49fa-9c7d-cb189e5aba5d'
SELECT * FROM dbo.ProductLike

CREATE PROC proc_getProductLike
@User_Id VARCHAR(50),
@Product_Id VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.ProductLike WHERE ProductLike_User_Id = @User_Id AND ProductLike_Product_Id = @Product_Id
END
GO
--example:
EXEC proc_getProductLike 'aeda5465-407c-4621-8876-2b4260fd6a14', '03c102ff-ba37-49fa-9c7d-cb189e5aba5d'

---------get product------------
CREATE PROC proc_getProduct_withId
@Product_Id VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.Product WHERE Product_Id = @Product_Id
END
GO
--example:
EXEC proc_getProduct_withId '03c102ff-ba37-49fa-9c7d-cb189e5aba5d'

-------------add cart-------------
ALTER PROC proc_addCart
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
--example:
EXEC proc_addCart '03c102ff-ba37-49fa-9c7d-cb189e5aba5d'

ALTER PROC proc_getCart
@Cart_User_Id VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.Cart WHERE Cart_User_Id = @Cart_User_Id
END
GO
--example:
EXEC proc_getCart 