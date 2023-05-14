
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

--------------proc login-----------------
CREATE PROC proc_login
@AccountName VARCHAR(50),
@Password VARCHAR(50)
AS
BEGIN
	SELECT * FROM dbo.UserInfor WHERE @AccountName = Account_Name AND @Password = Password
END
GO
--example:
EXEC proc_login laduchai, '123hai'

SELECT * FROM dbo.UserInfor
CREATE PROC proc_getUserName
@User_Id VARCHAR(50)
AS
BEGIN
	SELECT First_Name, Last_Name FROM dbo.UserInfor WHERE User_Id = @User_Id
END
GO
------example---------
EXEC proc_getUserName 'aeda5465-407c-4621-8876-2b4260fd6a14'