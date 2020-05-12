import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../_models/User';
import{UserService} from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import{AlertifyjsService} from 'src/app/_services/alertifyjs.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
//@Input() user123:User;
@Input() user:User;
  constructor(private authService: AuthService, private userService: UserService, private alertify: AlertifyjsService) { }

  ngOnInit() {
  }

  sendLike(id:number)
  {
    this.userService.sendLike(this.authService.decodedToken.nameid, id).subscribe(
      (data) => {this.alertify.success('You have liked ' + this.user.knownAs);},
      (error) => {this.alertify.error(error);}
    );
  }
}
