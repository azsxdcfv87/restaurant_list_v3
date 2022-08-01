const mongoose = require('mongoose')

// 載入 mongoose, 設定連線 mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// 取得資料庫連線狀態
const db = mongoose.connection
db.on('error', () => {
  console.log('Mongoose error')
})
db.once('open', () => {
  console.log('Mongoose open')
})