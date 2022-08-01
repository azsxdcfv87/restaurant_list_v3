require('../../config/mongoose')
const Restaurant = require('../restaurant.js')
const restaurantList = require('../../restaurant.json').results


db.once('open', () => {
  Restaurant.create(restaurantList)
    .then(() => {
      console.log('done!')
      db.close()
    })
})