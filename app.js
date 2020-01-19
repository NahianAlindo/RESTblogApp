var bodyParser   = require("body-parser"),
methodOverride   = require("method-override"),
expressSanitizer = require("express-sanitizer");
mongoose         = require("mongoose"),
express          = require("express"),
app              = express();
//app config
mongoose.connect("mongodb://localhost:27017/restful_blog_app", {useNewUrlParser: true});

app.set("view engine", "ejs");
app.use(express.static("public"));//serve  custom stylesheet
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());// has to be after body parser
app.use(methodOverride("_method"));


var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body:  String,
    created: {type: Date, default: Date.now}
});

//mongoose model config
var Blog = mongoose.model("Blog", blogSchema);

//RESTful Routes
app.get("/",function(req,res){
    res.redirect("/blogs");
});
//INDEX
app.get("/blogs",function(req,res){
    Blog.find({},function(err, blogs){
        if(err){
            console.log("ERROR");
        }
        else{
            res.render("index" , {blogs:blogs});
        }
    });
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs",function(req,res){
    //create
    
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    console.log(req.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            console.log("ERROR!!!");
    }
        else{
            //redirect to the index
            res.redirect("/blogs");
        }
    });
})
//SHOW ROUTE
app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log("ERROR!!!");
    }
    else{
        res.render("show", {blog: foundBlog});
    }
    });
});

app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit", {blog:foundBlog});
        }
    });
    
});

app.put("/blogs/:id", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
    //destroy blog
    Blog.findByIdAndDelete(req.params.id, function(err){
        if(err){
            console.log("ERROR!!");
        }
        else{
            res.redirect("/blogs");
        }
    });
    //redirect to another page
});

app.listen(3000,function(){
    console.log("Server Initiation SUCCESSFUL!!!");
});