// src/models/blog.model.js

const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: { // Slug = SEO + Human-Friendly + Clean URLs + Easy Fetching.
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Blog content is required'],
    minlength: [100, 'Content must be at least 50 characters']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    trim: true
  },
  photo: {
    type: String, 
    default: null,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth', 
    required: true,
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(tags) {
        return tags.length <= 10; // Max 10 tags
      },
      message: 'Cannot have more than 10 tags'
    }
  },
  category: {
    type: String,
    enum: ['Technology', 'Business', 'Health', 'Lifestyle', 'Education', 'Travel', 'Food', 'Sports', 'Entertainment', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  readTime: {
    type: Number, // in minutes
    default: 1
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  // For SEO and social sharing
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  // For Google Ads integration
  adSettings: {
    showAds: {
      type: Boolean,
      default: true
    },
    adPlacement: {
      type: [String],
      enum: ['top', 'middle', 'bottom', 'sidebar'],
      default: ['top', 'bottom']
    }
  }
}, {
  timestamps: true
});

// Create slug from title before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .trim();
  }
  
  // Calculate read time (average 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  
  next();
});

// Indexes for better query performance
blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ status: 1, createdAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ slug: 1 }, { unique: true });

const BlogModel = mongoose.model('Blog', blogSchema);
module.exports = BlogModel;

