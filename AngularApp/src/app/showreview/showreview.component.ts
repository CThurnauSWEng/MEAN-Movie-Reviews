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
          // future enhancement - display error message on web page
          console.log("error getting movie")
        } else {
          this.movie['title'] = data['data'][0]['title'];
          this.reviews = data['data'][0]['reviews'];
          if (this.reviews.length > 0){
            this.movieDataAvailable = true;
            this.reviewDataAvailable = true;
          }
        }

      })
    }) 
  }
  deleteMovie(id){
    let observable = this._httpService.deleteMovie(id);
    observable.subscribe(data => {
      if(data['message']=="Success"){
        this._router.navigate(['/movies'])
      } else {
          // future enhancement - display error message on web page
          console.log("Error reported to component in delete call")
      }
    })
  }
}