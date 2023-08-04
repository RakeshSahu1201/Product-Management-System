require("./db/MongoConnection");
const User = require("./models/User");
const Product = require("./models/Product");
const express = require("express");
const cors = require("cors");
const Jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");

const port = process.env.PORT || 8000;
const jwtKey = "e-com";
const app = express();

app.use(cors());
app.use("/profile", express.static("src/image"));

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "./src/image/");
  },
  filename: (req, file, cd) => {
    cd(null, `${req.headers["userid"]}.${file.originalname.split(".")[1]}`);
  },
});

const profile = multer({ storage: storage }).single("profile");

app.use(express.json());

// removing cors error 1 ways :

// removing cors problem 2  ways
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });

app.post("/register", async (req, res) => {
  let user = User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (error, token) => {
    if (error) {
      res.send({ error: "something went wrong , can't generate the token." });
    } else {
      res.send({ result, auth: token });
    }
  });
});

app.post("/login", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.send({ result: "No user found." });
  } else {
    let result = await User.findOne(req.body).select("-password");

    if (result) {
      Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (error, token) => {
        if (error) {
          res.send({
            error: "something went wrong , can't generate the token.",
          });
        } else {
          res.send({ result, auth: token });
        }
      });
    } else {
      res.send({ result: "No user found" });
    }
  }
});

app.post("/products", verifyToken, async (req, res) => {
  const product = Product(req.body);
  let result = await product.save();

  res.send(result);
});

app.get("/products", verifyToken, async (req, res) => {
  let userId = req.headers["userid"];

  const product = await Product.find({ userId });
  if (product) res.send(product);
  else {
    res.send("no data found");
  }
});

app.delete("/products/:id", verifyToken, async (req, res) => {
  try {
    let result = await Product.deleteOne({ _id: req.params.id });
    res.send(result);
  } catch (error) {
    res.send({
      acknowledged: true,
      deletedCount: 0,
    });
  }
});

app.get("/products/:id", verifyToken, async (req, res) => {
  try {
    let result = await Product.findOne({ _id: req.params.id });
    res.send(result);
  } catch (error) {
    res.send({ result: "record not found." });
  }
});

app.put("/products/:id", verifyToken, async (req, res) => {
  try {
    let result = await Product.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: req.body,
      }
    );
    res.send(result);
  } catch (error) {
    res.send({ result: "could not update " + error });
  }
});

app.get("/products/search/:key", verifyToken, async (req, res) => {
  const userId = req.headers["userid"];
  try {
    let result = await Product.find({
      userId,
      $or: [
        {
          name: { $regex: req.params.key },
        },
        {
          price: { $regex: req.params.key },
        },
      ],
    });
    res.send(result);
  } catch (error) {
    res.send({ result: "No data found" + error });
  }
});

app.get("/users", verifyToken, async (req, res) => {
  try {
    const userId = req.headers["userid"];
    let result = await User.findOne({ _id: userId });
    res.send(result);
  } catch (error) {
    res.send({ error: "No user found" });
  }
});

app.put("/users", verifyToken, async (req, res) => {
  try {
    const userId = req.headers["userid"];
    let result = await User.updateOne(
      { _id: userId },
      {
        $set: req.body,
      }
    );
    res.send(result);
  } catch (error) {
    res.send({ error: "No user found" });
  }
});

app.post("/upload-profile", verifyToken, (req, res) => {
  console.log("get the response");
  profile(req, res, (error) => {
    if (error) res.send({ error });
    else {
      console.log(req.file);
      res.send({ result: "file uploaded successfully", data: req.file });
    }
  });
});

app.get("/profile", verifyToken, (req, res) => {
  const id = req.headers["id"];
  const file = `profile/${id}.${"jpg" || "png"}`;
  console.log(file);
  res.send({ result: file });
});

app.listen(port, () => {
  console.log("server is listing.");
});

function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    Jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        res.send({ result: "please provide valid token." });
      } else {
        next();
      }
    });
  } else {
    res.send({ result: "please add token with header" });
  }
}
