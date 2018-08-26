import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute , Params, Router} from '@angular/router';

@Component({
  selector: 'app-showreview',
  templateUrl: './showreview.component.html',
  styleUrls: ['./showreview.component.css']
})
export class ShowreviewComponent implements OnInit {

  reviewDataAvailable = false;
  reviews = [];
  movieDataAvailable = false;
  movieId: any;
  reviewId: any;
  movie = {
    'title'     : "",
    'avg_stars' : "",
    'reviews'   : []
  }
  errorsPresent = false;
  errorMessage = "";
  

  constructor(private _httpService: HttpService, private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    this.getMovieReviewData();
  }
  getMovieReviewData() {
    this._route.params.subscribe((params: Params) => {
      this.movieId = params['id'];

      let observable = this._httpService.getMovieById(this.movieId);
      observable.subscribe(data => {
        if (data['message']=="Error"){
          // console.log("error getting movie")
        } else {
          // console.log(data['data'][0]['title']);
          this.movie['title'] = data['data'][0]['title'];
          this.reviews = data['data'][0]['reviews'];
          if (this.reviews.length > 0){
            // console.log("this.reviews.length: ", this.reviews.length);
            this.movieDataAvailable = true;
            this.reviewDataAvailable = true;
            // console.log("show component 630 reviews: ", this.reviews)
            // console.log("show component 631 movie: ", this.movie)
            // console.log("show component 632 reviewdataavailable: ", this.movieDataAvailable)
            // console.log("show component 633 moviedataavailable: ", this.reviewDataAvailable)
          }
          // console.log("show component 640 reviews: ", this.reviews)
        }

      })
    }) 
  }
  deleteMovie(id){
    console.log("in deleteMovie in show component, id: ", id)
    let observable = this._httpService.deleteMovie(id);
    observable.subscribe(data => {
      console.log("returned from delete service");
      if(data['message']=="Success"){
        console.log("success in componennt delete")
        this._router.navigate(['/movies'])
      } else {
        console.log("Error reported to component in delete call")
      }
    })
  }
}