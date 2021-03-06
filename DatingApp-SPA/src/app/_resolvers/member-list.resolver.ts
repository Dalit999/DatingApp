import { Injectable } from "@angular/core";
import { User } from '../_models/User';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyjsService } from '../_services/alertifyjs.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberListResolver implements Resolve<User[]>{
    pageNumber = 1;
    pageSize = 5;
    constructor(private userService: UserService, private router: Router, private alertify: AlertifyjsService) {
    }
    resolve(route: ActivatedRouteSnapshot):Observable<User[]>{
        return this.userService.getUsers(this.pageNumber, this.pageSize).pipe(
            catchError(error=>{
                this.alertify.error('Problem receiving data');
                this.router.navigate(['home']);
                return of(null);
            })
        )
    }
}