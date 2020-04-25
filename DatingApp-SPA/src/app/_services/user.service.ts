import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/User';

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Authorization': 'Bearer ' + localStorage.getItem('token')
//   })
// };
@Injectable({
  providedIn: 'root'
})
export class UserService {
baseUrl = environment.apiUrl;
constructor(private http: HttpClient) { }

getUsers(): Observable<User[]>
{
  //return this.http.get<User[]>(this.baseUrl + 'users', httpOptions);//no need anymore, we configured JwtModule in app.module.ts to always send the token
  return this.http.get<User[]>(this.baseUrl + 'users');
}
getUser(id): Observable<User>
{
  //return this.http.get<User>(this.baseUrl + 'users/' + id, httpOptions);
  return this.http.get<User>(this.baseUrl + 'users/' + id);
}
updateUser(id:Number, user: User)
{
  return this.http.put(this.baseUrl + 'users/' + id, user);
}
setMainPhoto(userId: Number, id:Number)
{
  return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
}

}
