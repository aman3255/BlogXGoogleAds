const express = require('express');

const { createBlogPost } = require('../../controllers/createBlogPost.controller'); // createBlogPost controller
const { updateBlogPost } = require('../../controllers/updateBlogPost.controller'); // updateBlogPost controller
const { deleteBlogPost } = require('../../controllers/deleteBlogPost.conroller'); // deleteBlogPost controller
const { softDeleteBlogPost } = require('../../controllers/softDeleteBlogPost.controller'); // softDeleteBlogPost controller
const { getBlogById } = require('../../controllers/getBlogById.controller'); // getBlogById controller
const { getBlogBySlug } = require('../../controllers/getBlogBySlug.controller'); // getBlogBySlug controller
const { getBlogForEdit } = require('../../controllers/getBlogForEdit.controller'); // getBlogForEdit controller
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