import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  radiusForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiCall: ApiCallService
  ) { }

  ngOnInit(): void {
    this.radiusForm = this.formBuilder.group({
      radius: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
    });

    this.getSettings()
  }

  getSettings(){
    var params = {
      url: 'admin/getSettings',
      data: { }
    }
    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          this.radiusForm = this.formBuilder.group({
            radius: [response.body.data.settings.radius,  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
          });
          // Success
          // this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
        } else {
          // Query Error
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
        console.log('Error', error)
      }
    )
  }

  onSubmit(){
    this.submitted = true;
    if (!this.radiusForm.valid) {
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
    }

    var params = {
      url: 'admin/updateSettings',
      data: this.radiusForm.value
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.ngOnInit();
        } else {
          // Query Error
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
        console.log('Error', error)
      }
    )

  }

}
