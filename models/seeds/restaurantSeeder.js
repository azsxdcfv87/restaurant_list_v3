require('../../config/mongoose')
const Restaurant = require('../restaurant.js')
const restaurantList = require('../../restaurant.json').results
const mongoose = require('mongoose')
const db = mongoose.connection

db.once('open', () => {
  Restaurant.create(restaurantList)
    .then(() => {
      console.log('done!')
      db.close()
    })
})
