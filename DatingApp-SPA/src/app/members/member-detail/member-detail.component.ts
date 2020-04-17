import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/User';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyjsService } from 'src/app/_services/alertifyjs.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
user: User;
  constructor(private userService: UserService, private alertify: AlertifyjsService,
    private route:ActivatedRoute) { }

  ngOnInit() {
    this.loadUser();
  }
  //members/3
  loadUser()
  {
    this.userService.getUser(+this.route.snapshot.params['id']).subscribe(
      (user:User)=>{this.user = user;},
      (error)=> {this.alertify.error(error);}
    )
  }
}
