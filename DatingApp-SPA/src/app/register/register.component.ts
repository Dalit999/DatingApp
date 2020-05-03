import { Component, OnInit , Input, Output, EventEmitter} from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyjsService } from '../_services/alertifyjs.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/ngx-bootstrap-datepicker';
import { User } from '../_models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // @Input() valuesFromHome:any;
  @Output() cancelRegister = new EventEmitter();
  user: User;
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  constructor(private authService: AuthService, private alertifyjs: AlertifyjsService,
              private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    // this.registerForm = new FormGroup({
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('',  Validators.required),
    // },
    // this.passwordMatchValidator);
    this.bsConfig = {
      containerClass: 'theme-red'
    };
    this.createRegisterForm();
  }
createRegisterForm(){
  this.registerForm = this.fb.group({
    gender: ['female'],
    username: ['', Validators.required],
    knownAs: ['', Validators.required],
    dateOfBirth: [null, Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
    confirmPassword: ['',  Validators.required]
  }, {validator: this.passwordMatchValidator});
}
  passwordMatchValidator(g: FormGroup){
    return g.get('password').value === g.get('confirmPassword').value ?
    null :
    {mismatch: true};
  }
  register()
  {
    if (this.registerForm.valid){
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe(
        () => this.alertifyjs.success('Registration Successful'),
        (error) => this.alertifyjs.error(error),
        () => this.authService.login(this.user).subscribe(
                    () => this.router.navigate(['/members'])
              )
      );
    }
    // this.authService.register(this.model).subscribe(
    //   ()=>this.alertifyjs.success('register successful'),
    //   (error)=>this.alertifyjs.error(error)
    // );
  }
  cancel()
  {
    this.cancelRegister.emit(false);
    this.alertifyjs.message('cancelled');
  }
}
