const express = require('express');

const { createBlogPost,updateBlogPost, deleteBlogPost, getBlogById } = require('../../controllers/blog.controller');

const blogRouter = express.Router();

blogRouter.post('/create', createBlogPost);
blogRouter.patch('/update/:id', getBlogById);
blogRouter.put('/update/:id', updateBlogPost);
blogRouter.delete('/delete/:id', deleteBlogPost);

module.exports = blogRouter;