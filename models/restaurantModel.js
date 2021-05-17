const mongoose =require('mongoose')

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category:{ //like [Indian, Nepalese, Italian, Chinese] in array
        type: Array
    },
    description:{ //description about restaurant
        type: String
    },
    contact:{
        type: Number,
        required: true
    },
    mainPhoto:{ //publicId is stored here
        type: String
    },
    menus:[{ //item image, name, price, description
        type: Object,
    }],
    bestSeller:{  //title, price, description, image are stored here
        type: Object
    },
    location:{ //lat and lon like {lat: 34, lon: 98}
        type: Object
    }
})

module.exports = mongoose.model('restaurants', restaurantSchema);