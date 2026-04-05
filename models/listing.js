const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    image: {
        filename: { type: String, default: 'default-image' },
        url: { type: String, default: "https://via.placeholder.com/300x200?text=No+Image" }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
      type : Schema.Types.ObjectId,
        ref: "Review",
    },
       
    ],
});

// ✅ Virtual field to safely access image
listingSchema.virtual('imageURL').get(function () {
    return this.image?.url || 'https://via.placeholder.com/300x200?text=No+Image';
});

// ✅ Allow virtuals in res.json() or views
listingSchema.set('toJSON', { virtuals: true });
listingSchema.set('toObject', { virtuals: true });

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({_id: { $in: listing.reviews} });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
