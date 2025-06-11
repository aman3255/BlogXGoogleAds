
const BlogModel = require('../models/blog.model');


const getBlogForEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id; // Required authentication

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog post ID format"
            });
        }

        const blogPost = await BlogModel.findById(id)
            .populate('author', 'username fullName')
            .select('-__v');

        if (!blogPost) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found"
            });
        }

        // Only author can access for editing
        if (blogPost.author._id.toString() !== currentUserId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to edit this blog post"
            });
        }

        // Don't increment views for editing
        res.status(200).json({
            success: true,
            message: "Blog post retrieved for editing",
            blog: {
                id: blogPost._id,
                title: blogPost.title,
                slug: blogPost.slug,
                content: blogPost.content,
                excerpt: blogPost.excerpt,
                photo: blogPost.photo,
                author: {
                    id: blogPost.author._id,
                    username: blogPost.author.username,
                    fullName: blogPost.author.fullName
                },
                tags: blogPost.tags,
                category: blogPost.category,
                status: blogPost.status,
                views: blogPost.views,
                likes: blogPost.likes,
                metaDescription: blogPost.metaDescription,
                adSettings: blogPost.adSettings,
                createdAt: blogPost.createdAt,
                updatedAt: blogPost.updatedAt
            }
        });

    } catch (error) {
        console.error("Error in getBlogForEdit:", error);

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
    getBlogForEdit
}