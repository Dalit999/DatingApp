import { Component, OnInit } from '@angular/core';
import { User } from '../_models/User';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
users:User[];
pagination: Pagination;
likesParam: string;
  constructor(private userService: UserService, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data=>{
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.likesParam = 'Likers';
  }
  loadUsers()
  {
    console.log('in component, about to call get users');
    this.userService.getUsers(this.pagination.currentPage,this.pagination.itemsPerPage,null, this.likesParam).subscribe(
      (data:PaginatedResult<User[]>)=>{
      this.users = data.result;
      this.pagination = data.pagination;
    });
  
  }
  pageChanged(event: any):void
{
  this.pagination.currentPage = event.page;
  this.loadUsers();
}
}
