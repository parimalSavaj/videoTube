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

**used jwt and bcrypt**

bcrypt for password hashing.

jwt for user side storing data.

> `step 6`

**how to upload file**

for any type of file like image, video etc.. hear used cloudinary for stored and multer for file handel.

scenario for any type of file upload :- first we stored this file is local server for temporary and after we upload on cloudinary than removed for local, for local stored in DiskStorage.

---

---

## start coding...

> **write user and video model**

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

> `2. Login User.`

- get login details from req.body
- validation based on email or username
- check user is correct or not
- check password by bcrypt
- access & refresh token generate[set refresh token on user object]
- this token's send on cookie

> `3. Logout User.`

- user add inside the request
- remove refresh token from user object
- cookies clear.

> `4. refresh token used-case.`

`why?`

this refresh token used for if over access token has been appear so for frontend side developer send one request for get new access token.

now, how to refresh; get one request than follow below step.

- get refresh token from cookies or body(if application.)
- validate this token is exists or not.
- decode using jwt and get user details.

> `5. change password`

- get oldPassword and newPassword from req.body (if you need conformPassword, so you use.)
- in this route we add _auth middleware_ so access _req.user_.
- so get user from database.
- check oldPassword is correct or not using isPasswordCorrect method of user model.
- setup new password; here userSchema.pre method automatic used.
- send response.

> `6. get current user`

**why ?**

based on it's used case,...

- if user is login so auth middleware is run and we can get using req.user.
- this req.user return.

> `7. update user details.`

**_this is only updates text details not files or photo's. for batter way._**

- get details from req.body and validate.
- we can get user using req.user; because auth middleware is run.
- find id and update it's details.
- send new details using response.

**_update user avatar_**

for this type of info update, write different routs for batter way.

- for this rout used mutter and auth two middleware, so access of req.file(not files !?) and req.user.
- get avatar local path from req.file.path and validate it.
- upload this img to cloudinary and validate it.
- now update avatar url based on cloudinary url.
- now same for coverImage.
- send response.

> **write subscription model**

> `8. get channel profile`

- get channel name from req.params.
- validate it.
- write aggregate query
  - first write match case
  - then join with subscriptions table or document, for subscribers get or count.
  - then a again write other join query for subscribedTo
  - then add this field to user table or document.
  - and select it's what what filed you want.

> `9. get watch history of user`

get can not pass directly req.user.\_id in side the aggregate query because write inside the aggregate query is directly pass in to mongoDB. so inside mongoDB he not get req.user.\_id

write aggregate query.

- first match data by id, but matching data pass mongoose.type.ObjectId not req.user.\_id
- than connect user model to video model using lookup.
  - than get video proper data we write nested aggregate pipeline for video model owner property.
  - to handle this user data for owner filed we in side video model i can get only user name and other limited data.
    - for this we have two way write inside this nested to nested pipeline or only nested pipeline.
- add fields with pipeline output handle.

> **write some models**

- comment.model
- like.model
- playlist.model
- tweet.model

---

---

## video controller

---

> `10. how to upload video.`

- handle by video file and thumbnail inside multer.(inside video.routers)
- get video title and description from req.body
- check this title and description if not so give an error
- upload an cloudinary, check uploaded or not.
- get duration from this cloudinary response.
- get owner using req.user
- create video object.

> `11. get all video's`

- _page, limit, query, sortBy, sortType, userId_ get all things using **req.query**
- setup Pagination using page & limit.
- setup filters object using query & userID.(here use or operator between title, description, userID )
- sorting setup using sortBy & sortType.
- write query, and validate.
- send response.

> `12. get video by id`

- get videoID from req.params
- validate this videoID.
- find id inside video model
- send response.

> `13. update video`

- get videoID from req.params
- get video details like title, description, thumbnail from req.body.
- validate this videoID.
- update video details what provide by user.
- send response.

> `14. delete video`

- get videoID from req.params
- find and delete video
- send response

> `15. toggle publish status of video`

- get videoID from req.params
- check this ID is correct or not
- get video object and update **isPublished** valid to true or false

---

---

## playlist controller

---

> `16. create play list`

- get play-list name and description from req.body.
- validate this thing.
- create playlist object with name, description, and owner id
- send response.

> `17. get user's playlist`

- get userID from req.params
- validate this userID
- find this userID inside playlist model.
- send response

> `18. get playlist by it's id`

- get playlist id from req.params
- validate this id
- find this id inside playlist model
- send response

> `19. update playlist details`

- get playlist id from req.params and name, description from req.body
- validate playlist id and name, description
- get playlist using playlist id
- check current user and this playlist owner are same, if not so give error "can not modify"
- set name and description to playlist and save it
- send response.

> `20. delete playlist`

- get playlist id from req.params
- get playlist from mongoes
- check current user and this playlist owner are same, if not so give error "can not modify"
- delete playlist
- send response

> `21. add video inside playlist`

- get playlist id and videoId from req.params
- validate this playlist and video id.
- get playlist from model
- check current user and this playlist owner are same, if not so give error "can not modify"
- check Video already exists or not
- push video id inside video filed
- send response

> `22. remove video from playlist`

- get video and playlist id
- validate this playlist and video id.
- get playlist from model
- check current user and this playlist owner are same, if not so give error "can not modify"
- remove video id
- send response

---

---

## tweet controller

---

> `23. create Tweet`

- get content from req.body
- validate this data
- create tweet set content and owner using req.user.\_id
- send response

> `24. get tweet by user id`

- get user id from req.params
- validate this user id
- get all tweet based on this user id
- send response

> `25. update tweet`

- get content from req.body and get tweet id from req.params
- validate this content and tweet id
- get tweet object based on this tweet id
- check current user and this tweet owner are same, if not so give error "can not modify"
- change content for tweet
- send response

> `26. delete tweet`

- get tweet id from req.params
- validate this tweet id
- get tweet object based on tweet id
- check current user and this tweet owner are same, if not so give error "can not modify"
- delete tweet
- send response

---

---

## Comments controller

---

> `27. get video comments`

- get video id from params
- get page and limit from query
- validate video id
- find by video id inside comment
- send response

> `28. add comment to video`

- get video id from params and get content from req.body
- validate this id and content
- create comment object
- send response

> `29. update comment`

- get comment id from req.params and get content from req.body
- validate this id and content
- find comment based on id
- check current user and this comment owner are same, if not so give error "can not modify"
- change content of comment
- send response

> `30. delete comment`

- get video and comment id,
- validate this id's
- check current user and this comment owner are same, if not so give error "can not modify"
- delete this comment
- send response

---

---

## like controller

---

> `31. toggle like on video`

- get videoID from req.params
- validate this videoID
- get video object based on it's videoID
- find like object based on this videoID
- if found video id inside like object so delete this object
- else create like object with this videoID and user.\_id
- send response

> `32. toggle like on comment`

- get comment id from req.params
- validate this comment id
- get comment object based on this comment id
- find like object based on this comment id
- if found comment id inside like object so delete this object
- else create like object with this comment id and user.\_id
- send response

> `33. toggle like on tweet`

- get tweet id from req.params
- validate this tweet id
- get tweet object based on this tweet id
- find like object based on this tweet id
- if found tweet id inside like object so delete this object
- else create like object with this tweet id and user.\_id
- send response

> `34. get like videos by current user`

- get current user by req.user.\_id
- find likeBy by current user and video field exists
- send response

---

---

## Subscription controller

---

> `35. based on channel list-out user(subscriber).`

- get channel id from req.params
- validate this channel id
- find channel id from subscription model and channel field
- send response

> `36. toggle subscription`

- get channel id from req.params
- based on req.user.\_id find inside subscription model subscriber field
- if found any object so delete this object
- other which create new subscription object; subscriber : req.user.\_id and channel : channelId
- send response

> `37. based on userId list channel to subscribed`

- get user id from req.user.\_id
- find user id from subscription model subscriber field
- send response
