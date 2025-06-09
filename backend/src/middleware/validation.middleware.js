const validationMiddleware = (validationType) => {
    return (req, res, next) => {
        try {
            const errors = [];

            switch (validationType) {
                case 'signup':
                    // Username validation
                    if (!req.body.username) {
                        errors.push('Username is required');
                    } else {
                        const username = req.body.username.trim();
                        if (username.length < 3) {
                            errors.push('Username must be at least 3 characters long');
                        }
                        if (username.length > 20) {
                            errors.push('Username cannot exceed 20 characters');
                        }
                        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                            errors.push('Username can only contain letters, numbers, and underscores');
                        }
                        req.body.username = username; // Update with trimmed value
                    }

                    // Full name validation
                    if (!req.body.fullName) {
                        errors.push('Full name is required');
                    } else {
                        const fullName = req.body.fullName.trim();
                        if (fullName.length < 2) {
                            errors.push('Full name must be at least 2 characters long');
                        }
                        if (fullName.length > 50) {
                            errors.push('Full name cannot exceed 50 characters');
                        }
                        if (!/^[a-zA-Z\s]+$/.test(fullName)) {
                            errors.push('Full name can only contain letters and spaces');
                        }
                        req.body.fullName = fullName; // Update with trimmed value
                    }

                    // Password validation for signup
                    if (!req.body.password) {
                        errors.push('Password is required');
                    } else {
                        const password = req.body.password;
                        if (password.length < 6) {
                            errors.push('Password must be at least 6 characters long');
                        }
                        if (password.length > 128) {
                            errors.push('Password cannot exceed 128 characters');
                        }
                        // Check for at least one letter and one number
                        if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
                            errors.push('Password must contain at least one letter and one number');
                        }
                    }
                    break;

                case 'signin':
                    // Username validation for signin
                    if (!req.body.username) {
                        errors.push('Username is required');
                    } else {
                        req.body.username = req.body.username.trim();
                    }

                    // Password validation for signin
                    if (!req.body.password) {
                        errors.push('Password is required');
                    }
                    break;

                default:
                    errors.push('Invalid validation type');
                    break;
            }

            // If there are validation errors, return them
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors
                });
            }

            // If validation passes, continue to next middleware/controller
            next();

        } catch (error) {
            console.error('Error in validationMiddleware:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error during validation'
            });
        }
    };
};


const blogValidationMiddleware = (validationType) => {
    return (req, res, next) => {
        try {
            const errors = [];

            switch (validationType) {
                case 'createBlog':
                    // Title validation
                    if (!req.body.title) {
                        errors.push('Title is required');
                    } else {
                        const title = req.body.title.trim();
                        if (title.length < 5) {
                            errors.push('Title must be at least 5 characters long');
                        }
                        if (title.length > 200) {
                            errors.push('Title cannot exceed 200 characters');
                        }
                        req.body.title = title;
                    }

                    // Content validation
                    if (!req.body.content) {
                        errors.push('Content is required');
                    } else {
                        if (req.body.content.length < 100) {
                            errors.push('Content must be at least 100 characters long');
                        }
                    }

                    // Excerpt validation (optional)
                    if (req.body.excerpt) {
                        const excerpt = req.body.excerpt.trim();
                        if (excerpt.length > 300) {
                            errors.push('Excerpt cannot exceed 300 characters');
                        }
                        req.body.excerpt = excerpt;
                    }

                    // Tags validation (optional)
                    if (req.body.tags) {
                        if (!Array.isArray(req.body.tags)) {
                            req.body.tags = [req.body.tags]; // Convert single tag to array
                        }
                        if (req.body.tags.length > 10) {
                            errors.push('Cannot have more than 10 tags');
                        }
                        // Clean up tags
                        req.body.tags = req.body.tags.map(tag => tag.trim()).filter(tag => tag.length > 0);
                    }

                    // Category validation (optional)
                    if (req.body.category) {
                        const validCategories = [
                            'Technology', 'Business', 'Health', 'Lifestyle', 
                            'Education', 'Travel', 'Food', 'Sports', 
                            'Entertainment', 'Other'
                        ];
                        if (!validCategories.includes(req.body.category)) {
                            errors.push('Invalid category selected');
                        }
                    }

                    // Status validation (optional)
                    if (req.body.status) {
                        const validStatuses = ['draft', 'published', 'archived'];
                        if (!validStatuses.includes(req.body.status)) {
                            errors.push('Invalid status. Must be draft, published, or archived');
                        }
                    }

                    // Meta description validation (optional)
                    if (req.body.metaDescription) {
                        const metaDescription = req.body.metaDescription.trim();
                        if (metaDescription.length > 160) {
                            errors.push('Meta description cannot exceed 160 characters');
                        }
                        req.body.metaDescription = metaDescription;
                    }

                    // Ad settings validation (optional)
                    if (req.body.adSettings) {
                        if (req.body.adSettings.adPlacement) {
                            const validPlacements = ['top', 'middle', 'bottom', 'sidebar'];
                            const placements = Array.isArray(req.body.adSettings.adPlacement) 
                                ? req.body.adSettings.adPlacement 
                                : [req.body.adSettings.adPlacement];
                            
                            for (let placement of placements) {
                                if (!validPlacements.includes(placement)) {
                                    errors.push('Invalid ad placement. Must be top, middle, bottom, or sidebar');
                                    break;
                                }
                            }
                        }
                    }
                    break;

                case 'updateBlog':
                    // For updates, all fields are optional but if provided must be valid
                    
                    // Title validation (optional)
                    if (req.body.title !== undefined) {
                        if (!req.body.title) {
                            errors.push('Title cannot be empty');
                        } else {
                            const title = req.body.title.trim();
                            if (title.length < 5) {
                                errors.push('Title must be at least 5 characters long');
                            }
                            if (title.length > 200) {
                                errors.push('Title cannot exceed 200 characters');
                            }
                            req.body.title = title;
                        }
                    }

                    // Content validation (optional)
                    if (req.body.content !== undefined) {
                        if (!req.body.content) {
                            errors.push('Content cannot be empty');
                        } else if (req.body.content.length < 100) {
                            errors.push('Content must be at least 100 characters long');
                        }
                    }

                    // Excerpt validation (optional)
                    if (req.body.excerpt !== undefined && req.body.excerpt) {
                        const excerpt = req.body.excerpt.trim();
                        if (excerpt.length > 300) {
                            errors.push('Excerpt cannot exceed 300 characters');
                        }
                        req.body.excerpt = excerpt;
                    }

                    // Tags validation (optional)
                    if (req.body.tags !== undefined) {
                        if (!Array.isArray(req.body.tags)) {
                            req.body.tags = req.body.tags ? [req.body.tags] : [];
                        }
                        if (req.body.tags.length > 10) {
                            errors.push('Cannot have more than 10 tags');
                        }
                        req.body.tags = req.body.tags.map(tag => tag.trim()).filter(tag => tag.length > 0);
                    }

                    // Category validation (optional)
                    if (req.body.category !== undefined && req.body.category) {
                        const validCategories = [
                            'Technology', 'Business', 'Health', 'Lifestyle', 
                            'Education', 'Travel', 'Food', 'Sports', 
                            'Entertainment', 'Other'
                        ];
                        if (!validCategories.includes(req.body.category)) {
                            errors.push('Invalid category selected');
                        }
                    }

                    // Status validation (optional)
                    if (req.body.status !== undefined && req.body.status) {
                        const validStatuses = ['draft', 'published', 'archived'];
                        if (!validStatuses.includes(req.body.status)) {
                            errors.push('Invalid status. Must be draft, published, or archived');
                        }
                    }

                    // Meta description validation (optional)
                    if (req.body.metaDescription !== undefined && req.body.metaDescription) {
                        const metaDescription = req.body.metaDescription.trim();
                        if (metaDescription.length > 160) {
                            errors.push('Meta description cannot exceed 160 characters');
                        }
                        req.body.metaDescription = metaDescription;
                    }

                    // Ad settings validation (optional)
                    if (req.body.adSettings !== undefined && req.body.adSettings) {
                        if (req.body.adSettings.adPlacement) {
                            const validPlacements = ['top', 'middle', 'bottom', 'sidebar'];
                            const placements = Array.isArray(req.body.adSettings.adPlacement) 
                                ? req.body.adSettings.adPlacement 
                                : [req.body.adSettings.adPlacement];
                            
                            for (let placement of placements) {
                                if (!validPlacements.includes(placement)) {
                                    errors.push('Invalid ad placement. Must be top, middle, bottom, or sidebar');
                                    break;
                                }
                            }
                        }
                    }
                    break;

                default:
                    errors.push('Invalid validation type');
                    break;
            }

            // If there are validation errors, return them
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors
                });
            }

            // If validation passes, continue to next middleware/controller
            next();

        } catch (error) {
            console.error('Error in blogValidationMiddleware:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error during validation'
            });
        }
    };
};

module.exports = {
    validationMiddleware,
    blogValidationMiddleware
};