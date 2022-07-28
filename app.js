const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json').results
const app = express()
const port = 3000

const Restaurants = require('./models/Restaurant')
// express 預設 hostname = localhost
// 載入 mongoose, 設定連線 mongoDB
mongoose.connect(process.env.MONGODB_URI)
// 取得資料庫連線狀態
const db = mongoose.connection
db.on('error', () => {
  console.log('Mongoose error')
})
db.once('open', () => {
  console.log('Mongoose open')
})
// 加入樣板引擎
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// 設定靜態樣式
app.use(express.static('public'))
// 1. 使用者可以在首頁看到所有餐廳與它們的簡單資料：
// 餐廳照片 餐廳名稱 餐廳分類 餐廳評分
// 以下為網址請求位置
// 動態產生餐廳資料
app.get('/', (req, res) => {
  // res.render('index', { restaurantList })
  Restaurants.find() // get Restaurant model all data
    .lean() // mongoose model object transform clean JavaScript data list
    .sort({ _id: 'asc' })
    .then(restaurants => res.render('index', { restaurantList })) // data send index template 
    .catch(error => console.log(error))
})
//2. 使用者可以再點進去看餐廳的詳細資訊：
// 類別 地址 電話 描述 圖片
// 卡片點入時，id動態產生
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant: restaurant })
})
// 使用者可以透過搜尋餐廳名稱來找到特定的餐廳
// 使用者可以透過搜尋餐廳類別來找到特定的餐廳
app.get('/search', (req, res) => {
  // console.log(req.query.keyword)
  const keyword = req.query.keyword
  if (!keyword) {
    res.redirect("/")
    return;
  }
  const filterRestaurants = restaurantList.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurantList: filterRestaurants, keyword: keyword })
})
// 新增餐廳
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})
// 新增資料 create 路由，新增完資料後將資料送給資料庫
app.post('/restaurants', (req, res) => {
  return Restaurant.create(req.body) // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})


// 設定網址位置
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})