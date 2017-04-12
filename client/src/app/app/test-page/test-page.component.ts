import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Http, Headers} from "@angular/http";

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent implements OnInit {

  HEADERS = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

  launcherForm: FormGroup;

  constructor(private fb: FormBuilder, private http: Http) {

    this.launcherForm = this.fb.group({
      'pdfUrl': ['http://latemar.science.unitn.it/cad/lectures/TEST/Lezione6/4-Ereditarieta2016.ppt.pdf', Validators.required]
    });

  }

  ngOnInit() {
  }

  doPost(form: any) {
    console.log("bene");
    console.log(form);
    return this.http
      .post("http://127.0.0.1:8080/lecturer", JSON.stringify({pdfUrl: form.pdfUrl}), {headers: this.HEADERS})
      .map((res) => { return res; });
  }

}
