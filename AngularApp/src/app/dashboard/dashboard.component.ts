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
      // console.log("Got movies in component: ", data);
      // console.log("data['data']" , data['data'])
      // console.log("data['data'][0]" , data['data'][0])
      // for (var i=0; i<4; i++){
      //   console.log("data['data'][i]['avg_stars']" , data['data'][i]['avg_stars'])
      // }
      // console.log("data['data'][0]['reviews']" , data['data'][0]['reviews'])
      // console.log("data['data'][0]['reviews']['0']" , data['data'][0]['reviews']['0'])
      // console.log("999 --- data['data'][0]['reviews']['0']['num_stars']" , data['data'][0]['reviews']['0']['num_stars'])
      if(data['message']=="Success"){
        // console.log("success in componennt get movies")
        this.movies = data['data'];
        // console.log("authors: ", this.movies)
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
