import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'

@Component({
  selector: 'app-studentcourse-form',
  templateUrl: './studentcourse-form.component.html',
  styleUrls: ['./studentcourse-form.component.css']
})
export class StudentcourseFormComponent implements OnInit {

  successMessage: string;
  errorMessage: string;
  courses;
  students;
  studentcourse: object;

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("studentcourse", +params['id'])) //use some data from the params and then call the dataService and make another one. Chaining your asychronis calls together.
      .subscribe(studentcourse => this.studentcourse = studentcourse);
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

      this.getCourses();
      this.getStudents();
  }

  getStudents() {
    this.dataService.getRecords("student")
      .subscribe(
        students => this.students = students,
        error =>  this.errorMessage = <any>error);
  }
  
  getCourses() {
    this.dataService.getRecords("course")
      .subscribe(
        courses => this.courses = courses,
        error =>  this.errorMessage = <any>error);
  }

  saveStudentcourse(studentcourse: NgForm){
    if(typeof studentcourse.value.studentcourse_id === "number"){
      this.dataService.editRecord("studentcourse", studentcourse.value, studentcourse.value.student_course_id)
          .subscribe(
            studentcourse => this.successMessage = "Record updated successfully",
            error =>  this.errorMessage = <any>error);
    }else{
      this.dataService.addRecord("studentcourse", studentcourse.value)
          .subscribe(
            studentcourse => this.successMessage = "Record added successfully",
            error =>  this.errorMessage = <any>error);
            this.studentcourse = {};
    }

  }

}

