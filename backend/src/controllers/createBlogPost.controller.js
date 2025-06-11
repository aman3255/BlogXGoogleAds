const BlogModel = require('../models/blog.model');

const createBlogPost = async (req, res) => {
    try {
        const {
            title,
            content,
            excerpt,
            photo,
            tags,
            category,
            status,
            metaDescription,
            adSettings
        } = req.body;

        // Basic validation
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        // Get author from authenticated user (assuming authMiddleware sets req.user)
        const author = req.user.id;

        // Prepare blog data
        const blogData = {
            title: title.trim(),
            content,
            author,
            ...(excerpt && { excerpt: excerpt.trim() }), // Optional field
            ...(photo && { photo }), // Optional field
            ...(tags && { tags: Array.isArray(tags) ? tags : [tags] }), // Ensure tags is array
            ...(category && { category }),
            ...(status && { status }),
            ...(metaDescription && { metaDescription: metaDescription.trim() }),
            ...(adSettings && { adSettings })
        };

        // Create new blog post
        const newBlog = new BlogModel(blogData);
        await newBlog.save();

        // Populate author information for response
        await newBlog.populate('author', 'username fullName');

        // Response
        res.status(201).json({
            success: true,
            message: "Blog post created successfully",
            blog: {
                id: newBlog._id,
                title: newBlog.title,
                slug: newBlog.slug,
                content: newBlog.content,
                excerpt: newBlog.excerpt,
                photo: newBlog.photo,
                author: {
                    id: newBlog.author._id,
                    username: newBlog.author.username,
                    fullName: newBlog.author.fullName
                },
                tags: newBlog.tags,
                category: newBlog.category,
                status: newBlog.status,
                views: newBlog.views,
                likes: newBlog.likes,
                metaDescription: newBlog.metaDescription,
                adSettings: newBlog.adSettings,
                createdAt: newBlog.createdAt,
                updatedAt: newBlog.updatedAt
            }
        });

    } catch (error) {
        console.error("Error in createBlogPost:", error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            });
        }

        // Handle duplicate slug error
        if (error.code === 11000 && error.keyPattern && error.keyPattern.slug) {
            return res.status(409).json({
                success: false,
                message: "Blog post with this title already exists. Please choose a different title."
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
    createBlogPost
}