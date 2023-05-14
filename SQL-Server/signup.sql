--------------------------signup account---------------------
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
--example:
EXEC proc_signup useridladuchai1, AccountNameladuchai1, Passwordladuchai1, 07898608541, 'laduchai1@gmail.com', la, hai1, 19952011, 1