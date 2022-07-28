const mongoose = require('mongoose')
const Restaurants = require('../restaurants.js')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connect
db.on('error', () => {
  console.log('Mongoose error')
})

db.once('open', () => {
  console.log('Mongoose open')

  Restaurants.create(resttaurantList)
    .then(() => {
      console.log('done')
    })
    .catch(error => {
      console.log('Restaurants error')
    })
})

