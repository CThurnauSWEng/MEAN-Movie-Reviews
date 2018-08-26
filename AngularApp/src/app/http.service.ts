import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) { }

  getMovies() {
    return this._http.get('/allmovies');
  }

  deleteMovie(id) {
    return this._http.delete('/movie/'+id);
  }

  addMovie(movie) {
    console.log("in service, movie: ", movie);
    return this._http.post('/movie/',movie);
  }

  getMovieById(id){
    return this._http.get('/movie/'+id);
  }

  updateMovieStars(movieId, movie){
    // called by updateAverageStars in addreview component
    var url_string = '/movie/' + movieId;
    return this._http.put(url_string, movie);    
  }


  findMovieByName(movie){
    var url_string = '/movieName' + movie['title'];
    return this._http.get(url_string);
  }

  addMovieAndReview(movie, review){
    // invoked by add component

    var reviewAndMovie = {
      review : review,
      movie  : movie 
    }
    return this._http.post('/addmoviereview', reviewAndMovie);
  }

  addReview(review, movieId){
    // invoked by addreview component

    var reviewMovieId = {
      review: review,
      movieId : movieId
    }
    return this._http.post('/createreview', reviewMovieId);
  }

}
