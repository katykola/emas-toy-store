const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const basketItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const basketSchema = new Schema({
    items: [basketItemSchema]
});

const Basket = mongoose.model('Basket', basketSchema);

module.exports = Basket;