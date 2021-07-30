import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  course: any = {}
  dataUser: any = {}
  listData: any = {}

  imgSrc: string = "assets/add.png";
  imgUrl: string = "";

  idCourse?: string;
  selectedImage?: string;
  now: number = Date.now();

  isEmpty: boolean = true;
  loading: boolean = false;
  isCollapsed: boolean = true;
  showMessage: boolean = false;

  constructor(
    public auth: AngularFireAuth,
    public router: Router,
    private storage: AngularFireStorage,
    private fire: AngularFirestore,
    private datePipe: DatePipe
  ) { 
    this.checkUser();
  }

  ngOnInit(): void {
  }

  checkUser() {
    this.auth.authState.subscribe(resp => {
      if (!resp) {
        this.router.navigateByUrl('/auth')
      } else {
        this.fire.collection('user').ref.where('email', '==', resp!.email).onSnapshot(snapshot => {
          snapshot.forEach(ref => {
            this.dataUser = ref.data();
            this.getData();
          })
        })
      }
    })
  }

  cleanData() {
    this.course = {};
    this.idCourse = undefined;
    this.imgSrc = "assets/add.png";
    this.loading = false;
  }

  getImage(url: any) {
    if(url.target.files && url.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (u: any) => this.imgSrc = u.target.result;
      reader.readAsDataURL(url.target.files[0]);
      this.selectedImage! = url.target.files[0];
      this.imgUrl = url.target.files[0]['name'];
    } else {
      this.imgSrc = "assets/add.png";
      this.selectedImage!;
    }
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

  simpan() {
    this.loading = true;
    this.course['created_at'] = this.datePipe.transform(this.now, 'MMM d, y, h:mm:ss a');

    if(this.imgUrl == "") {
      this.fire.collection('course').doc(this.idCourse).update(this.course);
      this.cleanData();
      this.showMessage = true;
    } else {
      var filePath = `course/${this.imgUrl.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      var fileRef = this.storage.ref(filePath);

      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => (
          fileRef.getDownloadURL().subscribe((url) => {
            this.course['created_at'] = this.datePipe.transform(this.now, 'MMM d, y, h:mm:ss a');
            this.course['image_url'] = url;
            this.course['publisher'] = this.dataUser.username;

            if(this.idCourse != null) {
              
              this.fire.collection('course').doc(this.idCourse).update(this.course);
            } else {

              this.fire.collection('course').add(this.course);
            }
            this.showMessage = true;
            this.cleanData();
          })
        ))
      ).subscribe()
    }
  }

  detail(data: any, id: string) {
    this.idCourse = id;
    this.course = data;
    this.imgSrc = data['image_url'];
  }

  delete() {
    var _confirm = confirm("Konfirmasi hapus kelas ?");
    
    if(_confirm) {
      this.fire
      .collection("course")
      .doc(this.idCourse)
      .delete();
    }
  }

  closeAlert() {
    this.showMessage = false;
  }

}
