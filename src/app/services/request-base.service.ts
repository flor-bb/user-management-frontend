import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../models/user.model";
import { AuthenticationService } from "./authentication.service";


export abstract class RequestBaseService {

  protected currentUser: User = new User;

  constructor(protected authenthicationService: AuthenticationService, protected http: HttpClient) {
    this.authenthicationService.currentUser.subscribe(data => {
      this.currentUser = data;
    });

  }

  get getHeaders(): HttpHeaders {

    return new HttpHeaders(
      {
        authorization: 'Bearer ' + this.currentUser?.accessToken,
        "Content-Type": "application/json; charset=UTF-8"
      }
    );

  }
}
