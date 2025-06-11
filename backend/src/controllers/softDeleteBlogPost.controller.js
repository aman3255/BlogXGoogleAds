const BlogModel = require('../models/blog.model');


// Alternative: Soft delete function (marks as deleted instead of removing)
const softDeleteBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id;

        // Validate the blog post ID format
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog post ID format"
            });
        }

        // Find and update the blog post status to 'archived'
        const blogPost = await BlogModel.findById(id);
        
        if (!blogPost) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found"
            });
        }

        // Check authorization
        if (blogPost.author.toString() !== currentUserId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this blog post"
            });
        }

        // Update status to archived instead of deleting
        const updatedBlog = await BlogModel.findByIdAndUpdate(
            id,
            { status: 'archived' },
            { new: true }
        ).populate('author', 'username fullName');

        res.status(200).json({
            success: true,
            message: "Blog post archived successfully",
            blog: {
                id: updatedBlog._id,
                title: updatedBlog.title,
                slug: updatedBlog.slug,
                status: updatedBlog.status,
                author: {
                    id: updatedBlog.author._id,
                    username: updatedBlog.author.username,
                    fullName: updatedBlog.author.fullName
                },
                updatedAt: updatedBlog.updatedAt
            }
        });

    } catch (error) {
        console.error("Error in softDeleteBlogPost:", error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid blog post ID"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    softDeleteBlogPost
}