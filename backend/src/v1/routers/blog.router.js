const express = require('express');

const { createBlogPost,updateBlogPost, deleteBlogPost } = require('../../controllers/blog.controller');

const blogRouter = express.Router();

blogRouter.post('/create', createBlogPost);
blogRouter.put('/update/:id', updateBlogPost);
blogRouter.delete('/delete/:id', deleteBlogPost);

module.exports = blogRouter;