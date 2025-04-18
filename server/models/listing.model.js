const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        address: {
            type: String,
            require: true
        },
        regularPrice: {
            type: Number,
            required: true
        },
        discountPrice: {
            type: Number,
            required: true
        },
        bathRooms: {
            type: Number,
            required: true
        },
        bedRooms: {
            type: Number,
            required: true
        },
        furnished: {
            type: Boolean,
            required:true
        },
        parking: {
            type: Boolean,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        offer: {
            type: Boolean,
            required: true
        },
        imageUrls: {
            type: [String],
            default: [],
            required: false
        },
        userRef: {
            type: String,
            required: true
        }
    }, {timestamps: true}
)

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;