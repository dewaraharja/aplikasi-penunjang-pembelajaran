import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isAdmin: boolean = false;
  dataUser: any = [];
  listCourse: any = {};
  userId?: any;

  constructor(
    private auth: AngularFireAuth,
    private fire: AngularFirestore,
  ) { 
    this.checkUser();
  }

  ngOnInit(): void {
  }

  
  checkUser() {
    this.auth.authState.subscribe(resp => {
      if(resp) {
        this.fire.collection('user').ref.where('email', '==', resp!.email).onSnapshot(snapshot => {
          snapshot.forEach(ref => {
            this.dataUser = ref.data();

            if(this.dataUser.role == 'admin') {
              this.isAdmin = true;
            }

            this.userId = ref.id;
            console.log(this.isAdmin);
            console.log(this.dataUser)
            this.getData();
          })
        })
      }
    })
  }

  getData(){
    this.fire.collection('user').doc(this.userId).collection('courses').snapshotChanges().subscribe((resp) => {
      this.listCourse = resp;
      console.log(this.listCourse)
      console.log(this.userId)
    })
  }

}
