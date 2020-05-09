import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/User';
import { UserService } from '../../_services/user.service';
import { AlertifyjsService } from '../../_services/alertifyjs.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { min } from 'rxjs/operators';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
users: User[];
user: User = JSON.parse(localStorage.getItem('user'));
pagination: Pagination;
// minAge:number=18;
// maxAge:number=99;
userParams: any = {};
genderList = [{value:"female", display:"Females"}, {value:"male", display:"Males"}];

  constructor(private userService: UserService, private alertify: AlertifyjsService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // this.loadUsers();
    this.route.data.subscribe(data=>{
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.userParams.minAge = 18;
  this.userParams.maxAge = 99;
  this.userParams.gender = this.user.gender === "female" ? "male" : "female";
  this.userParams.orderBy = "lastActive";
  }

  //loadUsers()
  //{
    // this.userService.getUsers().subscribe(
    //   (users)=> {this.users = users;},
    //   (error)=> {this.alertify.error(error);}
    // )
//}
pageChanged(event: any):void
{
  this.pagination.currentPage = event.page;
  this.loadUsers();
}
resetFilters()
{
  this.userParams.minAge = 18;
  this.userParams.maxAge = 99;
  this.userParams.gender = this.user.gender === "female" ? "male" : "female";
  this.userParams.orderBy = "lastActive";
  this.loadUsers();
}

loadUsers()
{
  this.userService.getUsers(this.pagination.currentPage,this.pagination.itemsPerPage, this.userParams).subscribe(
    (data:PaginatedResult<User[]>)=>{
    this.users = data.result;
    this.pagination = data.pagination;
  });

}
}
