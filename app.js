import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import alert from "alert";
import ejs from "ejs";
import _ from "lodash";
import "dotenv/config";

const text1 = {
  title: "text1",
  content:
    "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
};

const text2 = {
  title: "text2",
  content:
    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
};

const text3 = {
  title: "text3",
  content:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
};

const { Schema } = mongoose;
const app = express();
const port = 8000;
const userDB = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
const nameDB = process.env.MONGODB_NAME;
const collectionDB = process.env.MONGODB_COLLECTION;

const blogSchema = new Schema({
  title: String,
  author: String,
  content: String,
  date: Date,
});

async function connectDB(req, res, next) {
  const url = `mongodb+srv://${userDB}:${password}@${nameDB}.reaw3ux.mongodb.net/${collectionDB}`;

  try {
    mongoose.connect(url);
    console.log("Successful connect to DB");
    next();
  } catch (err) {
    console.error(err);
  }
}

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(connectDB);

app.get("/", async (req, res) => {
  let data = [];

  const Post = mongoose.model("Post", blogSchema, "posts");

  data = await Post.find();

  res.render("home", { arr: data });
});

app.get("/about", (req, res) => {
  res.render("about", { text2: text2 });
});

app.get("/contact", (req, res) => {
  res.render("contact", { text3: text3 });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", async (req, res) => {
  const { title, author, userText } = req.body;

  const Post = mongoose.model("Post", blogSchema, "posts");

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const today = `${day}-${month}-${year}`;

  const newPost = new Post({
    title: title,
    author: author,
    content: userText,
    date: date,
  });

  await newPost.save();

  res.redirect("/");
});

app.get("/posts/:post", async (req, res) => {
  const Post = mongoose.model("Post", blogSchema, "posts");

  const result = await Post.findOne({ title: req.params.post });

  if (result !== null) {
    res.render("post", { result: result });
  }
});

app.get("/delete/:post", async (req, res) => {
  const Post = mongoose.model("Post", blogSchema, "posts");

  const result = await Post.findOneAndDelete({ title: req.params.post });

  if (result !== null) {
    alert("Successfuly deleted post!");
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server is running at: ${port} port.`);
});
