import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'

@Component({
  selector: 'app-assignment-form',
  templateUrl: './assignment-form.component.html',
  styleUrls: ['./assignment-form.component.css']
})
export class AssignmentFormComponent implements OnInit {

  assignmentForm: NgForm;
  @ViewChild('assignmentForm') currentForm: NgForm;

  successMessage: string;
  errorMessage: string;
  students;
  assignment: object;
  grades;
  courses;

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("assignment", +params['id'])) //use some data from the params and then call the dataService and make another one. Chaining your asychronis calls together.
      .subscribe(assignment => this.assignment = assignment);
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
  
     this.getStudents();
     this.getGrades();
     this.getCourses();
  }


  getStudents() {
    this.dataService.getRecords("student")
      .subscribe(
        students => this.students = students,
        error =>  this.errorMessage = <any>error);
  }

  getGrades() {
    this.dataService.getRecords("grade")
      .subscribe(
        grades => this.grades = grades,
        error =>  this.errorMessage = <any>error);
  }

  getCourses() {
    this.dataService.getRecords("course")
      .subscribe(
        courses => this.courses = courses,
        error =>  this.errorMessage = <any>error);
  }

  saveAssignment(assignment: NgForm){
    if(typeof assignment.value.assignment_id === "number"){
      this.dataService.editRecord("assignment", assignment.value, assignment.value.assignment_id)
          .subscribe(
            assignment => this.successMessage = "Record updated successfully",
            error =>  this.errorMessage = <any>error);
    }else{
      this.dataService.addRecord("assignment", assignment.value)
          .subscribe(
            assignment => this.successMessage = "Record added successfully",
            error =>  this.errorMessage = <any>error);
            this.assignment = {};
    }

  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    //if the form didn't change then do nothing
    if (this.currentForm === this.assignmentForm) { return; }
    //set the form to the current form for comparison
    this.assignmentForm = this.currentForm;
    //subscribe to form changes and send the changes to the onValueChanged method
    this.assignmentForm.valueChanges
      .subscribe(data => this.onValueChanged(data)
      );
  }
 
  onValueChanged(data?: any) {
    let form = this.assignmentForm.form;

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

  //start out the errors as an empty string
  formErrors = {
    'student_id': '',
    'assignment_nbr': '',
    'grade_id': '',
    'course_id': '',
  };

  validationMessages = {
    'student_id': {
      'required': 'You must select a Student ID'
    },
    'assignment_nbr': {
      'required': 'You must enter an Assignment number'
    },
    'grade_id': {
      'required': 'You must select a Grade ID'
    },
    'course_id': {
      'required': 'You must select a Course ID'
    },

  };




}
