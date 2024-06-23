import  express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./passport/index.js";
import session from "express-session";
import logger from "./utils/logger.js";
import morgan from "morgan";


const app = express()

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
))
app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended: true, limit: "20kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// required for passport
app.use(
    session({
      secret: process.env.EXPRESS_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  ); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions


  // require for logger:
  const morganFormat = ':method :url :status :response-time ms';

app.use(morgan(morganFormat, {
  stream: {
    write: (message) => {
      const logObject = {
        method: message.split(' ')[0],        // Extract HTTP method
        url: message.split(' ')[1],           // Extract URL
        status: message.split(' ')[2],        // Extract status code
        responseTime: message.split(' ')[3],  // Extract response time

      };
      logger.info(JSON.stringify(logObject));
    }
  }
}));


import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';
import commentRouter from './routes/comment.routes.js';
import likeRouter from './routes/like.routes.js';
import followRouter from './routes/follow.routes.js';
import bookmarkRouter from './routes/bookMark.routes.js';


app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/blog-post", postRouter)
app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/like", likeRouter)
app.use("/api/v1/follow", followRouter)
app.use("/api/v1/bookmark", bookmarkRouter)


export{ app }