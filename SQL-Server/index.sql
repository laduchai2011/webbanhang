use Webbanhang
go



CREATE TABLE UserInfor
(
	Stt INT IDENTITY(1,1) NOT NULL,
	UserId VARCHAR(50),
	AccountName VARCHAR(50) NOT NULL,
	Password VARCHAR(50) NOT NULL,
	Phone VARCHAR(15) NOT NULL,
	Email VARCHAR(50) NOT NULL,
	FirstName VARCHAR(20) NOT NULL,
	LastName VARCHAR(20) NOT NULL,
	Birthday VARCHAR(10) NOT NULL,
	Sex BIT NOT NULL,
	JoinDay DATE NOT NULL,
	JoinTime TIME NOT NULL

	CONSTRAINT PK_UserInfor_AccountId PRIMARY KEY(UserId),
	CONSTRAINT UC_UserInfor_Stt UNIQUE (Stt),
	CONSTRAINT UC_UserInfor_Account UNIQUE (AccountName),  --UNIQUE đảm bảo rằng tất cả các giá trị trong một cột là khác nhau. 
	CONSTRAINT UC_UserInfor_Phone UNIQUE (Phone),
	CONSTRAINT UC_UserInfor_Email UNIQUE (Email) 
)
go
DROP TABLE dbo.UserInfor
go

SELECT * FROM dbo.UserInfor

INSERT dbo.UserInfor 
(
	UserId,
	AccountName,
	Password,
	Phone,
	Email,
	FirstName,
	LastName,
	Birthday,
	Sex,
	JoinDay,
	JoinTime
)
VALUES
(
	'useridladuchai1',
	'AccountNameladuchai1',
	'Passwordladuchai1',
	'0789860854',
	'laduchai@gmail.com',
	'la', 
	'hai1',
	'19952011',
	1,
	GETDATE(),
	CONVERT(TIME, GETDATE())
)
go
DELETE FROM dbo.UserInfor 
