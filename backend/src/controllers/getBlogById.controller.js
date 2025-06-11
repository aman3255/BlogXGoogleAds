

const BlogModel = require('../models/blog.model');


const getBlogById = async (req, res) => {
    try {
        const { id } = req.params; // Blog post ID from URL

        // Validate the blog post ID format
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog post ID format"
            });
        }

        // Find the blog post by ID and populate author information
        const blogPost = await BlogModel.findById(id)
            .populate('author', 'username fullName')
            .select('-__v'); // Exclude version field

        if (!blogPost) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found"
            });
        }

        // Check if blog is published or if user is the author (for draft access)
        const currentUserId = req.user?.id; // Optional: might not be authenticated
        const isAuthor = currentUserId && blogPost.author._id.toString() === currentUserId;
        
        // Only show published blogs to non-authors, or all blogs to authors
        if (blogPost.status !== 'published' && !isAuthor) {
            return res.status(403).json({
                success: false,
                message: "This blog post is not available"
            });
        }

        // Increment view count (only for published blogs and non-authors)
        if (blogPost.status === 'published' && !isAuthor) {
            await BlogModel.findByIdAndUpdate(id, { 
                $inc: { views: 1 } 
            });
            blogPost.views += 1; // Update local object for response
        }

        // Response with blog post data
        res.status(200).json({
            success: true,
            message: "Blog post retrieved successfully",
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
        console.error("Error in getBlogById:", error);

        // Handle invalid ObjectId error
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid blog post ID"
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
    getBlogById
}