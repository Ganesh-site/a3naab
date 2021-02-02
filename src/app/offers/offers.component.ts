import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OffersService } from './offers.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
  
  addOffers: FormGroup;
  datePickerConfig:Partial<BsDatepickerConfig>;

  bsValue: Date = new Date();
  bsValue1: Date = new Date();
   status: any = true;
   offerId: number;
   allcategory: any = [];
   productcategory: any = [];
   isEdit  = false;
   id : number;

  list_offers: any = [];
  constructor(
    private formBuilder:FormBuilder,
    private offersservice:OffersService,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.getofferslist("active");

    this.addOffers   = this.formBuilder.group({
      title: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      couponCode: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      image: ["URL"],  
      trustUser:['',[ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      description: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      discount: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      minimumValue: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      count: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      startDate: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      endDate: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      status: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      offCategoryId: [''],
      offProductId: [''],
  });
  
  let allcate = {
    url: "admin/getAllCategory"
  }

  this.offersservice.getallcategory(allcate).subscribe((result:any)=>{
    let resu = result.body;
    if(!resu.error)
    {
         this.allcategory = resu.data;
    }else{
      this.offersservice.showToast(resu.message, 'Error', 'errorToastr')
    }
  },(error)=>{
     console.error(error);
  });

}
onSubmit(){
// console.log("res",this.addOffers.value)
var params = {
  url: "admin/addNewOffers",
  data: this.addOffers.value
}

if(!this.addOffers.valid){
  this.offersservice.showToast('Fill all mandatory fields !!', 'Error', 'errorToastr');
  //return;
}


this.offersservice.addofferservice(params).subscribe(
  (response: any) => {
    console.log("add offer response", response);
    if (response.body.error == 'false') {
      // Success
      this.offersservice.showToast(response.body.message, 'Success', 'successToastr')
      // $('#add_driv_btn').modal('hide');
      // this.ngOnInit();
      this.router.navigateByUrl('/offers');
    } else {
      // Query Error
      this.offersservice.showToast(response.body.message, 'Error', '  ')
    }
  },
  (error) => {
    this.offersservice.showToast('Server Error !!', 'Oops', 'errorToastr')
    console.log('Error', error)
  });

}


editoffers(offers){
  $('#add_offer_btn').modal('show');
console.log("Edit offer",offers)

this.isEdit = true;
this.id = offers['id']
this.addOffers   = this.formBuilder.group({
  title: [offers['title'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
  couponCode: [offers['couponCode'] , [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
  image: ["URL."],
  trustUser: [offers['trustUser'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
  description: [offers['description'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
  discount: [offers['discount'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
  minimumValue: [offers['minimumValue'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
  count: [offers['count'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
  startDate: [offers['startDate'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
  endDate: [offers['endDate'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
  status: [offers['status'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
  offCategoryId: [offers['offCategoryId'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
  offProductId: [offers['offProductId'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
})

var params = {
  url: "admin/editOffers",
  data: this.addOffers.value
}
if(!this.addOffers.valid){
  this.offersservice.showToast('Fill all mandatory fields !!', 'Error', 'errorToastr');
  return;
}

this.offersservice.editofferservice(params).subscribe(
  (response: any) => {
    console.log("Edit offer response", response);
    if (response.body.error == 'false') {
      // Success
      this.offersservice.showToast(response.body.message, 'Success', 'successToastr')
      // $('#add_driv_btn').modal('hide');
      // this.ngOnInit();
      this.router.navigateByUrl('/offers');
    } else {
      // Query Error
      this.offersservice.showToast(response.body.message, 'Error', 'errorToastr')
    }
  },
  (error) => {
    this.offersservice.showToast('Server Error !!', 'Oops', 'errorToastr')
    console.log('Error', error)
  });
}


getofferslist(status){
  let off_li = {
    url: "admin/getOfferList",
    status: status
  }

  this.offersservice.getoffservice(off_li).subscribe((result:any)=>{
    // console.log('offers response', result.body);
    let resu = result.body;
    if(resu.error == "false")
    {
         this.list_offers = resu.data.Offers;
    }else{
      this.offersservice.showToast(resu.message, 'Error', 'errorToastr')
    }
  },(error)=>{
     console.error(error);
  });
}


onchange(){
  let stat = this.status ? "active" : "inactive"; 
  this.getofferslist(stat);
}


cateclick(category_id){
  console.log(category_id);
   let cateid ={
     url:"admin/categoryProduct",
     categoryId : category_id
   }

   this.offersservice.categoryproduct(cateid).subscribe((result:any)=>{
     console.log('product response', result.body);
     let resu = result.body;
     if(!resu.error)
     {
          this.productcategory = resu.data.products;
     }else{
       this.offersservice.showToast(resu.message, 'Error', 'errorToastr')
     }
     
   },(error)=>{
     console.error(error);
   });

}

statclick(id,type){
  // console.log(id,type);
  let statid ={
    url:"admin/updateOfferStatus",
    id : id,
    type : type
  }

  this.offersservice.offerstatusdelete(statid).subscribe((result:any)=>{
    console.log('Status response', result.body);
    let resu = result.body;
    if(resu.error == "false")
    {
      this.offersservice.showToast("Status updated Successfully", 'Success', 'errorToastr');
    }else{
      this.offersservice.showToast(resu.message, 'Error', 'errorToastr');
    }
    
  },(error)=>{
    console.error(error);
  });

}
}



