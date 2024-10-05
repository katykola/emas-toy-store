// this file is used to seed the database with some initial data. This is useful for testing purposes, as it allows you to quickly populate your database with some data. This file is not necessary for the app to run, but it is useful for testing purposes.
// It is isolated from the rest of the app, so it does not need to be run every time the app is started. It can be run manually whenever you want to seed the database with data.

const mongoose = require('mongoose');
const Product = require('./models/product'); // Import the Product model

mongoose.connect('mongodb://127.0.0.1:27017/toy-store')
.then(() => {
    console.log('Connection open!');
})
.catch(err => {
    console.log('Oh no! Error!');
    console.log(err);
});

const seedProducts = [
    {
        name: 'Tin Toy Car',
        price: 10.99,
        onSale: false,
        mainCategory: 'toys',
        category: 'cars',
        tags: ['new', 'inStock'],
        image: "https://images.unsplash.com/photo-1469037784699-75dcff1cbf75?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "This charming Red Tin Beetle Car is a delightful miniature replica of the classic Beetle. Perfect for play or display, its vintage design and vibrant red color bring nostalgic joy to kids and collectors alike. Small yet sturdy, this timeless toy offers endless adventures in a compact, old-school style."
    },
    {
        name: 'Wooden Race Car',
        price: 15.99,
        onSale: true,
        mainCategory: 'toys',
        category: 'cars',
        tags: ['new', 'custom'],
        image: "//images.unsplash.com/photo-1662321979743-3d0a327397bb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "This Small Wooden Race Car is a beautifully crafted toy that blends simplicity with speed. Made from smooth, eco-friendly wood, its sleek design is perfect for little hands to grip and race around. Durable and lightweight, this car encourages imaginative play, helping children develop motor skills while fueling their love for racing adventures."
    },
    {
        name: 'Orange Monkey',
        price: 9.99,
        onSale: true,
        mainCategory: 'toys',
        category: 'plushtoys',
        tags: ['new'],
        image: "https://images.unsplash.com/photo-1612544408897-36d451f03d71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Meet the Orange Plush Monkey, a cuddly companion full of charm and playfulness! With its soft, velvety fur and vibrant orange color, this adorable monkey is perfect for snuggling and imaginative adventures. Lightweight and huggable, it's great for kids of all ages. Whether it’s a comforting bedtime buddy or a fun playtime partner, this plush monkey is sure to bring endless joy and smiles."
    },
    {
        name: 'Astronaut Figure',
        price: 9.99,
        onSale: true,
        mainCategory: 'toys',
        category: 'LEGO',
        tags: ['inStock'],
        image: "https://images.unsplash.com/photo-1569013636299-8219e8ce6cdd?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Blast off into adventure with the LEGO Astronaut Figure! This mini space explorer, complete with a detailed spacesuit and helmet, is ready for out-of-this-world missions. Perfect for kids and collectors alike, this iconic figure sparks creativity as you build and imagine space adventures. Compatible with all LEGO sets, the astronaut is a fun addition to any collection, inspiring curiosity about the universe while delivering endless hours of imaginative play."
    },
    {
        name: 'Cute Bear',
        price: 19.99,
        onSale: false,
        mainCategory: 'toys',
        category: 'plushtoys',
        tags: ['new'],
        image: "https://images.unsplash.com/photo-1516564927920-18dc97b117b4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Big Bear Plush Toy, the ultimate cuddle companion! Soft, huggable, and generously sized, this plush bear is perfect for snuggling, making it a comforting friend for kids and adults alike. Made from ultra-soft fabric, it’s great for cozying up at bedtime, decorating a room, or giving as a thoughtful gift. With its adorable face and fluffy fur, this big bear is sure to bring warmth and smiles wherever it goes. Perfect for hugging, lounging, or simply adding a touch of charm to any space!"
    },
];

Product.insertMany(seedProducts) // Insert the seed products into the database
.then(res => {
    console.log(res);
})  
.catch(err => { // Log any errors
    console.log(err);
}); 