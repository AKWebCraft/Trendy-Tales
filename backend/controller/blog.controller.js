const Joi = require("joi");
const fs = require("fs");
const Blog = require("../models/blog.model");
const BlogDTO = require("../dto/blog.dto");
const BlogDetailsDTO = require("../dto/blog.details.dto");
const Comment = require("../models/comment.model");

const BACKEND_SERVER_PATH = "http://localhost:5000";

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const blogController = {
  // VALIDATING INPUT
  async create(req, res, next) {
    const createBlogSchema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string().regex(mongodbIdPattern).required(),
      content: Joi.string().required(),
      photo: Joi.string().required(),
    });

    const { error } = createBlogSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { title, author, content, photo } = req.body;

    // SAVING BLOG IN DATABASE
    let newBlog;
    try {
      newBlog = new Blog({
        title,
        author,
        content,
        photo,
      });

      await newBlog.save();
    } catch (error) {
      return next(error);
    }

    const blogDto = new BlogDTO(newBlog);

    return res.status(201).json({ blog: blogDto });
  },

  // CONTROLLER TO GET ALL BLOGS
  async getAll(req, res, next) {
    try {
      const blogs = await Blog.find({});

      const blogsDto = [];

      for (i = 0; i < blogs.length; i++) {
        const dto = new BlogDTO(blogs[i]);
        blogsDto.push(dto);
      }

      return res.status(200).json({ blogs: blogsDto });
    } catch (error) {
      return next(error);
    }
  },

  async getById(req, res, next) {
    const getByIdSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattern).required(),
    });

    const { error } = getByIdSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    let blog;

    const { id } = req.params;

    try {
      blog = await Blog.findOne({ _id: id }).populate("author");
    } catch (error) {
      return next(error);
    }

    const blogDto = new BlogDetailsDTO(blog);

    return res.status(200).json({ blog: blogDto });
  },

  // CONTROLLER TO UPDATE BLOG

  async update(req, res, next) {
    const updateBlogSchema = Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
      author: Joi.string().regex(mongodbIdPattern).required(),
      blogId: Joi.string().regex(mongodbIdPattern).required(),
      photo: Joi.string(),
    });

    const { error } = updateBlogSchema.validate(req.body);

    const { title, content, author, blogId, photo } = req.body;

    try {
      await Blog.updateOne(
        { _id: blogId },
        { title, content, photo, author },
        { new: true }
      );
    } catch (error) {
      return next(error);
    }

    return res.status(200).json({ message: "blog updated!" });
  },

  // CONTROLLER TO DELETE BLOG
  async delete(req, res, next) {
    const deleteBlogSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattern).required(),
    });

    const { error } = deleteBlogSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    const { id } = req.params;

    // DELETE BLOG
    // DELETE COMMENTS
    try {
      await Blog.deleteOne({ _id: id });

      await Comment.deleteMany({ blog: id });
    } catch (error) {
      return next(error);
    }

    return res.status(200).json({ message: "blog deleted" });
  },
};

module.exports = blogController;
