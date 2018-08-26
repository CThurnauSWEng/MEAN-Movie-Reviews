import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-addreview',
  templateUrl: './addreview.component.html',
  styleUrls: ['./addreview.component.css']
})
export class AddreviewComponent implements OnInit {

  review: any;
  movie = {
    'title'     : "",
    'avg_stars' : "",
    'reviews'   : []
  }
  error1Present = false;
  error2Present = false;
  error3Present = false;
  errorsPresent = false;
  errorMessage = "";
  error1Message = "";
  error2Message = "";
  error3Message = "";
  result: any;
  movieId: any;
  movieDataAvailable: any;
  url_string: any;

  constructor(private _httpService: HttpService, private _route: ActivatedRoute,
    private _router: Router) { }

  ngOnInit() {

    this.review= {reviewerName: "",description: "", num_stars: ""}
    this.errorMessage = "";
    this.movieDataAvailable = false;
    this._route.params.subscribe((params: Params) => {
      this.movieId = params['id'];
      console.log("in noONInit 1: ", this.movieId);

      let observable = this._httpService.getMovieById(this.movieId);
      observable.subscribe(data => {
        console.log("data from get movie call: ", data);
        if (data['message']=="Error"){
          console.log("error getting movie")
        } else {
          console.log(data['data'][0]['title']);
          this.movie['title'] = data['data'][0]['title'];
          this.movie['avg_stars'] = data['data'][0]['avg_stars'];
          this.movieDataAvailable = true;
        }

      })
    })
    
  }
  onSubmit(){
    
    console.log("onSubmit: ",this.review);
    console.log("onSubmit: movie stuff: ", this.movieId, this.movie);
    this.validateData(this.review);
    if (!this.errorsPresent){
      let observable = this._httpService.addReview(this.review, this.movieId);
      observable.subscribe(data => {
        console.log("from add: 1", data);
        if (data['message']=="Error"){
          this.errorsPresent = true;
          console.log("data['error']: ", data['error'])
          console.log("data['error']['message']: ", data['error']['message'])
          this.errorMessage = data['error']['message'];
        } else {
          // Successfully added review
          this.errorsPresent = false;
          this.errorMessage = "";
          this.review = {reviewerName: ""}

          // Update the average stars
          this.updateAverageStars();

          this._router.navigate(['/movies',this.movieId]);
        }
      })
    }
    
  }

  updateAverageStars(){
    console.log ("updateAverageStars 1: movieId: ", this.movieId);

    let observable = this._httpService.getMovieById(this.movieId);
    observable.subscribe(data => {

      var movie = data['data']['0'];
      console.log("Did we get it???? movie: ", movie);
      var sum = 0;
      var new_avg = 0;
  
      for (var i = 0; i < movie.reviews.length; i++){
        console.log("2001 - num_stars in this review")
        sum += Number(movie.reviews[i].num_stars);
      }
      new_avg = Math.ceil(sum/movie.reviews.length);
      var starString = "";
      for (var i = 0; i<new_avg; i++){
        starString += "*";
      }
      console.log("starString", starString);
      movie['avg_stars'] = starString;

      let observable = this._httpService.updateMovieStars(this.movieId, movie);
      observable.subscribe(data => {
        if (data['message']=="Error"){
          this.errorsPresent = true;
          console.log("data['error']: ", data['error'])
          console.log("data['error']['message']: ", data['error']['message'])
          this.errorMessage = data['error']['message'];
        } else {
          console.log("successfully updated movie");
        }
      })

    })
  }

  validateData(review){
    this.error1Present = false;
    this.error2Present = false;
    this.error3Present = false;
    this.error1Message = "";
    this.error2Message = "";
    this.error3Message = "";
    this.errorsPresent = false;
    console.log("in validateData, review: ", review);
    if (review['reviewerName'].length < 3){
      this.error1Present = true;
      this.errorsPresent = true;
      this.error1Message = "You must provide a name at least 3 characters long";
    }
    if (review['description'].length < 3){
      this.error2Present = true;
      this.errorsPresent = true;
      this.error2Message = "You must provide a review at least 3 characters long";
    }
    if ((review['num_stars'] != "1") &&
        (review['num_stars'] != "2") &&
        (review['num_stars'] != "3") &&
        (review['num_stars'] != "4") &&
        (review['num_stars'] != "5") 
      ){
      this.error3Present = true;
      this.errorsPresent = true;
      this.error3Message = "Number of Stars must be between 1 and 5";
    }

  }

}