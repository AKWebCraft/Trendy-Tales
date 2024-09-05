const express = require("express");
const authController = require("../controller/auth.controller");
const auth = require("../middlewares/auth");
const blogController = require("../controller/blog.controller");
const commentController = require("../controller/comment.controller");

const router = express.Router();

// // AUTH ROUTES

// REGISTER
router.post("/register", authController.register);

// LOGIN
router.post("/login", authController.login);

// LOGOUT
router.post("/logout", auth, authController.logout);

// REFRESH
router.get("/refresh", authController.refresh);

// // BLOG ROUTES

 // CREATE BLOG
router.post("/blog", auth, blogController.create);

// GET ALL BLOGS
router.get("/blog/all", blogController.getAll);

// GET BLOG BY ID
router.get("/blog/:id", auth, blogController.getById);

// UPDATE BLOG
router.put("/blog", auth, blogController.update);

// DELETE BLOG
router.delete("/blog/:id", auth, blogController.delete);

// // COMMENT ROUTES

// CREATE COMMENT
router.post("/comment", auth, commentController.create);

// GET COMMENTS
router.get("/comment/:id", auth, commentController.getById);

module.exports = router;
