import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  user: any = {
    username: '',
    password: ''
  }

  constructor(private router: Router, private _dataService: DataService) { }

  ngOnInit(): void {
    if (this._dataService.token !== null) {
      this.router.navigateByUrl('/home');
    }
  }

  getUserFormData(data: any): void {
    this._dataService.login(data.username, data.password).subscribe((result) => {
      this.router.navigateByUrl('/home');
      return;
    });
  }
}
