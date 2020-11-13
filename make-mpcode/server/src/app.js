const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const { APP_ID } = require('./config');
const ci = require('miniprogram-ci');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// test api
app.get('/', (req, res) => res.send('hello world'))

// 允许访问static目录资源
app.use('/static', express.static(path.join(__dirname, 'static')))

// 获取小程序的所有页面配置
app.get('/api/getAppPages', async (req, res) => {
  const mpProPath = path.resolve(__dirname, '../../wx-mall-components/dist')
  const pageConfigFile = 'app.json'
  const fileContent = fs.readFileSync(`${mpProPath}/${pageConfigFile}`,'utf-8')
  const result = JSON.parse(fileContent)
  res.json({
    code: 200,
    message: '操作成功',
    data: {
      pages: result.pages
    }
  })
})

// 构建小程序，生成预览码图片
app.post('/api/preview', async (req, res) => {
  const project = new ci.Project({
    appid: APP_ID,
    type: 'miniProgram',
    projectPath: '../wx-mall-components/dist',
    privateKeyPath: 'keys/private.wx5a35be4e15614ade.key',
    ignores: ['node_modules/**/*'],
  })
  const { pagePath = "pages/index/index", searchQuery = '' } = req.body || {}
  const previewResult = await ci.preview({
    project,
    desc: 'hello',
    setting: {
      ex6: true,
    },
    qrcodeFormat: 'image',
    pagePath,
    searchQuery,
    qrcodeOutputDest: 'src/static/preview.jpg',
    onProgressUpdate: console.log,
  })
  res.json({
    code: 200,
    message: '操作成功',
    data: {
      previewImg: 'http://localhost:5000/static/preview.jpg',
    }
  })
})

const port = 5000;
app.listen(port, () => console.log(`make mpcode service listen on port ${5000}`))