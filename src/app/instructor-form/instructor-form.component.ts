import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'

@Component({
  selector: 'app-instructor-form',
  templateUrl: './instructor-form.component.html',
  styleUrls: ['./instructor-form.component.css']
})
export class InstructorFormComponent implements OnInit {

  instructorForm: NgForm;
  @ViewChild('instructorForm') currentForm: NgForm;

  successMessage: string;
  errorMessage: string;

  instructor: object;

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("instructor", +params['id'])) //use some data from the params and then call the dataService and make another one. Chaining your asychronis calls together.
      .subscribe(instructor => this.instructor = instructor);
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

  saveInstructor(instructor: NgForm){
    if(typeof instructor.value.instructor_id === "number"){
      this.dataService.editRecord("instructor", instructor.value, instructor.value.instructor_id)
          .subscribe(
            instructor => this.successMessage = "Record updated successfully",
            error =>  this.errorMessage = <any>error);
    }else{
      this.dataService.addRecord("instructor", instructor.value)
          .subscribe(
            instructor => this.successMessage = "Record added successfully",
            error =>  this.errorMessage = <any>error);
            this.instructor = {};
    }

  }
  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    //if the form didn't change then do nothing
    if (this.currentForm === this.instructorForm) { return; }
    //set the form to the current form for comparison
    this.instructorForm = this.currentForm;
    //subscribe to form changes and send the changes to the onValueChanged method
    this.instructorForm.valueChanges
      .subscribe(data => this.onValueChanged(data)
      );
  }
 
  onValueChanged(data?: any) {
    let form = this.instructorForm.form;

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
    'years_of_experienced': '',
    'tenured': '',
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
    'years_of_experience': {
      'required': 'This field is required.',
      'maxlength': 'This field must not exceed 30 characters.'
    },
    'tenured': {
      'required': 'This field is required.',
      'maxlength': 'SAT score cannot exceed 1 characters long.'
    },
  };
}
