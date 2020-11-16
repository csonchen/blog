const express = require('express');
const router = express.Router();
const {
  image: {
    entry,
    sources,
    exportPath,
  }
} = require('../config');
const { analyseImages } = require('../services/analyseApi');

router.get('/images', (req, res) => {
  const sourceDir = __dirname + '/../../../'
  const imgSourceDir = sourceDir + entry
  const resData = analyseImages(imgSourceDir, sourceDir, sources)

  res.json({
    code: 200,
    message: '操作成功',
    data: {
      list: resData
    }
  })
})

module.exports = router;