import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/User';
import { UserService } from '../../_services/user.service';
import { AlertifyjsService } from '../../_services/alertifyjs.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
users: User[];
  constructor(private userService: UserService, private alertify: AlertifyjsService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // this.loadUsers();
    this.route.data.subscribe(data=>{
      this.users = data['users'];
    });
  }

  //loadUsers()
  //{
    // this.userService.getUsers().subscribe(
    //   (users)=> {this.users = users;},
    //   (error)=> {this.alertify.error(error);}
    // )
//}

}
