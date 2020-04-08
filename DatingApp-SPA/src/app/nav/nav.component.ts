import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyjsService } from '../_services/alertifyjs.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model:any = {};
  constructor(public authService:AuthService,private alertifyjs: AlertifyjsService) { }

  ngOnInit() {
  }

  login()
  {
    this.authService.login(this.model).subscribe(
      next=>console.log('logged in OK'),
      error=>console.log('login error:' + error)

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
        this.alertifyjs.message('logged out!');
       })
     }
}
