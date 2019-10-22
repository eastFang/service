const Koa = require('koa')
const KoaBody = require('koa-body')
const KoaRouter = require('koa-router')
const KoaStatic = require('koa-static')
const path = require('path')
const fs = require('fs')
const app = new Koa()
const router = KoaRouter()

const LISTEN_PORT = 50000
const RES_STATIC_PATH_PREFIX = 'http://localhost:${LISTEN_PORT}/images/'

app.use(KoaBody({ // 让koa读取 request body, 支持multipart
  multipart: true,
  formidable: {
    uploadDir: path.resolve(__dirname, './static/images')
  }
}))

app.use(KoaStatic(
  path.resolve(__dirname, './static')
))
app.use((ctx, next) => {
  if (ctx.method === 'OPTIONS') {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.status = 204
  } else {
    next()
  }
})

router.post('/upload', ctx => {
  ctx.set('Access-Control-Allow-Origin', '*')
  const files = Array.from(ctx.request.files.file)
  const resFiles = []
  files.forEach(file => {
    const nextPath = file.path.substring(0, file.path.lastIndexOf('/')) + '/' + file.name
    fs.renameSync(file.path, nextPath)
    resFiles.push(`${RES_STATIC_PATH_PREFIX}${file.name}`)
  })
  ctx.body = {
    data: resFiles
  }
})

router.post('/getUsers', ctx => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.status = 200
  ctx.body = '4'
})

app.use(router.routes())
  .use(router.allowedMethods())

app.listen(LISTEN_PORT, () => {
  console.log(`正在监听${LISTEN_PORT}端口`)
})