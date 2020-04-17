import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/User';
import { UserService } from '../../_services/user.service';
import { AlertifyjsService } from '../../_services/alertifyjs.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
users: User[];
  constructor(private userService: UserService, private alertify: AlertifyjsService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers()
  {
    this.userService.getUsers().subscribe(
      (users)=> {this.users = users;},
      (error)=> {this.alertify.error(error);}
    )
}

}
