import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyjsService } from '../_services/alertifyjs.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model:any = {};
  photoUrl: string;
  constructor(public authService:AuthService,private alertifyjs: AlertifyjsService, private router: Router) { }

  ngOnInit() {
    this.authService.currentUserPhotoUrl.subscribe(photoUrl => {this.photoUrl = photoUrl; console.log('got a new url:' + photoUrl);});
  }

  login()
  {
    this.authService.login(this.model).subscribe(
      next=>console.log('logged in OK'),
      error=>console.log('login error:' + error),
      ()=>  this.router.navigate(['/members'])

    );
   }
   loggedIn()
     {
       return this.authService.loggedIn();
     }

     logout()
     {
       this.alertifyjs.confirm('are you sure you want to log out?',()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.authService.decodedToken = null;
        this.authService.currentUser = null;
        this.alertifyjs.message('logged out!');
        this.router.navigate(['/home']);
       })
     }
}
