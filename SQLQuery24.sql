USE [Trainsquare]
GO
/****** Object:  StoredProcedure [dbo].[Attendance_ByUserId]    Script Date: 5/11/2022 6:02:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author: <Shalene Brooks>
-- Create date: <04/01/2022>
-- Description: <Select by WorkShop ID proc for Attendance>
-- Code Reviewer: <Alicia Moreno>

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================


ALTER proc [dbo].[Attendance_ByUserId]

	@PageIndex int
	,@PageSize int
	,@UserId int

as

/*
Declare @pageIndex int = 0
		,@pageSize int = 5
		,@UserId int = 261

Execute dbo.Attendance_ByUserId
		@pageIndex 
		,@pageSize 
		,@UserId




*/
BEGIN

DECLARE @offset int = @pageIndex * @pageSize

SELECT	
a.[Id]
	,a.[SessionId]
	,s.[WorkShopId]
	,ws.[Name]
	,a.[UserId]
	,ur.[RoleId]
	,r.[Name] as [RoleName]
	,up.[FirstName]
	,up.[LastName]
	,[isPresent]
	,up.[AvatarUrl]
	,TotalCount = COUNT(1) OVER()


FROM [dbo].[Attendance]
		AS a INNER JOIN dbo.Sessions AS s
		ON a.SessionId = s.Id
		INNER JOIN dbo.UserProfiles AS up
		ON a.UserId = up.UserId
		INNER JOIN dbo.UserRoles as ur
		ON a.UserId = ur.UserId
		INNER JOIN dbo.Roles as r
		ON ur.RoleId = r.Id
		INNER JOIN dbo.WorkShop as ws
		ON s.WorkShopId = ws.Id

WHERE a.UserId = @UserId


ORDER BY a.Id
OFFSET @offSet Rows
Fetch Next @PageSize Rows ONLY

END
