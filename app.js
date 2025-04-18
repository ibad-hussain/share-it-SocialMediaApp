// Import Modules
const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require("dotenv").config();



// Import the created models/collections "users" and "posts"
const userModel = require('./models/user');
const postModel = require('./models/post');



// Setting up ejs as view engine
app.set("view engine", "ejs");



// Setting up parsers for form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Setting up a middleware for accessing public static files
app.use(express.static(path.join(__dirname, "public")));



// Use the cookie-parser middleware
app.use(cookieParser());



// Import 'multerconfig.js' and 'mongodb.js'
const upload = require('./config/multerconfig');
const connectDB = require("./config/mongodb");



// App configuration details
const port = process.env.PORT || 4000;
connectDB();



// Middleware 'isLoggedIn' for protected routes to check whether the user is logged in (and only then access to the protected routes will be given), rendering 'logged.ejs' if user not logged in
function isLoggedIn(req, res, next) {
    if (req.cookies.token === "") {
        res.render("logged");
    }
    else {
        let data = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        req.user = data;
        next();
    }
};



// Middleware 'isLoggedInFeed' for user. If user not logged in render 'create.ejs', If user logged in redirect to '/feed' route
function isLoggedInFeed(req, res, next) {
    // Check if token is missing or empty
    if (!req.cookies.token) {
        res.render("create");
    } else {
        try {
            // Try to verify the token if present
            let data = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            req.user = data;
            next();
        } catch (error) {
            // If token verification fails (e.g., invalid token)
            res.render("error");
        }
    }
};



// Create a '/' route to redirect to '/feed' route (if logged in), otherwise render 'create.ejs' and for 2 form submissions. Used middleware 'isLoggedInFeed'
app.get("/", isLoggedInFeed, (req, res) => {
    res.redirect("/feed");
});



// Create a '/feed' route to render 'feed.ejs'. Used Middleware 'isLoggedIn'
app.get("/feed", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    let users = await userModel.find();
    let posts = await postModel.find();
    res.render("feed", { user, users, posts });
});



// Create a '/profile/userid' route to render 'profile.ejs' for current user. Used Middleware 'isLoggedIn'
app.get("/profile/:userid", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("posts");
    res.render("profile", { user });
});



// Create a '/feed/like/postid' route to like posts on the feed, redirecting to '/feed' route. Used Middleware 'isLoggedIn'
app.get("/feed/like/:postid", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.postid }).populate("user");

    if (post.likes.indexOf(req.user.userid) === -1) {
        post.likes.push(req.user.userid);
    }
    else {
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }

    await post.save();
    res.redirect("/feed");
});



// Create a '/post' route to create posts using form submission, redirecting to '/profile/userid' route. Used Middleware 'isLoggedIn'
app.post("/post", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });

    let { content } = req.body;
    let post = await postModel.create({
        content,
        user: user._id
    });
    user.posts.push(post._id);
    await user.save();

    res.redirect(`/profile/${user._id}`);
});



// Create a '/like/postid' route to like posts on the profile, redirecting to '/profile/userid' route. Used Middleware 'isLoggedIn'
app.get("/like/:postid", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.postid }).populate("user");

    if (post.likes.indexOf(req.user.userid) === -1) {
        post.likes.push(req.user.userid);
    }
    else {
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }

    await post.save();
    res.redirect(`/profile/${req.user.userid}`);
});



// Create a '/edit/postid' route to render 'edit-post.ejs'. Used Middleware 'isLoggedIn'
app.get("/edit/:postid", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.postid }).populate("user");
    res.render("edit-post", { post });
});



// Create a '/save/postid' route to edit post using form submission, redirecting to '/profile/userid' route. Used Middleware 'isLoggedIn'
app.post("/save/:postid", isLoggedIn, async (req, res) => {
    let post = await postModel.findOneAndUpdate({ _id: req.params.postid }, { content: req.body.content });
    res.redirect(`/profile/${req.user.userid}`);
});



// Create a '/delete/postid' route to render 'delete-post.ejs'. Used Middleware 'isLoggedIn'
app.get("/delete/:postid", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.postid }).populate("user");
    res.render("delete-post", { post });
});



// Create a '/delete/postid' route to delete post using form submission, redirecting to '/profile/userid' route. Used Middleware 'isLoggedIn'
app.post("/delete/:postid", isLoggedIn, async (req, res) => {
    let post = await postModel.findOneAndDelete({ _id: req.params.postid });
    res.redirect(`/profile/${req.user.userid}`);
});



// Create a '/keep/postid' route to keep(no delete) redirecting to '/profile/userid' route. Used Middleware 'isLoggedIn'
app.post("/keep/:postid", isLoggedIn, async (req, res) => {
    res.redirect(`/profile/${req.user.userid}`);
});



// Create a '/edit-profile/userid' route to render 'edit-profile.ejs'. Used Middleware 'isLoggedIn'
app.get("/edit-profile/:userid", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    res.render("edit-profile", { user });
});



// Create a '/edit-profile/userid' route to edit profile details using form submission, used 'multer' for file (profilepic) submission, redirecting to '/profile/userid' route. Used Middleware 'isLoggedIn'
app.post("/edit-profile/:userid", isLoggedIn, upload.single("profilepic"), async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });

    if (req.file) {
        user.profilepic = req.file.filename;
    }
    await user.save();

    // if(!(user.profilepic === "default.jpg")) {
    //     fs.copyFile(`./public/uploads/${req.file.filename}`, `./public/profile pics/${user.email}/${req.file.filename}`, function(err) {
    //         if(err) console.error(err);
    //     });
    // };

    let { username, name, age } = req.body;
    await userModel.findOneAndUpdate({ _id: req.params.userid }, { username, name, age }, { new: true });

    res.redirect(`/profile/${req.user.userid}`);
});



// Create a '/show/profile/userid' route to render 'show.ejs' for clicked user (showing clicked user's profile page). Used Middleware 'isLoggedIn'
app.get("/show/profile/:userid", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ _id: req.params.userid }).populate("posts");
    res.render("show", { user, myid: req.user.userid });
});



// Create a '/show/profile/like/postid' route to like posts on the clicked user's profile, redirecting to '/show/profile/userid' route. Used Middleware 'isLoggedIn'
app.get("/show/profile/like/:postid", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.postid }).populate("user");

    if (post.likes.indexOf(req.user.userid) === -1) {
        post.likes.push(req.user.userid);
    }
    else {
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }

    await post.save();
    res.redirect(`/show/profile/${post.user._id.toString()}`);
});



// Create a '/register' route to create user using form submission, Also creating hash from the password using bcrypt, Also setting cookie using jwt, Also creating a user folder (name=user.email) for profile pic record, redirecting to '/feed' route
app.post("/register", async (req, res) => {
    let { username, name, email, password, age } = req.body;
    let user = await userModel.findOne({ email });
    if (user) return res.render("error");

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                username,
                name,
                email,
                password: hash,
                age
            });

            let token = jwt.sign({ email: email, userid: user._id }, process.env.JWT_SECRET);
            res.cookie("token", token, {
                httpOnly: true,
            });
            res.redirect("/feed");
        });
    });

    // fs.mkdir(`./public/profile pics/${email}`, function(err) {
    //     if(err) console.error(err);
    // });
});



// Create a '/login' to login in the account (previously created) checking email and password to be correct from the database, Also setting cookie using jwt, Also rendering 'error.ejs' if email/password is wrong, redirecting to '/feed' route
app.post("/login", async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) return res.render("error");

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            let token = jwt.sign({ email: email, userid: user._id }, process.env.JWT_SECRET);
            res.cookie("token", token, {
                httpOnly: true,
            });
            res.redirect("/feed");
        }
        else res.render("error");
    });
});



// Create a '/logout' route to get logout from the account, Also resetting the cookie to none, redirecting to '/' route
app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/");
});



// Extra practice routes

app.get("/users", async (req, res) => {
    let users = await userModel.find();
    res.send(users);
});

app.get("/posts", async (req, res) => {
    let users = await postModel.find();
    res.send(users);
});



// Setup port for server
app.listen(port, () => console.log(`Server started on port: ${port}`));
