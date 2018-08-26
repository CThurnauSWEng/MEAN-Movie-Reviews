import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  movies = [];
  movieDataAvailable = false;
  
  constructor(private _httpService: HttpService) { }

  ngOnInit() {
    this.getMoviesFromService();
  }

  getMoviesFromService(){
    let observable = this._httpService.getMovies();
    observable.subscribe(data => {
      if(data['message']=="Success"){
        this.movies = data['data'];
        this.movieDataAvailable = true;
      } else {
        // Future enhancement - show error message on web page
        console.log("Error reported to component")
      }
    })
  }

  deleteMovie(id){
    let observable = this._httpService.deleteMovie(id);
    observable.subscribe(data => {
      if(data['message']=="Success"){
        this.getMoviesFromService();
      } else {
        // Future enhancement - show error message on web page
        console.log("Error reported to component in delete call")
      }
    })    
  }

}

// future enhancement - in html, when there is only one review, change dashboard
// display to say "1 Review" instead of "1 Reviews"
