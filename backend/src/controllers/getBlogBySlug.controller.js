
const BlogModel = require('../models/blog.model');



const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params; // Blog slug from URL

        // Validate slug
        if (!slug || slug.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Blog slug is required"
            });
        }

        // Find the blog post by slug and populate author information
        const blogPost = await BlogModel.findOne({ slug: slug.toLowerCase() })
            .populate('author', 'username fullName')
            .select('-__v');

        if (!blogPost) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found"
            });
        }

        // Check if blog is published or if user is the author
        const currentUserId = req.user?.id;
        const isAuthor = currentUserId && blogPost.author._id.toString() === currentUserId;
        
        if (blogPost.status !== 'published' && !isAuthor) {
            return res.status(403).json({
                success: false,
                message: "This blog post is not available"
            });
        }

        // Increment view count (only for published blogs and non-authors)
        if (blogPost.status === 'published' && !isAuthor) {
            await BlogModel.findByIdAndUpdate(blogPost._id, { 
                $inc: { views: 1 } 
            });
            blogPost.views += 1;
        }

        // Response
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
        console.error("Error in getBlogBySlug:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    getBlogBySlug
}
