import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  constructor(
    public auth: AngularFireAuth,
    route: Router,
  ) { 
    auth.authState.subscribe(resp => {
      if (!resp) {
        route.navigateByUrl('/auth')
      }
    })
  }

  ngOnInit(): void {
  }

}
