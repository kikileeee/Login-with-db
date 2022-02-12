# Fullstack project - login + comments

Site with sign in and login with database on mysql.

// 
Sign in validation is checking on backend.js as the most logic i located there.
There is also password encryption.

User can add comments and remove only its own ones.
User can also add picture that will be displayed on its comment.
If user has picture in the database, it will remove it and place the new one, also there is a limit of a 5MB.
User can be become Admin  and have access to Admin Panel.

Admin panel can view all users and delete them, also it can show other admins.
Only Head admin can remove admin from users
Admins can delete any comment from any user.

If users is logout and tries open site where home.html is, it will redirect him to index.html and vice versa.
//
