const gulp = require('gulp')
const sftp = require('gulp-sftp')
const fs = require('fs')
const path = require('path')

const remoteDir = '/root/static/demo'
const remoteStaticDir = '/root/static/demo/static'
const remoteConf = require('./remoteConfig')
function upload(localPath, conf) {
    return gulp.src(localPath).pipe(sftp(conf))
}
gulp.task('upload',function () {
    const distDir = path.join(__dirname,'build')
    const childrenFiles = fs.readdirSync(distDir)
    const pathConf = []
    childrenFiles.forEach((file)=>{
        const fileDir = path.join(distDir,file)
        const isDirectory = fs.lstatSync(fileDir).isDirectory()
        if(isDirectory){
            pathConf.push({
                localPath:fileDir + '/**',
                remotePath:remoteStaticDir
            })
        }else{
            pathConf.push({
                localPath:fileDir,
                remotePath:remoteDir
            })
        }
    })
    pathConf.forEach((p)=>{
        remoteConf.forEach((conf)=>{
            upload(p.localPath,Object.assign({},conf,{remotePath:p.remotePath}))
        })
    })
})