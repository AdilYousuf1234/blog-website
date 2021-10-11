//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://admin:admin@cluster0.lp6fm.mongodb.net/postsDB");

const homeStartingContent = "You want to whip your blog into shape. You want to level-up your list. You want a serious social media presence.";
const aboutContent = "A living network of curious minds !";
const postSchema = mongoose.Schema({
  title: {
    type: "String",
    required: [true,'Title Required']
  },
  content: String
});

const Post = mongoose.model("Post",postSchema);
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/",function (req,res) {
  let postsArray = [];
  Post.find(function (err, posts) {
    if (err) {
      console.log(err);
    } else {
      posts.forEach(function (post) {
        postsArray.push(post);
      });
    }
    res.render("home", {
      homeStart: homeStartingContent,
      posts: postsArray
    });
  });
});

app.get("/posts/:postTitle",function (req,res){
  let postsArray;
  postsArray = [];
  Post.find(function (err, posts) {
    if (err) {
      console.log(err);
    } else {
      posts.forEach(function (post) {
        postsArray.push(post);
      });
    }
  postsArray.forEach(function (post){
    if(_.lowerCase(req.params.postTitle) === _.lowerCase(post.title)){
      res.render("post",{post: post});
    }
    else{
      console.log("Match Not Found");
    }
    });
  });
});

app.get("/about",function (req,res){
  res.render("about",{aboutStart: aboutContent});
});

app.get("/contact",function (req,res){
  res.render("contact");
});

app.get("/compose",function (req,res){
  res.render("compose");
});

app.post("/compose",function (req,res){
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  Post.insertMany([post],function (err){
    if(err){
      console.log(err);
    }
  });
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started");
});
