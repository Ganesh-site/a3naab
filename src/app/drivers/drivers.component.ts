import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
declare var $:any;


@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css'],
  providers: [DatePipe]
})
export class DriversComponent implements OnInit {
  datePickerConfig:Partial<BsDatepickerConfig>;

  bsValue: Date = new Date();

  addDriver: FormGroup;
  driverList: any;
  imagePreview = null;
  fileUpload: any;
  driverId: number;

  isEdit = false;
  driverActive: number;

  zoom: number = 5;
  // initial center position for the map
  lat: number = 10.616698;
  lng: number = 76.936195;
  markers: marker[] = []
  previous;
  
  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.addDriver   = this.formBuilder.group({
      firstName: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      profilePic: ['', [Validators.required]],
      dob: [this.bsValue,  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      lastName: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      email: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      IDNumber: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      gender: ['Male',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      mobileNumber: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    })

    const obj = { }

    this.getDriverList(obj)
  }

  clickedMarker(infowindow){
    if (this.previous) {
      this.previous.close();
      }
      this.previous = infowindow;
  }

  addNewDriver(){
    this.isEdit = false; 
    this.addDriver.reset();
  }
  
  ChangeStatus(value, active){
    if(value === true){
      var driverActive = '1' 
     } else {
       var driverActive = '0'
     }
     const object = { id: this.driverId,  driverActive: driverActive}
     
     var params = {
      url: 'admin/updateDriverActive',
      data: object
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          $('#add_driv_btn').modal('hide');
          this.ngOnInit();
          // this.router.navigateByUrl('/dashboard');
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

  viewProfile(data){
    $('#add_driv_btn').modal('show');
    this.imagePreview = data['profilePic']

    var dob = new Date(data['dob']);

    this.driverActive = data['driverActive']

    this.isEdit = true;
    this.driverId = data['id']
    this.addDriver   = this.formBuilder.group({
      firstName: [data['firstName'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      profilePic: [''],
      dob: [dob,  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      lastName: [data['lastName'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      email: [data['email'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      IDNumber: [data['IDNumber'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      gender: [data['gender'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      mobileNumber: [data['mobileNumber'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    })
  }

  onchangeDriver(values:any){
    if(values.currentTarget.checked === true){
     var driverActive = '1' 
    } else {
      var driverActive = '0'
    }
    const object = { driverActive: driverActive }
    this.getDriverList(object)
  }

  uploadImageFile(event){
    var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]); 
      this.fileUpload = event.target.files[0]
  }

  getDriverList(obj){
    var params = {
      url: 'admin/getDriverList',
      data: obj
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.driverList = response.body.data.driver
          this.markers = response.body.data.driver
          // console.log(response.body)
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

  async onSubmit(){
    // console.log(this.addDriver.value)
    if(!this.addDriver.valid){
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
    }

    if(this.isEdit){
      this.driverEditService(this.addDriver.value)
      return;
    }

    const formData = new FormData();
    formData.append('uploaded_file', this.fileUpload); 
    const image = await this.apiCall.imageuploadFunctions(formData);
    if(!image['error']){

    const postData = this.addDriver.value
    postData['profilePic'] = image['uploadUrl']
    postData['dob'] = this.datePipe.transform(this.addDriver.value.dob, 'yyyy-MM-dd');

    var params = {
      url: 'admin/addDriver',
      data: postData
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          $('#add_driv_btn').modal('hide');
          this.ngOnInit();
          // this.router.navigateByUrl('/dashboard');
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

    } else {
       // Upload Error
       this.apiCall.showToast('Upload Error !!', 'Oops', 'errorToastr')
    }
  }

  async driverEditService(data){
    data['profilePic'] = this.imagePreview
    data['dob'] = this.datePipe.transform(data.dob, 'yyyy-MM-dd');
    if(this.fileUpload){
      const formData = new FormData();
      formData.append('uploaded_file', this.fileUpload); 
      const image = await this.apiCall.imageuploadFunctions(formData);
      data['profilePic'] = image['uploadUrl']
    }
    data['id'] = this.driverId

    var params = {
      url: 'admin/editDriver',
      data: data
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          $('#add_driv_btn').modal('hide');
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

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
