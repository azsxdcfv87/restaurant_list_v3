const express = require('express')
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json').results
const app = express()
const port = 3000
// express 預設 hostname = localhost

// 加入樣板引擎
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// 設定靜態樣式
app.use(express.static('public'))
// 1. 使用者可以在首頁看到所有餐廳與它們的簡單資料：
// 餐廳照片 餐廳名稱 餐廳分類 餐廳評分
// 以下為網址請求位置
// 動態產生餐廳資料
app.get('/', (req, res) => {
  res.render('index', { restaurantList })
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


// 設定網址位置
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})