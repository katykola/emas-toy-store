const express = require('express'); // Import express
const app = express(); // Create an express app
const path = require('path'); // Import path
const mongoose = require('mongoose');
const methodOverride = require('method-override'); // Import method-override


const Product = require('./models/product'); // Import the Product model
const Basket = require('./models/basket'); // Import the Basket model

const tags = Product.getTagsEnum();

app.set('views', path.join(__dirname, 'views')); // Set the views directory
app.set('view engine', 'ejs'); // Set the view engine to ejs
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data
app.use(methodOverride('_method')); // Use method override

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://127.0.0.1:27017/toy-store')
.then(() => {
    console.log('Connection open!');
})
.catch(err => {
    console.log('Oh no! Error!');
    console.log(err);
});


app.get('/', (req, res) => { 
    console.log('home');
    res.send('home'); 
});

//Admin
app.get('/admin', (req, res) => { // Set the route for the admin page
    res.render('admin'); // Render the admin/index.ejs file
});

app.post('/admin', async (req, res) => { // Set the route for creating a new product
    const { user, password } = req.body;
    try {
        res.redirect('admin/dashboard'); // Redirect to the admin dashboard
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/admin/dashboard', async (req, res) => { // Set the route for the admin dashboard

    try {
        const products = await Product.find();
        res.render('admin/dashboard', { products }); // Render the admin/dashboard.ejs file
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


//List all products
app.get('/products', async (req, res) => { // Set the route for the products page
    try {
        const { category } = req.params;
        const categories = await Product.getUniqueCategories(); // Get unique categories from the database

        const { tag, onSale } = req.query;
        let filter = {};

        if (tag) {
            filter.tags = { $in: [tag] }; // Filter by tag
        }

        if (onSale === 'true') {
            filter.onSale = true; // Filter by onSale
        }

        const products = await Product.find(filter); // Fetch products based on the filter


        const categoriesByMainCategory = await Product.aggregate([
            {
                $group: {
                    _id: "$mainCategory", // Group by mainCategory
                    categories: { $addToSet: "$category" } // Collect unique categories
                }
            }
        ]);

        res.render('products/index', { products, tags, categories, category, categoriesByMainCategory }); // Render the products/index.ejs file with the products data
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


//Create a new product
app.get('/products/new', (req, res) => { // Set the route for the new product form
    res.render('products/new', {tags}); // Render the products/new.ejs file
}); 

app.post('/products', async (req, res) => { // Set the route for creating a new product
    const { name, price, onSale, tags } = req.body;
    const product = new Product({
        name,
        price,
        onSale: onSale === 'on', // Convert checkbox value to boolean
        tags: Array.isArray(tags) ? tags : [tags] // Ensure tags is an array
    });
    try {
        await product.save(); // Save the new product to the database
        res.redirect(`/products/${product._id}`); // Redirect to the product detail page
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// List all products on sale
app.get('/products/on-sale', async (req, res) => {
    try {
        const categories = await Product.getUniqueCategories(); // Get unique categories from the database
        const tagsAll = await Product.getTagsEnum(); // Get all tags

        const productsOnSale = await Product.find({ onSale: true }); // Fetch products on sale

        const categoriesByMainCategory = await Product.aggregate([
            {
                $group: {
                    _id: "$mainCategory", // Group by mainCategory
                    categories: { $addToSet: "$category" } // Collect unique categories
                }
            }
        ]);

        res.render('products/onSale', { products: productsOnSale, categories, tagsAll, categoriesByMainCategory }); // Render the products/on-sale.ejs file with the products data
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

//Show a product
app.get('/products/:id', async (req, res) => { // Set the route for the product detail page
    try {
        const categories = await Product.getUniqueCategories();
        const product = await Product.findById(req.params.id); // Fetch the product with the specified id
        const categoriesByMainCategory = await Product.aggregate([
            {
                $group: {
                    _id: "$mainCategory", // Group by mainCategory
                    categories: { $addToSet: "$category" } // Collect unique categories
                }
            }
        ]);
        res.render('products/show', { product, categories, categoriesByMainCategory  }); // Render the products/show.ejs file with the product data
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

//List all products in a category or mainCategory
app.get('/products/maincategory/:mainCategory', async (req, res) => { // Set the route for the products page
    try {
        const { mainCategory } = req.params;
        const { type } = req.query; // Extract type (tag) from req.query

        const categories = await Product.getUniqueCategories(); // Get unique categories from the database

        const tagsAll = await Product.getTagsEnum();

    let filter = { mainCategory };

        if (type) {
            filter.tags = type;
        }

        const products = await Product.find(filter); // Fetch products based on the filter

        
        const categoriesByMainCategory = await Product.aggregate([
            {
                $group: {
                    _id: "$mainCategory", // Group by mainCategory
                    categories: { $addToSet: "$category" } // Collect unique categories
                }
            }
        ]);

        res.render('products/mainCategory', {categories, mainCategory, tagsAll, products, categoriesByMainCategory}); // Render the products/category.ejs file with the products data
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});



//List all products in a category
app.get('/products/category/:category', async (req, res) => { // Set the route for the products page
    try {
        const { category } = req.params;
        const { type } = req.query; // Extract type (tag) from req.query

        const categories = await Product.getUniqueCategories(); // Get unique categories from the database

        const tagsAll = await Product.getTagsEnum();

let filter = { category };

        if (type) {
            filter.tags = type;
        }

        const products = await Product.find(filter); // Fetch products based on the filter
        console.log(products);

        const categoriesByMainCategory = await Product.aggregate([
            {
                $group: {
                    _id: "$mainCategory", // Group by mainCategory
                    categories: { $addToSet: "$category" } // Collect unique categories
                }
            }
        ]);
        
        res.render('products/category', { products, category, categories, tagsAll, categoriesByMainCategory }); // Render the products/category.ejs file with the products data
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


//Edit a product
app.get('/products/:id/edit', async (req, res) => { // Set the route for the product edit form
    try {
        const product = await Product.findById(req.params.id); // Fetch the product with the specified id
        res.render('products/edit', { product, tags }); // Render the products/edit.ejs file with the product data
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


app.put('/products/:id', async (req, res) => { // Set the route for updating a product
    const { name, price, onSale, tags } = req.body;
    try {
        const product = await Product.findById(req.params.id); // Fetch the product with the specified id
        product.name = name;
        product.price = price;
        product.onSale = onSale === 'on';
        product.tags = Array.isArray(tags) ? tags : [tags];
        await product.save(); // Save the updated product to the database
        res.redirect(`/products/${product._id}`); // Redirect to the product detail page
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

//Delete a product
app.delete('/products/:id', async (req, res) => { // Set the route for deleting a product
    try {
        await Product.findByIdAndDelete(req.params.id); // Delete the product with the specified id from the database
        res.redirect('/products'); // Redirect to the products page
    } catch (err) { 
        console.error(err);
        res.status(500).send('Internal Server Error');
    }      
}   
); 

// Add item to shopping cart
app.post('/basket/add/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        let basket = await Basket.findOne();
        if (!basket) {
            basket = new Basket();
        }
        console.log(basket);

        const itemIndex = basket.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            basket.items[itemIndex].quantity += parseInt(quantity, 10);
        } else {
            basket.items.push({ product: productId, quantity: parseInt(quantity, 10) });
        }

        await basket.save();
        res.redirect('/basket');

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// View basket
app.get('/basket', async (req, res) => {
    try {
        const basket = await Basket.findOne().populate('items.product');
        
        // Calculate total price for each item and total price for all items
        let totalPrice = 0;

        if (basket) {
            basket.items.forEach(item => {
                // Calculate total price for each item (quantity * product price)
                const itemTotal = item.quantity * item.product.price;
                item.totalPrice = itemTotal; // Add total price to each item
                totalPrice += itemTotal; // Add to overall total price
            });
        }

        res.render('basket', { basket, totalPrice });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// Update item quantity in basket
app.post('/basket/update/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body; // Get the new quantity from the request body

        let basket = await Basket.findOne();
        if (!basket) {
            return res.redirect('/basket'); // If no basket exists, redirect to the basket
        }

        const itemIndex = basket.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            // Update quantity
            basket.items[itemIndex].quantity = parseInt(quantity, 10); // Update with new quantity
        } else {
            // If item is not found, you might want to handle this case as well
            return res.status(404).send('Item not found in basket');
        }

        await basket.save();
        res.redirect('/basket'); // Redirect to the basket after updating

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error'); // Handle any errors
    }
});

// Remove item from basket
app.post('/basket/remove/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        let basket = await Basket.findOne();
        if (!basket) {
            return res.redirect('/basket');
        }

        basket.items = basket.items.filter(item => item.product.toString() !== productId);

        await basket.save();
        res.redirect('/basket');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/contacts', (req, res) => { 
    res.render('contacts');
});

app.listen(3000, () => {   // App listens on port 3000
    console.log('Listening on port 3000');
});