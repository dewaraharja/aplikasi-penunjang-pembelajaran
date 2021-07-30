import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  loading: boolean = false;
  loadData: boolean = true;
  isCollapsed: boolean = true;
  showMessage: boolean = false;

  user: any = {};
  listUser: any = {};

  idUser?: string;

  now: number = Date.now();

  constructor(
    private fire: AngularFirestore,
    private datePipe: DatePipe,
    private auth: AngularFireAuth
  ) {
    this.getData();
   }

  ngOnInit(): void {
  }

  cleanData() {
    this.user = {};
    this.idUser = undefined;
  }

  getData() {
    this.fire.collection('user', ref => ref.orderBy('role')).snapshotChanges().subscribe((resp) => {
      this.listUser = resp;
      this.loadData = false;
    })
  }

  simpan() {
    this.loading = true;
    this.user['created_at'] = this.datePipe.transform(this.now, 'MMM d, y, h:mm:ss a');

    this.fire.collection('user').doc(this.idUser).update(this.user).then((resp) => {
      this.loading = false;
      this.isCollapsed = false;
    });
  }

  detail(data: any, id: string) {
    this.idUser = id;
    this.user = data;
  }

  delete() {
    var _confirm = confirm("Apakah anda yakin ingin menghapus akun ini ?");

    if(_confirm) {
      this.auth.signInWithEmailAndPassword(this.user.email, this.user.password).then(resp => {
        this.fire
        .collection("user")
        .doc(this.idUser)
        .delete().then(mod => {
          resp.user.delete();
          this.loading = false;
        });
      })
    }


  }

  closeAlert() {
    this.showMessage = false;
  }

}
