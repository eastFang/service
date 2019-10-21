const Koa = require('koa')
const KoaBody = require('koa-body')
const KoaRouter = require('koa-router')
const koaCors = require('@koa/cors')
const path = require('path')
const fs = require('fs')
const app = new Koa()
const router = KoaRouter()

const PORT = 50000
app.use(KoaBody({
  multipart: true,
  formidable: {
    uploadDir: path.resolve(__dirname, './static/images')
  }
}))
router.post('/upload', ctx => {
  console.log('/upload我进来了')
  const files = Array.from(ctx.request.files.file)
  files.forEach(file => {
    const nextPath = file.path.substring(0, file.path.lastIndexOf('/')) + '/' + file.name
    fs.renameSync(file.path, nextPath)
  })
  ctx.body = '上传成功'
})

app.use(koaCors({
  origin: '*'
}))

app.use(router.routes())
  .use(router.allowedMethods())

app.listen(PORT, () => {
  console.log(`正在监听${PORT}端口`)
})