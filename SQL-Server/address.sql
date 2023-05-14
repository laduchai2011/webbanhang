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

DELETE FROM dbo.Address
GO
SELECT * FROM dbo.Address

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
--example:
EXEC proc_addAddress
Address_Id,
Address_Province,
Address_District,
Address_Commune,
Address_Hamlet,
Address_Home_Number,
Address_Company_User,
Address_User_Id, 
Address_Company_Id



------------------- table address list--------------------------
CREATE TABLE Province
(
	Province_Name NVARCHAR(50) NOT NULL
	CONSTRAINT PK_Province PRIMARY KEY(Province_Name)
)
GO

INSERT dbo.Province (Province_Name) VALUES ( N'Hà Nội' )
GO
DROP TABLE dbo.Province
GO
DELETE FROM dbo.Province
GO
SELECT * FROM dbo.Province


CREATE TABLE District
(
	District_Name NVARCHAR(50) NOT NULL,
	District_Province NVARCHAR(50) NOT NULL

	CONSTRAINT PK_District PRIMARY KEY(District_Name),
	CONSTRAINT FK_District FOREIGN KEY (District_Province) REFERENCES dbo.Province(Province_Name)
)
GO

INSERT dbo.District (District_Name, District_Province) VALUES ( N'Hà Đông' , N'Hà Nội' )
GO
DROP TABLE dbo.District
GO
DELETE FROM dbo.District 
GO
SELECT * FROM dbo.District


CREATE TABLE Commune
(
	Commune_Name NVARCHAR(50) NOT NULL,
	Commune_District NVARCHAR(50) NOT NULL

	CONSTRAINT PK_Commune PRIMARY KEY(Commune_Name),
	CONSTRAINT FK_Commune FOREIGN KEY (Commune_District) REFERENCES dbo.District(District_Name)
)
GO

INSERT dbo.Commune (Commune_Name, Commune_District) VALUES ( N'Phan Đình Giót' , N'Hà Đông' )
GO
DROP TABLE dbo.Commune
GO
DELETE FROM dbo.Commune
GO
SELECT * FROM dbo.Commune


CREATE TABLE Hamlet
(
	Hamlet_Name NVARCHAR(50) NOT NULL,
	Hamlet_Commune NVARCHAR(50) NOT NULL

	CONSTRAINT PK_Hamlet PRIMARY KEY(Hamlet_Name),
	CONSTRAINT FK_Hamlet FOREIGN KEY (Hamlet_Commune) REFERENCES dbo.Commune(Commune_Name)
)
GO

INSERT dbo.Hamlet (Hamlet_Name, Hamlet_Commune) VALUES ( N'La Khê' , N'Phan Đình Giót' )
GO
DROP TABLE dbo.Hamlet
GO
DELETE FROM dbo.Hamlet
GO
SELECT * FROM dbo.Hamlet


CREATE TABLE Home_Number
(
	Home_Number_Name NVARCHAR(50) NOT NULL,
	Home_Number_Hamlet NVARCHAR(50) NOT NULL

	CONSTRAINT PK_Home_Number PRIMARY KEY(Home_Number_Name),
	CONSTRAINT FK_Home_Number FOREIGN KEY (Home_Number_Hamlet) REFERENCES dbo.Hamlet(Hamlet_Name)
)
GO

INSERT dbo.Home_Number (Home_Number_Name, Home_Number_Hamlet) VALUES ( N'11' , N'La Khê' )
GO
DROP TABLE dbo.Home_Number
GO
DELETE FROM dbo.Home_Number
GO
SELECT * FROM dbo.Home_Number