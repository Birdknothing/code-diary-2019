const fs = require('fs')
const path = require('path')
const sass = require('node-sass')
const target = path.resolve('./', 'testtest')
const watchScss = function(url) {
  fs.readdirSync(url, { withFileTypes: true }).forEach(dirent => {
    let relativeUrl = path.resolve(url, dirent.name)
    if (dirent.isFile() && path.extname(dirent.name) === '.scss') {
      console.log(fs.readFileSync(relativeUrl))
      fs.watchFile(relativeUrl, () => {
        let result = sass.renderSync({
          data: fs.readFileSync(relativeUrl).toString()
        })
        // 这里stream好像木用了，回头看下
        fs.writeFileSync(relativeUrl.replace(/scss/, 'css'), result.css.toString())
      })
    }

    if (dirent.isDirectory()) {
      arguments.callee(relativeUrl)
    }
  })
}
watchScss(target)
