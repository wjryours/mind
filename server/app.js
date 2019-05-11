const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const fs = require('fs')
const path = require('path')
const iconv = require('iconv-lite')
const serverPort = 3000 
router.get('*', async (ctx, next) => {
    ctx.body = await renderIndex()
})

function renderIndex() {
    return new Promise((resolve, reject) => {
        let viewUrl = path.join(__dirname, './index.html')
        fs.readFile(viewUrl, "binary", (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(iconv.decode(data,'utf-8'))
            }
        })
    })
}
app.use(router.routes())

app.listen(serverPort, () => {
    console.log(`server success on port ${serverPort}!`)
})
