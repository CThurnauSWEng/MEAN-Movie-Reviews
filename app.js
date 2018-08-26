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
    avg_stars: {type: String},
    num_reviews: {type: Number, default: 1},
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

    Movie.find({})
        .populate('reviews')
        .exec(function(err, movies) {
        if (err){
            console.log("error retrieving movies");
            res.json({message: "Error", error: err})
        } else {
            // console.log("server 301: movie data: ", movies)
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
            res.json({message: "Success", data: movie})
        }
    })
})

app.get('/movieName/:title', function(req, res){
    Movie.find({title: req.params.title}, function(err, movie){
        if (err){
            res.json({message: "Error", error: err})
        } else {
            res.json({message: "Success", data: movie})
        }        
    })
})

app.get('/review/:id', function(req, res){
    Review.find({_id: req.params.id}, function(err, review){
        if (err) {
            res.json({message: "Error", error: err})
        } else {
            res.json({message: "Success", data: review})
        }
    })
})

app.delete('/movie/:id', function(req,res){
    Movie.findByIdAndRemove(req.params.id, function(err, movie) {
        if (err){
            res.json({message: "Error", error: err})
        } else {
            res.json({message: "Success", data: movie})
        }        
    })
})

app.post('/movie/', function(req,res){
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
    // This route is invoked by httpService.addReview

    var review = new Review({"reviewerName": req.body['review']['reviewerName'], "description": req.body['review']['description'],"num_stars":req.body['review']['num_stars']});
    var movieId = req.body.movieId;

    Movie.findOne({_id: movieId}, function(err, movie){
        review._movie = movie._id;
        review.save(function(err){
            if(err) {
                console.log("510: err saving review", err);
            } else {
                movie.reviews.push(review);
                movie.save(function(err){
                    if (err){
                        console.log("error saving movie with review");
                        res.json({message: "Error", error: err});
                    } else {
                        res.json({message: "Success", movie: movie, review: review});
                    }
                })
            }
        })
    })
})


app.put('/movie/:id', function(req,res){

    Movie.update({_id: req.params.id}, 
                {title: req.body['title'], 
                 avg_stars: req.body['avg_stars'],
                 num_reviews: req.body['num_reviews']},
                 {runValidators: true}, function (err){
        if (err){
            res.json({message: "Error", error: err})
        } else {
            res.json({message: "Success - Movie Updated"})
        }
    });    
})


app.post('/addmoviereview', function (req, res){

    var movie = new Movie({"title": req.body.movie['title'], "avg_stars": req.body.movie['avg_stars']});
    var review = new Review({"reviewerName": req.body['review']['reviewerName'], "description": req.body['review']['description'],"num_stars":req.body['review']['num_stars']});
    var movieId = movie['_id'];

    movie.save(function(err){
        if (err){
            res.json({message: "Error", error: err})
        } else {
            // ok, now add the review to the movie
            Movie.findOne({_id: movieId}, function(err, movie){
                review._movie = movie._id;
                review.save(function(err){
                    if(err) {
                        console.log("510: err saving review", err);
                    } else {
                        movie.reviews.push(review);
                        movie.save(function(err){
                            if (err){
                                res.json({message: "Error", error: err});
                            } else {
                                res.json({message: "Success", movie: movie, review: review});
                            }
                        })
                    }
                })
            })
        }        
    })
})

app.put('/review/:id', function(req,res){

    Review.update({_id: req.params.id}, {description: req.body.description,numstars: req.body.numstars},{runValidators: true}, function (err){
        if (err){
            res.json({message: "Error", error: err})
        } else {
            res.json({message: "Success - Review Updated"})
        }
    });    
})

app.delete('/review/:id', function(req,res){

    Review.findByIdAndRemove(req.params.id, function(err, review) {
        if (err){
            res.json({message: "Error", error: err})
        } else {
            res.json({message: "Success", data: review})
        }        
    })
})

app.all("*", (req,res,next) => {
  res.sendFile(path.resolve("./AngularApp/dist/Angularapp/index.html"))
});

app.listen(8000, function() {
    console.log("Movie Reviews app listening on port 8000")
})
