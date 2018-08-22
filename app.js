const express = require('express');

const app = express();
app.use(express.static(__dirname + '/AngularApp/dist/AngularApp'));

// Require path
const path = require('path');

var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.json());

// Require Mongoose
var mongoose = require('mongoose');
// connect to mongodb using mongoose 
mongoose.connect('mongodb://localhost/movies');

// create schema
var Schema = mongoose.Schema;

var MovieSchema = new mongoose.Schema({
    title: {type: String, required: true, minlength: 3},
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}],
}, {timestamps: true})
mongoose.model("Movie",MovieSchema);
var Movie = mongoose.model("Movie");

var ReviewSchema = new mongoose.Schema({
    _movie: {type: Schema.Types.ObjectId, ref: 'Movie'},
    reviewerName: {type: String, required: true, minlength: 3},
    description: {type: String, required: true, minlength: 3},
    num_stars: {type: String, required:true}
}, {timestamps: true})
mongoose.model('Review',ReviewSchema);
var Review = mongoose.model('Review');


app.get('/', function (req, res){
    console.log('got another hit');
    res.render('index');
});

app.get('/allmovies/', function(req,res){
    console.log("in server: get movies")
    Movie.find({})
        .populate('reviews')
        .exec(function(err, movies) {
        if (err){
            console.log("error retrieving movies");
            res.json({message: "Error", error: err})
        } else {
            console.log("server 301: movie data: ", movies)
            res.json({message: "Success", data: movies})
        }
    })
})

app.get('/movie/:id', function(req, res){
    Movie.find({_id: req.params.id})
    .populate('reviews')
    .exec(function (err, movie){
        if (err){
            console.log("error retrieving movie");
            res.json({message: "Error", error: err})
        } else {
            console.log("got movie by id and theoretically populated: ", movie)
            res.json({message: "Success", data: movie})
        }
    })
})

app.get('/movieName/:title', function(req, res){
    Movie.find({title: req.params.title}, function(err, movie){
        if (err){
            console.log("error retrieving movie");
            res.json({message: "Error", error: err})
        } else {
            res.json({message: "Success", data: movie})
        }        
    })
})

app.get('/review/:id', function(req, res){
    Review.find({_id: req.params.id}, function(err, review){
        if (err) {
            console.log("error retrieving review");
            res.json({message: "Error", error: err})
        } else {
            res.json({message: "Success", data: review})
        }
    })
})

app.delete('/movie/:id', function(req,res){
    Movie.findByIdAndRemove(req.params.id, function(err, movie) {
        if (err){
            console.log("error deleting movie");
            res.json({message: "Error", error: err})
        } else {
            console.log("in server, movie: ", movie)
            res.json({message: "Success", data: movie})
        }        
    })
})

app.post('/movie/', function(req,res){
    console.log("in post movie: req.body.title: ", req.body.title);
    var movie = new Movie({"title": req.body.title});
    movie.save(function(err){
        if (err){
            console.log("error creating the movie");
            res.json({message: "Error", error: err})
        } else {
            res.json({message: "Success", data: movie})
        }        
    })
})

app.post('/createreview/', function(req, res){
    console.log("400 req.body.review: ",req.body.review);
    var review = new Review({"reviewerName": req.body['review']['reviewerName'], "description": req.body['review']['description'],"num_stars":req.body['review']['num_stars']});
    console.log("review 401: ", review);
    var movieId = req.body.movieId;
    console.log("movieid: ", movieId);
    Movie.findOne({_id: movieId}, function(err, movie){
        review._movie = movie._id;
        console.log("review 405: ", review);
        review.save(function(err){
            if(err) {
                console.log("510: err saving review", err);
            } else {
                console.log("^^ returned from save review, err: ", err)
                movie.reviews.push(review);
                movie.save(function(err){
                    if (err){
                        console.log("error saving movie with review");
                        res.json({message: "Error", error: err});
                    } else {
                        console.log("$$$ saved movie: ", movie, "review: ", review);
                        res.json({message: "Success", movie: movie, review: review});
                    }
                })
            }
        })
    })
})

app.post('/addmoviereview', function (req, res){
    console.log("800 req.body.movie: ", req.body.movie);
    console.log("801 req.body.review: ", req.body.review);
    console.log("802 in post movie: req.body.title: ", req.body.movie['title']);
    var movie = new Movie({"title": req.body.movie['title']});
    var review = new Review({"reviewerName": req.body['review']['reviewerName'], "description": req.body['review']['description'],"num_stars":req.body['review']['num_stars']});
    var movieId = movie['_id'];
    console.log("810 movie:", movie);
    console.log("812 review: ", review);
    console.log("813: movieId: ", movieId);
    movie.save(function(err){
        if (err){
            console.log("error creating the movie");
            res.json({message: "Error", error: err})
        } else {
            // ok, now add the review to the movie
            Movie.findOne({_id: movieId}, function(err, movie){
                review._movie = movie._id;
                console.log("review 405: ", review);
                review.save(function(err){
                    if(err) {
                        console.log("510: err saving review", err);
                    } else {
                        console.log("^^ returned from save review, err: ", err)
                        movie.reviews.push(review);
                        movie.save(function(err){
                            if (err){
                                console.log("error saving movie with review");
                                res.json({message: "Error", error: err});
                            } else {
                                console.log("$$$ saved movie: ", movie, "review: ", review);
                                res.json({message: "Success", movie: movie, review: review});
                            }
                        })
                    }
                })
            })
        }        
    })
})

app.put('/movie/:id', function(req,res){
    console.log("in update route")
    Movie.update({_id: req.params.id}, {title: req.body.title},{runValidators: true}, function (err){
        if (err){
            res.json({message: "Error", error: err})
        } else {
            res.json({message: "Success - movie Updated"})
        }
    });    
})

app.put('/review/:id', function(req,res){
    console.log("in review update route")
    Review.update({_id: req.params.id}, {description: req.body.description,numstars: req.body.numstars},{runValidators: true}, function (err){
        if (err){
            res.json({message: "Error", error: err})
        } else {
            res.json({message: "Success - Review Updated"})
        }
    });    
})

app.delete('/review/:id', function(req,res){
    console.log("in delete id: ", req.params.id);
    Review.findByIdAndRemove(req.params.id, function(err, review) {
        if (err){
            console.log("error deleting review");
            res.json({message: "Error", error: err})
        } else {
            console.log("in server, review: ", review)
            res.json({message: "Success", data: review})
        }        
    })
})

app.all("*", (req,res,next) => {
  console.log("executing app.all in app.js");
  res.sendFile(path.resolve("./AngularApp/dist/Angularapp/index.html"))
});

app.listen(8000, function() {
    console.log("Movie Reviews app listening on port 8000 -- 99th time")
})
