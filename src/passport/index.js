import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.models.js";
import { UserLoginType } from "../constants.js";
import { ApiError } from "../utils/apiError.js";



try {
    /*
    @purpose: This method is called when a user logs in
    */
    passport.serializeUser((user, next) => {
        next(null, user._id)
    })
    /*
    @purpose: This method is called on every request that requires authentication after the user has logged in
    */
    passport.deserializeUser(async(id, next) => {
        const user = await User.findById(id)
        if (!user){
            // If the user does not exist, pass an error to the next middleware
            next(new ApiError(
                404,
                "User does not exist"
            ), null)
        }else {
            next(null, user) // When null is passed as the first argument, it indicates that there is no error. The second argument, user, is the result of the successful operation (i.e., the found user object).
        }
    })
} catch (error) {
    throw new ApiError(500, "Something went wrong while deserializing the user")
}

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (_, __, profile, next) => {
            const user = await User.findOne({
                email: profile._json.email
            })
            if (user){
                if (user.loginType !== UserLoginType.GOOGLE){
                    // If user is registered with some other method, we will ask him/her to use the same method as registered.
                    next(
                        new ApiError(
                            400,
                            "You have previously registered using " + 
                            user.loginType?.toLowerCase()?.split("_").join(" ") +
                            ". Please use the " +
                            user.loginType?.toLowerCase()?.split("_").join(" ") +
                            " Login option to access your account"
                        ), null
                    );
                }else {
                    // If user is registered with the same login method we will send the saved user
                    next (null, user)
                }
            } else {
                const createUser = await User.create({
                    email: profile._json.email,
                    password: profile._json.sub, // Set user's password as sub (coming from the google)
                    username: profile._json.email?.split("@")[0], // as email is unique, this username will be unique
                    loginType: UserLoginType.GOOGLE,
                    profilePicture: {
                        url: profile._json.picture,
                        localPath: "",
                    }
                })
                if (createUser){
                    next(null, createUser)
                }else {
                    next(
                        new ApiError (500, "Error while registering the user"), null
                    )
                }
            }
        }
    )
)