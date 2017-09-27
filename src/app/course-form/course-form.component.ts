import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
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

  courseForm: NgForm;
  @ViewChild('courseForm') currentForm: NgForm;

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
        (+params['id']) ? this.getRecordForEdit() : null; //if parameter called ID, call getRecordForEdit if not, do nothing.
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
  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    //if the form didn't change then do nothing
    if (this.currentForm === this.courseForm) { return; }
    //set the form to the current form for comparison
    this.courseForm = this.currentForm;
    //subscribe to form changes and send the changes to the onValueChanged method
    this.courseForm.valueChanges
      .subscribe(data => this.onValueChanged(data)
      );
  }
 
  onValueChanged(data?: any) {
    let form = this.courseForm.form;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  //start out the errors as an emtpy string
  formErrors = {
  
    'subject': '',
    'course': '',
  };

  validationMessages = {
  
    'subject': {
      'required': 'Subject is required.',
    },
    'course': {
      'required': 'Course is required.',
    }
  
  };

}

