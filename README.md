## setup steps for project.

> `step 1`

**first setup all project file.**

- git
- prettiest
- nodemon
- env file
- inside the src folder create controllers, db, middlewares, models, routes, utils and three files app.js, constants.js, index.js

> `step 2`

**connect database to mongodb.**

> `step 3`

**create express app and same package and middleware used based on it's used case**

- `cors:` this package used for handle cors origins.

- `cookieParser():` set and get cookie data from user side.

- `express.json():` using this backend can access json data from frontend.

- `express.urlencoded()`: using this backend can access data from url.

- `express.static("public"):` same public used data put in this "public" folder and can access any where without any thing do extra.

> `step 4`

**utils file write based it's used**

- Error handle.

- Response handle.

> `step 5`

**write user and video model && used jwt and bcrypt**

bcrypt for password hashing.

jwt for user side storing data.

> `step 6`

**how to upload file**

for any type of file like image,video etc.. hear used cloudinary for stored and multer for file handel.

scenario for any type of file upload :- first we stored this file is local server for temporary and after we upload on cloudinary than removed for local, for local stored in DiskStorage.

## start coding...

> `1. Register User.`

- get user details from frontend
- validation
- check if user already exists: (using username, email)
- check for images, check for avatar
- upload them to cloudinary, avatar and images
- create user object - create entry in db
- check for user creation
- remove password and refresh token field from response
- return res
- handel cover image if not so not give an error.

> `2. Loging User.`

- get login details from req.body
- validation based on email or username
- check user is currect or not
- check password by bcrypt
- access & refersh token genret[set refresh token on user object]
- this token's send on cookie

> `3. Logout User.`

- user add inside the request
- remove refresh token from user object
- cookies clear.

> `4. refresh token used-case.`

`why?`

this refresh token used for if over access token has been appear so for frontend side developer send one request for get new access token.

now, how to refresh; get one request than follow below step.

- get refresh token from cookies or body(if applition.)
- validat this token is exists or not.
- not decode using jwt and get user details.