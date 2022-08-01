const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
// const restaurantList = require('./restaurant.json').results
const app = express()
const port = 3000
const Restaurant = require('./models/restaurant')
require('./config/mongoose')
// express 預設 hostname = localhost

// 加入樣板引擎
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// 設定靜態樣式
app.use(express.static('public'))

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))
// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))
// 1. 使用者可以在首頁看到所有餐廳與它們的簡單資料：
// 餐廳照片 餐廳名稱 餐廳分類 餐廳評分
// 以下為網址請求位置
// 動態產生餐廳資料
app.get('/', (req, res) => {
  // res.render('index', { restaurantList })
  Restaurant.find() // get Restaurant model all data
    .lean() // mongoose model object transform clean JavaScript data list
    .sort({ _id: 'asc' })
    .then(restaurantList => res.render('index', { restaurantList })) // data send index template 
    .catch(error => console.log(error))
})
//2. 使用者可以再點進去看餐廳的詳細資訊：
// 類別 地址 電話 描述 圖片
// 卡片點入時，id動態產生
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurantList => res.render('detail', { restaurantList }))
    .catch(error => console.log(error))
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurantList => res.render('edit', { restaurantList }))
    .catch(error => console.log(error))
})

//更新餐廳資訊
app.put('/restaurants/:id', (req, res) => {
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
app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurantList => restaurantList.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
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
app.get('/restaurant/new', (req, res) => {
  return res.render('new')
})
// 新增資料 create 路由，新增完資料後將資料送給資料庫
app.post('/restaurants', (req, res) => {
  Restaurant.create(req.body) // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})


// 設定網址位置
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})