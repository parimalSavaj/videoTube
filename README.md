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