const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      cast: function castId(v) {
        if (typeof v === "number") {
          return v;
        }
        if (typeof v === "string" && !isNaN(v)) {
          return +v;
        }
      },
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    photos: {
      type: Array,
    },
    category: {
      //like [Indian, Nepalese, Italian, Chinese] in array
      type: Array,
    },
    description: {
      //description about restaurant
      type: String,
    },
    contact: {
      type: Number,
      required: true,
    },
    mainPhoto: {
      //publicId is stored here
      type: String,
    },
    menus: [
      {
        //item image, name, price, description, category
        type: Object,
      },
    ],
    bestSeller: {
      //title, price, description, image are stored here
      type: Object,
    },
    location: {
      //lat and lon like {lat: 34, lon: 98}
      type: Object,
    },
    popularity: {
      type: Number,
      default: 0,
    },
    orderList:[{
      type: Object
    }],
    featured:{
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("restaurants", restaurantSchema);
