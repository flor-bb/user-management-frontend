import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

const API_URL = environment.BASE_URL + '/api/authentication';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public currentUser: Observable<User>;
  public currentUserSubject: BehaviorSubject<User>;

  constructor(private http: HttpClient) {
    let storageUser;
    const storageUserAsStr = localStorage.getItem("currentUser");

    if (storageUserAsStr) {
      storageUser = JSON.parse(storageUserAsStr);
    }

    this.currentUserSubject = new BehaviorSubject<User>(storageUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }


  //Sends a Post request to localhost:8080/sign-in
  //Respones is an user
  login(user: User): Observable<any> {
    return this.http.post<User>(API_URL + '/sign-in', user).pipe(
      map(response => {
        if (response) {
          //set session user
          this.setSessionUser(response)
        }
        return response;

      })
    );
  }

  //sets the logged in user into the session storage
  setSessionUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  register(user: User): Observable<any> {
    return this.http.post(API_URL + '/sign-up', user); //user is form Data
  }

  logOut() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(new User);
  }

  refreshToken(): Observable<any> {
    return this.http.post(API_URL + '/refresh-token?token=' + this.currentUserValue?.refreshToken, {});
  }

}
