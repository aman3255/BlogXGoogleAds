const BlogModel = require('../models/blog.model');


const deleteBlogPost = async (req, res) => {
    try {
        const { id } = req.params; // Blog post ID from URL
        const currentUserId = req.user.id; // Get current user ID from auth middleware

        // Validate the blog post ID format
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog post ID format"
            });
        }

        // Find the blog post first to check if it exists and get author info
        const blogPost = await BlogModel.findById(id);
        
        if (!blogPost) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found"
            });
        }

        // Check if the current user is the author of the blog post
        if (blogPost.author.toString() !== currentUserId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this blog post"
            });
        }

        // Delete the blog post
        await BlogModel.findByIdAndDelete(id);

        // Response with success message
        res.status(200).json({
            success: true,
            message: "Blog post deleted successfully",
            deletedBlog: {
                id: blogPost._id,
                title: blogPost.title,
                slug: blogPost.slug,
                deletedAt: new Date()
            }
        });

    } catch (error) {
        console.error("Error in deleteBlogPost:", error);

        // Handle invalid ObjectId error
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid blog post ID"
            });
        }

        // Handle other database errors
        if (error.name === 'MongoServerError') {
            return res.status(500).json({
                success: false,
                message: "Database error occurred while deleting blog post"
            });
        }

        // Handle other errors
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    deleteBlogPost
};