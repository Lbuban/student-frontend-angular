import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'

@Component({
  selector: 'app-majorcourse-form',
  templateUrl: './majorcourse-form.component.html',
  styleUrls: ['./majorcourse-form.component.css']
})
export class MajorcourseFormComponent implements OnInit {

  successMessage: string;
  errorMessage: string;
  courses;
  majorcourse: object;

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("majorcourse", +params['id'])) //use some data from the params and then call the dataService and make another one. Chaining your asychronis calls together.
      .subscribe(majorcourse => this.majorcourse = majorcourse);
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

  }

  getCourses() {
    this.dataService.getRecords("course")
      .subscribe(
        courses => this.courses = courses,
        error =>  this.errorMessage = <any>error);
  }
  saveMajorcourse(majorcourse: NgForm){
    if(typeof majorcourse.value.majorcourse_id === "number"){
      this.dataService.editRecord("majorcourse", majorcourse.value, majorcourse.value.major_course_id)
          .subscribe(
            majorcourse => this.successMessage = "Record updated successfully",
            error =>  this.errorMessage = <any>error);
    }else{
      this.dataService.addRecord("majorcourse", majorcourse.value)
          .subscribe(
            majorcourse => this.successMessage = "Record added successfully",
            error =>  this.errorMessage = <any>error);
            this.majorcourse = {};
    }

  }

}
