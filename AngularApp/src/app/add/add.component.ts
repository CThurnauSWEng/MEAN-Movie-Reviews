import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  movie: any;
  review: any;
  error1Present = false;    // future enhancement - use better data structures and names for errors
  error2Present = false;
  error3Present = false;
  error4Present = false;
  errorsPresent = false;
  errorMessage = "";
  result: any;

  constructor(private _httpService: HttpService, private _route: ActivatedRoute,
    private _router: Router) { }

  ngOnInit() {
    this.movie= {
      title: "",
      avg_stars: 0,
      reviews: []}

    this.review = {
      reviewerName: "",
      description: "",
      num_stars: ""
    }

    this.errorMessage = "";

    this.result = {
      message: "",
      errorMessage: ""
    }
  }
  onSubmit(){
    this.validateData();
    if (this.result['message'] == "Too Short"){
      this.errorsPresent = true;
      this.errorMessage = this.result['errorMessage'];
    } else {
      this.computeAverageStars();
      let observable = this._httpService.addMovieAndReview(this.movie,this.review);
      observable.subscribe(data => {
          if (data['message']=="Error"){
            this.errorsPresent = true;
            this.errorMessage = data['error']['errors']['message'];
          } else {
            this.errorsPresent = false;
            this.errorMessage = "";
            this._router.navigate(['/']);
          }
      })
   }
  }

  computeAverageStars(){
    // when adding a new movie, the avg_stars = the number entered for this review
    var starString = "";
    for (var i = 0; i<this.review['num_stars']; i++){
      starString += "*";
    }
    this.movie['avg_stars'] = starString;
  }

  validateData(){
    this.result['message'] = "In validateData";
    this.result['error1Message'] = "Message 1 from validateData"
    this.result['error2Message'] = "Message 2 from validateData"
    this.error1Present = false;
    this.error2Present = false;
    this.error3Present = false;
    this.error4Present = false;
    if (this.movie['title'].length < 3){
      this.error1Present = true;
      this.result['message'] = "Too Short";
      this.result['error1Message'] = "Movies must have a title at least 3 characters long"
    }
    if (this.review['reviewerName'].length < 3){
      this.error2Present = true;
      this.result['message'] = "Too Short";
      this.result['error2Message'] = "You must provide a name at least 3 characters long"
    }
    if (this.review['description'].length < 3){
      this.error3Present = true;
      this.result['message'] = "Too Short";
      this.result['error3Message'] = "You must provide a review at least 3 characters long"
    }
    if (this.review['num_stars'] != "1" &&
        this.review['num_stars'] != "2" &&
        this.review['num_stars'] != "3" &&
        this.review['num_stars'] != "4" &&
        this.review['num_stars'] != "5" ){
          this.error4Present = true;
          this.result['message'] = "Too Short";
          this.result['error4Message'] = "You can only choose between 1 to 5 stars"    
    }
    return;
  }
}
