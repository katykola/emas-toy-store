const mongoose = require('mongoose'); // Import mongoose, ale nemusím znovu importovat express, path, protože už je mám v app.js a taky nemusím connect to mongodb, protože už je to v app.js

const productSchema = new mongoose.Schema({ // Create a new schema  // Schema je blueprint pro model
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    onSale: {
        type: Boolean,
        default: false
    },
    mainCategory: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    tags: {
        type: [String], // Define tags as an array of strings
        lowercase: true,
        enum: ['new', 'inStock', 'custom'] 
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}); 

// Static method to get tags enum array
productSchema.statics.getTagsEnum = function() {
    return this.schema.path('tags').caster.enumValues;
};

// Static method to get unique categories from the database
productSchema.statics.getUniqueCategories = async function() {
    const categories = await this.distinct('category'); // Get all unique categories
    return categories;
};

// Method to calculate discounted price
productSchema.methods.getDiscountedPrice = function() {
    if (this.onSale) {
        return this.price * 0.8; // Apply 20% discount
    }
    return this.price;
};

// Virtual property to get discounted price if on sale
productSchema.virtual('ProductsOnSale').get(function() {
    return this.onSale ? Math.floor(this.price * 0.8) : this.price;
});

// Static method to get categories grouped by mainCategory and sorted alphabetically
productSchema.statics.getCategoriesByMainCategory = async function() {
    const categoriesByMainCategory = await this.aggregate([
        {
            $group: {
                _id: "$mainCategory", // Group by mainCategory
                categories: { $addToSet: "$category" } // Collect unique categories
            }
        },
        {
            $sort: { _id: 1 } // Sort main categories alphabetically
        }
    ]);

    // Sort categories within each main category
    categoriesByMainCategory.forEach(group => {
        group.categories.sort(); // Sort categories alphabetically
    });

    return categoriesByMainCategory;
};

const Product = mongoose.model('Product', productSchema); // Create a new model // Model je instance schema


module.exports = Product; // Export the model

