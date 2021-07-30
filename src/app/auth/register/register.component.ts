import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  loading: boolean = false;
  showError: boolean = false;
  errorMessage: string = "";
  
  data: any = {};
  now: number = Date.now();

  constructor(
    public auth: AngularFireAuth,
    public fire: AngularFirestore,
    public router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
  }

  daftar(formData: any) {
    this.loading = true;
    this.data['created_at'] = this.datePipe.transform(this.now, 'MMM d, y, h:mm:ss a');

    try {
      if(formData.valid) {
        this.auth.createUserWithEmailAndPassword(
          formData.value.email,
          formData.value.password
        ).then((resp) => {
          this.router.navigateByUrl('auth/login');
          this.data['role'] = 'user';
          this.fire.collection('user').add(this.data)
          this.loading = false;
        }).catch((err) => {
          this.loading = false;
          this.errorMessage = err['message'];
          this.showError = true;
        })
      } else {
        this.errorMessage = "Data tidak boleh kosong !";
        this.showError = true;
      }
    } catch(e) {
      this.loading = false;
    }

  }

  closeAlert() {
    this.showError = false;
  }

}
