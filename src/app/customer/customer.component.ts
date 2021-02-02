import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  providers: [DatePipe]
})
export class CustomerComponent implements OnInit {
  datePickerConfig:Partial<BsDatepickerConfig>;
  userList:any;
  pages: number;
  page =1;
  bsValue = null;
  trustUserForm : FormGroup;
  

  walletAmount: number;
  amount: number;
  orders: number;
  lastOrdertime: string;
  lastOrder: string;

  signupDateTime: string;
  signupDate: string;
  gender: string;
  DOB: string;
  os: string;
  mobileNumber: number;
  countryCode: number;
  addressPinDetails: string;
  email: string;
  lastName: string;
  firstName: string;

  customerID: string;

  userOrderList:any;
  showMap = false;
  limitValue = 0
  singnupdate = null;
  cusID = null;

 
  zoom: number = 5;
  
  // initial center position for the map
  lat: number = 10.616698;
  lng: number = 76.936195;

  markers: marker[] = []
  previous;

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.cusID = params.id);
    if(this.cusID){
      this.viewUserListData(this.cusID)
    } else {
      const object = { pageNumber: 1, limit: this.limitValue, signupDate: this.singnupdate }
      this.getUserList(object)
    }

    this.trustUserForm = this.formBuilder.group({
      trustUser: [false,  [Validators.required, Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      packageValue: [0,  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      id: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
    })
  }

  dateValue(event: any) {
    // console.log('date')
    this.singnupdate = this.datePipe.transform(event, 'yyyy-MM-dd');
    const object = { pageNumber: 1, limit: this.limitValue, signupDate: this.singnupdate }
    this.getUserList(object)
  }

  nextPage(page){
    const object = { pageNumber: page, limit: this.limitValue, signupDate: this.singnupdate }
    this.getUserList(object)
  }

  onChangeLimit(value){
    this.limitValue = value
    this.pages = 0
    this.page = 0
    const object = { pageNumber: 1, limit: this.limitValue, signupDate: this.singnupdate }
    this.getUserList(object)
  }

  pageReload(){
    this,this.ngOnInit();
    this.bsValue = null;
  }

  clickedMarker(infowindow){
    if (this.previous) {
      this.previous.close();
      }
      this.previous = infowindow;
  }
  onchangeMap(values:any){
    this.showMap = values.currentTarget.checked;
  }

  ChangeUserStatus(status, id){

    // var update
    if(status === false){
      var update = 'inactive';
    } else {
      var update = 'active';
    }

    const object = { userStatus: update, id: id }
    var params = {
      url: 'admin/updateUserActive',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          this.ngOnInit();
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
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
  

  getUserList(object){
    var params = {
      url: 'admin/userList',
      data: object
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          this.pages = response.body.pages * 10;
          // Success
          if(this.cusID == undefined){
          this.userList = response.body.data.users
          }
          // console.log(this.userList)
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
    var params = {
      url: 'admin/trustUserActive',
      data: this.trustUserForm.value
    }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        // console.log(response.body)
        if (response.body.error === 'false') {

          $('#cust_btn').modal('hide');
          this.ngOnInit();
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
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

  searchUser(value : any ) {
    const object = { pageNumber: 1, text:value,  limit: this.limitValue, signupDate: this.singnupdate }
    this.getUserList(object)
  }

  viewUserListData(id){
    var params = {
      url: 'admin/viewUser',
      data: {id : id}
    }
    
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // console.log(response.body.data.userList)
          this.userList = response.body.data.userList

          // console.log(this.userList)
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

viewUser(id){
  var params = {
    url: 'admin/viewUser',
    data: {id : id}
  }

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // console.log(response.body)
          var status = true
          if(response.body.data.users.trustUser == 'false'){
            var status = false
          }

          this.trustUserForm = this.formBuilder.group({
            trustUser: [status,  [Validators.required, Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
            packageValue: [response.body.data.users.packageValue,  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
            id: [response.body.data.users.id,  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
          })

          
          this.trustUserForm.get('id').setValue(response.body.data.users.id)
          this.customerID = response.body.data.users.customerID
          this.firstName = response.body.data.users.firstName
          this.lastName = response.body.data.users.lastName
          this.email = response.body.data.users.email
          this.addressPinDetails = response.body.data.users.addressPinDetails
          this.countryCode = response.body.data.users.countryCode

          this.mobileNumber = response.body.data.users.mobileNumber
          this.os = response.body.data.users.os
          this.DOB = response.body.data.users.DOB
          this.gender = response.body.data.users.gender

          this.signupDate = response.body.data.users.signupDate

          this.lastOrder = response.body.data.users.lastOrder
          this.lastOrdertime = response.body.data.users.lastOrdertime
          this.orders = response.body.data.users.orders
          this.amount = response.body.data.users.amount
          this.walletAmount = response.body.data.users.walletAmount

          this.userOrderList = response.body.data.orderList


          // console.log(response.body.data.orderList)
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


// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}
