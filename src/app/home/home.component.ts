import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private _dataService: DataService) { }

  ngOnInit(): void {
    if (this._dataService.token === null) {
      this.router.navigateByUrl('/login');
    }
  }

}
