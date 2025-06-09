const express = require('express');

const { createBlogPost, updateBlogPost, deleteBlogPost, getBlogById, softDeleteBlogPost, getBlogBySlug, getBlogForEdit } = require('../../controllers/blog.controller');
const { authMiddleware, optionalAuth } = require('../../middleware/auth.middleware')
const { blogValidationMiddleware } = require('../../middleware/validation.middleware')


const blogRouter = express.Router();

blogRouter.post('/create', authMiddleware, blogValidationMiddleware('createBlog'), createBlogPost);
blogRouter.put('/update/:id', authMiddleware, blogValidationMiddleware('updateBlog'), updateBlogPost);
blogRouter.delete('/delete/:id', authMiddleware, deleteBlogPost);
blogRouter.patch('/:id/archive', authMiddleware, softDeleteBlogPost);
blogRouter.patch('/:id', optionalAuth, getBlogById);
blogRouter.get('/:slug', optionalAuth, getBlogBySlug);
blogRouter.get('/:id/edit', authMiddleware, getBlogForEdit);

module.exports = blogRouter;