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
    console.log("Dashboad component ngOnInit executing...");
    this.getMoviesFromService();
  }

  getMoviesFromService(){
    console.log("called getMoviesFromService")
    let observable = this._httpService.getMovies();
    observable.subscribe(data => {
      console.log("Got movies in component: ", data);
      if(data['message']=="Success"){
        console.log("success in componennt get movies")
        this.movies = data['data'];
        console.log("authors: ", this.movies)
        this.movieDataAvailable = true;
      } else {
        console.log("Error reported to component")
      }
    })
  }

  deleteMovie(id){
    console.log("delete movie 100, id: ", id);
    let observable = this._httpService.deleteMovie(id);
    observable.subscribe(data => {
      console.log("returned from delete service");
      if(data['message']=="Success"){
        console.log("success in componennt delete")
        this.getMoviesFromService();
      } else {
        console.log("Error reported to component in delete call")
      }
    })    
  }

}
