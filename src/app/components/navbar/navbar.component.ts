import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isAdmin: boolean = false;
  dataUser: any = {};

  constructor(
    public auth: AngularFireAuth,
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
          })
        })
      }
    })
  }

  logOut() {
    var _confirm = confirm('Yakin ingin keluar ?');

    if(_confirm) {
      this.auth.signOut();
    }
  }

}
