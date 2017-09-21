import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {

  successMessage: string;
  errorMessage: string;

  course: object;

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("course", +params['id'])) //use some data from the params and then call the dataService and make another one. Chaining your asychronis calls together.
      .subscribe(course => this.course = course);
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

  saveCourse(course: NgForm){
    if(typeof course.value.course_id === "number"){
      this.dataService.editRecord("course", course.value, course.value.course_id)
          .subscribe(
            course => this.successMessage = "Record updated successfully",
            error =>  this.errorMessage = <any>error);
    }else{
      this.dataService.addRecord("course", course.value)
          .subscribe(
            course => this.successMessage = "Record added successfully",
            error =>  this.errorMessage = <any>error);
            this.course = {};
    }

  }

}
