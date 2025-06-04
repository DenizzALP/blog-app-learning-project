const express = require('express');
const { get } = require('mongoose');
const router = express.Router();
const Post = require('../models/Post')


// get
// home
router.get('', async (req, res) => {
    try{
        const locals = {
            title: "NodeJs Blog",
            description: "Simple Blog created with NodeJs, Exxxpress & MongoDb."
        }

        let perPage = 10;
        let page = req.query.page || 1 ;
        

        const data = await Post.aggregate([ { $sort: {createdAt: -1} } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage)


 
        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });



    }catch(error){
        console.log(error)
    }

    
})


/*
GET
POST :id
*/ 

router.get('/post/:id', async(req, res) => {
    
    try{
        let slug = req.params.id;

        const data = await Post.findById({_id: slug});
        
        
        const locals = {
                title: data.title,
                description: "Simple Blog created with NodeJs, Exxxpress & MongoDb.",
                currentRoute: `/post/${slug}`
        }
        

        res.render('post', {locals, data});
    } catch(error){
        console.log(error)

    } 

})

/*
GET
POST :searchTerm
*/ 
router.post('/search', async(req, res) => {
    try{
        const locals = {
            title: "Search",
            description: "Simple Blog created with NodeJs, Exxxpress & MongoDb."
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")
 
        const data = await Post.find ({
            $or:[
                {title: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
                {body: {$regex: new RegExp(searchNoSpecialChar, 'i')}}
            ]
        })


        res.render("search", {
            data,
            locals
        });
    } catch(error){
        console.log(error)

    } 

})



// function insertPostData(){
//     Post.insertMany([
//             {
//                 title: "Building a Blog",
//                 body: "This is the body text for the first blog post."
//             },
//             {
//                 title: "Getting Started with Node.js",
//                 body: "Node.js is a powerful JavaScript runtime built on Chrome's V8 engine."
//             },
//             {
//                 title: "Understanding Express Middleware",
//                 body: "Middleware functions are the heart of Express applications, enabling modular and reusable code."
//             },
//             {
//                 title: "MongoDB Basics for Beginners",
//                 body: "MongoDB is a NoSQL database that stores data in flexible, JSON-like documents."
//             },
//             {
//                 title: "How to Use Mongoose in Node.js",
//                 body: "Mongoose provides a straight-forward, schema-based solution to model your application data."
//             },
//             {
//                 title: "Async/Await in JavaScript Explained",
//                 body: "Async/Await syntax allows writing asynchronous code that looks and behaves like synchronous code."
//             },
//             {
//                 title: "Creating REST APIs with Express",
//                 body: "Express makes it simple to build RESTful APIs with Node.js quickly and efficiently."
//             },
//             {
//                 title: "Deploying Your Node.js App",
//                 body: "Learn the basics of deploying your Node.js application on popular cloud platforms."
//             },
//             {
//                 title: "Introduction to JavaScript ES6 Features",
//                 body: "ES6 introduced many new features such as arrow functions, classes, and template literals."
//             },
//             {
//                 title: "Debugging Node.js Applications",
//                 body: "Effective debugging techniques can help you quickly identify and fix issues in your code."
//             }

//     ])
// }
// insertPostData();

router.get('/about', (req, res) => {
    res.render('about',{
        currentRoute: '/about'
    })
})

module.exports = router;