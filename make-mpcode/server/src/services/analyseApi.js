const path = require('path');
const fs = require('fs');
const { getAllFiles } = require('../tools/fileUtils');

/**
 * 分析图片文件在项目的引入情况
 * @param {*} imgDirSrc 图片源文件目录
 * @param {*} sourceDir 根目录
 * @param {*} sources 需要分析的源文件数组
 */
const analyseImages = (imgDirSrc, sourceDir, sources) => {
  // 需要分析的图片目录地址
  const imgDirPath = path.resolve(imgDirSrc)
  const imgFiles = getAllFiles(imgDirPath)

  if (imgFiles.length === 0) return

  // 只保留图片的文件名数组
  const allImageFiles = imgFiles.map(imgItem => path.basename(imgItem))

  // 查找所有的wxml, js文件
  const allWxmlFiles = sources.reduce((acc, targetEntry) => {
    const targetDirPath = path.resolve(sourceDir + targetEntry)
    const targetAllFiles = getAllFiles(targetDirPath, true)
    const allWxmlFiles = targetAllFiles.filter(filePath => {
      const extname = path.extname(filePath)
      return ['.wxml', '.js'].indexOf(extname) > -1
    })
    return [...acc, ...allWxmlFiles]
  }, [])

  // 遍历图片集数组，查找文件是否有引入
  let imgIdx = 1
  const result = allImageFiles.reduce((acc, imgName) => {
    const rowItems = allWxmlFiles.reduce((childAcc, filePath) => {
      const fileStr = fs.readFileSync(filePath, 'utf8')
      return fileStr.indexOf(imgName) === -1 ? childAcc : [...childAcc, {
        id: imgIdx++,
        image: imgName,
        existPath: filePath,
        status: 1,
      }]
    }, [])
    
    // 如果查找完毕为空，则说明没有引入到该图片
    return rowItems.length === 0 ? [...acc, {
      id: imgIdx++,
      image: imgName,
      existPath: '没有用到',
      status: 0,
    }] : [...acc, ...rowItems]
  }, [])

  return result
}

module.exports = {
  analyseImages,
}