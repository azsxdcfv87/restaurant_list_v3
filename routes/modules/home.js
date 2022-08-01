const express = require('express')
const restaurantList = require('../../restaurant.json').results
const Restaurant = require('../../models/restaurant.js')
const router = express.Router()

// 1. 使用者可以在首頁看到所有餐廳與它們的簡單資料：
// 餐廳照片 餐廳名稱 餐廳分類 餐廳評分
// 以下為網址請求位置
// 動態產生餐廳資料
router.get('/', (req, res) => {
  // res.render('index', { restaurantList })
  Restaurant.find() // get Restaurant model all data
    .lean() // mongoose model object transform clean JavaScript data list
    .sort({ _id: 'asc' })
    .then(restaurantList => res.render('index', { restaurantList })) // data send index template
    .catch(error => console.log(error))
})
// 2. 使用者可以再點進去看餐廳的詳細資訊：
// 類別 地址 電話 描述 圖片
// 卡片點入時，id動態產生
router.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurantList => res.render('detail', { restaurantList }))
    .catch(error => console.log(error))
})

router.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurantList => res.render('edit', { restaurantList }))
    .catch(error => console.log(error))
})

// 更新餐廳資訊
router.put('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurantList => {
      restaurantList.name = req.body.name
      restaurantList.name_en = req.body.name_en
      restaurantList.category = req.body.category
      restaurantList.image = req.body.image
      restaurantList.location = req.body.location
      restaurantList.phone = req.body.phone
      restaurantList.google_map = req.body.google_map
      restaurantList.rating = req.body.rating
      restaurantList.description = req.body.description
      return restaurantList.save()
    })
    // 回到詳細資料頁面可直接確認修改內容
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})
// 刪除功能
router.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurantList => restaurantList.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
// 使用者可以透過搜尋餐廳名稱來找到特定的餐廳
// 使用者可以透過搜尋餐廳類別來找到特定的餐廳
router.get('/search', (req, res) => {
  // console.log(req.query.keyword)
  const keyword = req.query.keyword
  if (!keyword) {
    res.redirect('/')
    return
  }
  const filterRestaurants = restaurantList.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurantList: filterRestaurants, keyword: keyword })
})
// 新增餐廳
router.get('/restaurant/new', (req, res) => {
  return res.render('new')
})
// 新增資料 create 路由，新增完資料後將資料送給資料庫
router.post('/restaurants', (req, res) => {
  Restaurant.create(req.body) // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})


module.exports = router