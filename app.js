const ejs = require('ejs')
const fs = require('fs-extra')
const md = require('markdown-it')()
const postcss = require('postcss')
const tailwind = require('tailwindcss')('./tailwind.js')
const chalk = require('chalk').default

const dist = process.cwd() + '/dist/'
const post = process.cwd() + '/posts/'

const manifest = require('./manifest')

var posts = []



main()

async function main() {
    console.log(chalk.blue('building to' + chalk.bold(' /dist\n')))
    if(fs.pathExistsSync(dist)) fs.removeSync(dist)
    fs.ensureDirSync(dist)
    await buildCSS()
    if(manifest.enableBlogPage)
    {
        setPosts()
        await generatePosts()
    }
    await generateMainPages()
    await generateAdditionalPages()
    console.log(chalk.blue(chalk.bold('build complete')))
}

async function buildCSS(){
    console.log(chalk.blue('build') + '\tCSS')
    let css = await postcss([tailwind])
    .process(
        fs.readFileSync(process.cwd() + '/tailwind.css', 'utf8'), 
        {
            from: 'tailwind.css', 
            to: 'dist/static/styles/styles.css'
        }
    )
    fs.ensureDirSync(dist + 'static/styles')
    fs.writeFileSync(dist + 'static/styles/styles.css', css.css)
    console.log(chalk.green('\tdone\n'))
}

async function generateMainPages()
{
    console.log(chalk.blue('build') + '\tMain Pages')
    let indexPage = render('index.ejs')
    await fs.writeFile(dist + 'index.html', indexPage)
    if(manifest.enableBlogPage)
    {
        let postsPage = render('posts.ejs', {posts, pageTitle: 'Posts'})
        await fs.writeFile(dist + 'posts.html', postsPage)
    }
    console.log(chalk.green('\tall done\n'))
}


function render(path, data)
{
    console.log(chalk.yellow('render') +  chalk.cyan(`\t${path}`))
    let title = `${(path != 'index.ejs') ? `${data.pageTitle || ''} - `: ''}${manifest.title}`
    let template = fs.readFileSync(process.cwd() + '/view/master.ejs', 'utf8')
    console.log(chalk.green('\tdone\n'))
    return ejs.render(
        template, 
        {
            title: manifest.title, 
            currentTitle: title, 
            page: process.cwd() + `/view/${path}`,
            isBlogEnabled: manifest.enableBlogPage,
            additionalPages: manifest.additionalPages,
             ...data
        }
    )
}

function setPosts()
{
    const regex = /^<p>(.*)<\/p>$/m;
    console.log(chalk.blueBright('index') + '\tPosts')
    manifest.posts.reverse()
    for(item in manifest.posts)
    {
        let content = fs.readFileSync(post + manifest.posts[item].file + '.md', 'utf8')
        content = md.render(content)
        let summary = regex.exec(content)[1]
        posts.push({
            title: manifest.posts[item].title,
            content: content,
            summary: summary,
            url: manifest.posts[item].file
        })
    }
    console.log(chalk.green('\tdone\n'))
}

async function generatePosts()
{
    console.log(chalk.blue('build') + `\tPosts`)
    console.log(chalk.yellow(`\tFound ${chalk.cyan(posts.length)}\n`))
    await fs.ensureDir(dist + '/posts/')
    posts.forEach(async (e) => {
        let post = render('postContent.ejs', {post: e, pageTitle: e.title})
        await fs.writeFile(dist + `/posts/${e.url}.html`, post)
    })
    console.log(chalk.green('\tall done\n'))
}

async function generateAdditionalPages()
{
    console.log(chalk.blue('build') + `\tAdditional Pages`)
    manifest.additionalPages.forEach(async (e) => {
        fs.ensureFileSync(dist + '/' + e.url)
        let page = render(`/pages/${e.file}`, {pageTitle: e.name})
        await fs.writeFile(dist + '/' + e.url, page)
    })
    console.log(chalk.green('\tall done\n'))
    
}