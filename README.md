![segar](img/segar.png)

Static Blog Creator

Segar lets you create a blog with only markdown files and Node. Powered by Node, EJS, Tailwind CSS, and markdown-it

# Structure
``` bash
|- img # Only for image(s) used in README
|- posts # Put your posts here
|- view # Template files, written in EJS
 |- components # For components
 |- pages # For additional pages described in manifest.js
 |- index.ejs # Index page
 |- master.ejs # Master tempate file
 |- postContent.ejs # Post page
 |- posts.ejs # Posts list page
|- app.js # Segar core file
|- manifest.js # This is where your blog lives
|- tailwind.css # Default CSS file
|- tailwind.js # Tailwind CSS config file 
```

# Installation

``` bash
# Clone to your machine
git clone https://github.com/stevemc4/segar
## Or download this repository as zip file

# Change current directory to Segar's directory
cd segar

# Install dependencies
npm install
```

# Building Your Blog
``` bash
# Run this command in Segar's root directory
node .

## Your blog will be compiled to /dist folder
```
# Theming
If Segar's default theme doesn't suit your taste, you can easily modify it or even create a new theme by modifying the files in `view` directory and `tailwind.css`