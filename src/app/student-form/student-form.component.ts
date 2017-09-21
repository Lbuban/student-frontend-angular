import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {

  successMessage: string;
  errorMessage: string;

  student: object;

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("student", +params['id'])) //use some data from the params and then call the dataService and make another one. Chaining your asychronis calls together.
      .subscribe(student => this.student = student);
  }

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => { 
        (+params['id']) ? this.getRecordForEdit() : null; //if parameter called ID, call getRecrodForEdit if not, do nothing.
      });

  }

  saveStudent(student: NgForm){
    if(typeof student.value.student_id === "number"){
      this.dataService.editRecord("student", student.value, student.value.student_id)
          .subscribe(
            student => this.successMessage = "Record updated successfully",
            error =>  this.errorMessage = <any>error);
    }else{
      this.dataService.addRecord("student", student.value)
          .subscribe(
            student => this.successMessage = "Record added successfully",
            error =>  this.errorMessage = <any>error);
            this.student = {};
    }

  }

}
