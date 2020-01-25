const path = require('path')
const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const fileUpload = require("express-fileupload");
const fs = require('fs')

const app = express()
const BlogPost = require('./models/BlogPosts')


mongoose.connect('mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false', { useNewUrlParser: true, useUnifiedTopology: true })
    .then( ()=> console.log('MongoDB Connected'))
    .catch(err=> console.log(err))


app.use(fileUpload());
// EJS middleware
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Folder
app.use(express.static(`${__dirname}/public`));



app.get('/', async (req, res) => {
    const posts = await BlogPost.find({})
    res.render('index', {
        posts
    })
});
app.get('/create-blog', (req, res) => res.render('create-blog'))

app.get('/post/:id', async (req, res) => {
    const post = await BlogPost.findById(req.params.id)
    res.render('post', {
        post
    })
});

app.post("/posts/store", (req, res) => {
    const {
        image
    } = req.files

    image.mv(path.resolve(__dirname, 'public/blog/images', image.name), (error) => {
        BlogPost.create({
            ...req.body,
            image: `blog/images/${image.name}`
        }, (error, post) => {
            res.redirect('/');
        });
    })
});
app.get('/remove-blog', async (req, res) => {
    const posts = await BlogPost.find({})
    res.render('remove-blog', {
        posts
    })
});
app.post('/delete-post/:id', async (req, res) => {
    BlogPost.findById(req.params.id, (err, post) =>{
        fs.unlink('public\\' + post.image, (err) => {
            if(err) throw err
            console.log('file deleted')
        })
        post.remove((err) =>{
            if(err) throw err


            res.redirect('/')
        })
    })

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))