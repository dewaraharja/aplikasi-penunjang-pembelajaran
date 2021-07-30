import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  listData: any = {};
  detailData: any = {};
  dataUser: any = {};

  userId: any;
  isAdmin: boolean = false;
  isEmpty: boolean = false;

  constructor(
    private fire: AngularFirestore,
    private route: Router,
    private auth: AngularFireAuth
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
            this.getData();
          })
        })
      }
    })
  }

  getData() {
    this.fire.collection('course', ref => ref.orderBy('created_at', 'desc')).snapshotChanges().subscribe((resp) => {
      this.listData = resp
      if (this.listData.length === 0) {
        this.isEmpty = true;
      }
      else {
        this.isEmpty = false;
      }
    })
  }

  getCourse(id: any) {
    if(this.isAdmin) {
      this.route.navigateByUrl('/courses');
    } else {
      this.fire.collection('course').doc(id).snapshotChanges().subscribe((resp) => {
        this.detailData = resp.payload.data();
        this.saveCourse();
      })
    }
  }

  saveCourse() {
    var _confirm = confirm("simpan kelas ini ?");

    if(_confirm) {
      this.fire.collection('user').doc(this.userId).collection('courses').add(this.detailData);
    } 
  }

}
