import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms'; //added in order for forms to load. 

import { DataService } from '../data.service'

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html', //tells where corresponding HTML file lives.
  styleUrls: ['./student-form.component.css'] //tells where corresponding css file lives.
})
export class StudentFormComponent implements OnInit {

  studentForm: NgForm;
  @ViewChild('studentForm') currentForm: NgForm;

  //these describe what kind of data these variables can have - i.e. string, number, array, etc. 
  successMessage: string;
  errorMessage: string;
  student: object;
  majordata; //instead of "majors" changed to "majordata" because "majors" conflicts with angular syntax. Added this so that we can use majordata instead of just listing major id on the form.

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
        (+params['id']) ? this.getRecordForEdit() : null; //if parameter called ID, call getRecordForEdit if not, do nothing.
      });

      this.getMajors(); //call getMajors on initialization of page load - this is needed for the dropdown feature, so that all majors show.
  }

  getMajors() { //pulled this from the major.component.ts file - this is needed for the dropdown feature, so that all majors show.
    this.dataService.getRecords("major")
      .subscribe(
        majors => this.majordata = majors,
        error =>  this.errorMessage = <any>error);
  }

  saveStudent(student: NgForm){ //function to save a student onece one has been added.
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

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    //if the form didn't change then do nothing
    if (this.currentForm === this.studentForm) { return; }
    //set the form to the current form for comparison
    this.studentForm = this.currentForm;
    //subscribe to form changes and send the changes to the onValueChanged method
    this.studentForm.valueChanges
      .subscribe(data => this.onValueChanged(data)
      );
  }
 
  onValueChanged(data?: any) {
    let form = this.studentForm.form;

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
    'first_name': '',
    'last_name': '',
    'start_date': '',
    'gpa': '',
    'sat': '',
  };

  validationMessages = {
    'first_name': {
      'required': 'First name is required.',
      'minlength':'Name must be at least 2 characters long.',
      'maxlength': 'Name must not exceed 30 characters.'
    },
    'last_name': {
      'minlength': 'Name must be at least 2 characters long.',
      'maxlength': 'Name must not exceed 30 characters.'
    },
    'start_date': {
      'pattern': 'Start date should be in the following format: YYYY-MM-DD.'
    },
    'gpa': {
      'pattern': 'GPA must be a decimal'
    },
    'sat': {
      'pattern': 'SAT score must be between 400 and 1600',
      'maxlength': 'SAT score cannot exceed 4 characters long.'
    },

  };




}