import { asyncHandler } from "../utils/asynHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
   //get user details from frontend
   //validation - not empty
   //check if user already exists : username, email
   //check for image ,check for avtar
   //upload them to cloudinary, avatar
   //create user object- create entry in db
   //remove password and refresh token field from response
   //check for user creation 
   //retrun res

   //get user details from frontend
   const { fullName, email, username, password } = req.body
   console.log("email:", email);

   //validation - not empty
   if (
      [fullName, email, username, password].some((field) =>
         field?.trim() === "")
   ) {
      throw new ApiError(400, "all fileds required");
   }

   //check if user already exists : username, email
   const existedUser = User.findOne({
      $or: [{ username }, { email }]
   })
   if (existedUser) {
      throw new ApiError(409, "User with email and username exist")
   }

   //check for image ,check for avtar
   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if (!avatarLocalPath) {
      throw new ApiError(400, "avatar is must requred");
   }

   //upload them to cloudinary, avatar
   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if (!avatar) {
      throw new ApiError(400, "avatar is must requred");
   }

   //create user object- create entry in db
   const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase()
   })

   //remove password and refresh token field from response
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )

   //check for user creation 
   if (!createdUser) {
      throw new ApiError(500, "Somthing went wrong to register user")
   }

   //retrun res
   return res.status(201).json(
      new ApiResponse(200, createdUser, "User register Successfully")
   )


})

export { registerUser, }