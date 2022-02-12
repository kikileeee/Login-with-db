# Fullstack project - login + comments

Vanilla js
Node js as backend
Mysql as a database

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
[usersdb.txt](https://github.com/kikileeee/login-comment-with-db/files/8054305/usersdb.txt)


![1](https://user-images.githubusercontent.com/83477929/153724475-d058557a-40d7-4a89-974a-0a9018672e36.png)
(Delete comment button is hover event)
