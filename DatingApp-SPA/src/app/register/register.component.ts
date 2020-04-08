import { Component, OnInit ,Input, Output, EventEmitter} from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyjsService } from '../_services/alertifyjs.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //@Input() valuesFromHome:any;
  @Output() cancelRegister = new EventEmitter();
model: any={};
  constructor(private authService:AuthService, private alertifyjs:AlertifyjsService) { }

  ngOnInit() {
  }

  register()
  {
    this.authService.register(this.model).subscribe(
      ()=>this.alertifyjs.success('register successful'),
      (error)=>this.alertifyjs.error(error) 
    )
  }
  cancel()
  {
    this.cancelRegister.emit(false);
    this.alertifyjs.message('cancelled');
  }
}
