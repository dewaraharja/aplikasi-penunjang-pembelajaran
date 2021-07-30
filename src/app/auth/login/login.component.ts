import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email?: string;
  password?: string;
  loading: boolean = false;
  errorMessage?: String;
  showError: boolean = false;

  constructor(
    public auth: AngularFireAuth,
    route: Router,
  ) { 
    auth.authState.subscribe(resp => {
      if (resp) {
        route.navigateByUrl('/home')
      }
    })
  }

  ngOnInit(): void {
  }

  masuk() {
    this.loading = true;

    this.auth.signInWithEmailAndPassword(
      this.email!,
      this.password!
    ).then((resp) => {
      this.loading = false;
    }).catch((err) => {
      this.loading = false;
      this.errorMessage = 'Coba ulangi !';
      this.showError = true;
    })
  }

  closeAlert() {
    this.showError = false;
  }

}
