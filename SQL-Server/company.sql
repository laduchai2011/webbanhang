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

DROP TABLE dbo.Company
GO

DELETE FROM dbo.Company
GO

SELECT * FROM dbo.Company

------------get my company----------
CREATE PROC proc_getMyCompany
@myUserId VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.Company WHERE @myUserId = Company_User_Id
END
GO
--example:
EXEC proc_getMyCompany sdsgsdgdsg


-----------ADD COMPANY----------
ALTER PROC proc_addCompany
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
--example:
EXEC proc_addCompany sdsgsdgdsg, laduchaicompany, urlbackgkdlksd, urlavatardsdf, urlinfordgvsdgfsgf, urldesdfmlsdkf, taxdsfksdlfk, 4, '31b7bda8-b43d-4a79-8101-3b736f137f20'

----------------get company------------
ALTER PROC proc_getCompany_withId
@Company_Id VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.Company WHERE Company_Id = @Company_Id
END
GO