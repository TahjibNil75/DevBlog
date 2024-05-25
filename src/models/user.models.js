import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator";


const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
            minLength: [3, "Username must contain at least three characters"],
            maxLength: [30, "Username is too large"]
        },
        email: {
            type: String,
            validate: [validator.isEmail, "Please enter a valid email"],
            trim: true,
            lowercase: true,
            unique: true,
            required: [true, "Email address is required"],
        },
        firstName: {
            type: String,
            required: [true, "Please provide a first name"],
            index: true,
            minLength: [3, "Username must contain at least three characters"],
            maxLength: [30, "Username is too large"]
        },
        lastName:{
            type: String,
            index: true,
            minLength: [3, "Username must contain at least three characters"],
            maxLength: [30, "Username is too large"]
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            validate: {
              validator: (value) =>
                validator.isStrongPassword(value, {
                  minLength: 6,
                  minLowercase: 1,
                  minNumber: 1,
                  minUppercase: 1,
                  minSymbols: 1,
                }),
              message: 'Password {VALUE} is not strong enough.',
            },
          },
          role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
          },
          isBlocked: {
            type: Boolean,
            default: false
          },
          profilePicture: {type: String},
          refreshToken: { type: String}
    },
    {timestamps: true}
)

// only run if password is updated, otherwise it will change every time we update the user
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            isAdmin: this.isAdmin
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)