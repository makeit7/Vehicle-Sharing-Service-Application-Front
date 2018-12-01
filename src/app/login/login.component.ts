import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../services/login.service';
import {AppService} from '../app.service';
import {Router} from '@angular/router';
import {CurrentUser} from '../model/current-user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  title = 'app';
  zhandos = 'zhandos is the best';

  constructor(private loginService: LoginService,
              private appService: AppService,
              private router: Router,
              private currentUser: CurrentUser) {
  }

  ngOnInit() {
    if ((JSON.parse(this.currentUser.getCurrentUser()) != null)  && (JSON.parse(this.currentUser.getCurrentUser()).role.name == 'client')) {
        this.router.navigate(['forbidden']);
        return false;
    }
    this.formLogin = new FormGroup({
      'login': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    console.log(this.formLogin);
    this.loginService.login(this.formLogin.get('login').value, this.formLogin.get('password').value).subscribe(
      data => {
        console.log(data);
        localStorage.setItem('token', data.access_token);
        this.getUser();
      }, error => {
        console.log('error');
      }
    );
  }

  getUser() {
    this.appService.getData3().subscribe(
      (user: any) => {
        console.log(user);
        this.currentUser.setCurrentUser(user);
        if (user.role.name != null) {
          this.router.navigate([user.role.name]);
        }
      }
    );
  }

  createAccount() {
    console.log('creatingAccount');
    this.router.navigate(['register']);
  }
}
