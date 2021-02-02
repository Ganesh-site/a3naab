import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
declare var $:any;
import { from } from 'rxjs';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  submitted = false;
  storeList:any;
  editImage: string;

  filesToUpload: any;
  imagePreview: any;
  categoryId : number;

  isEdit = false;

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
  ) { }

  
  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      categoryName: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      categoryImage: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      minimum: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      cate_processingMin: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      orderProcessing: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      storeId: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      arabicName: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      managerPrice: [false,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      isComingSoon: [false,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    });
    this.getStoreList();

    this.apiCall.categoryFn.subscribe(result => {
      if(result != '0'){
        if(result['isEdit'] === true){
          this.isEdit = true;
          this.categoryId = result['id']
          this.editCategory(result)
        } else {
          this.isEdit = false
          this.categoryForm.reset();
          this.categoryForm.get('managerPrice').setValue(false);
          this.categoryForm.get('isComingSoon').setValue(false);
        }
        
        }
      }, err => {
      console.log(err);
    });

    // this.apiCall.showToast("Can't change order status  !!", 'Orders', 'errorToastr')
  }

  editCategory(data){
    // console.log(data)
    console.log('call from')
    var managerPrice = false
    var isComingSoon = false
    if(data['managerPrice'] == 'true'){
      var managerPrice = true
    }
    if(data['isComingSoon'] == 'true'){
      var isComingSoon = true
    }
    this.editImage = data['categoryImage'];
    // console.log(this.editImage)

    this.categoryForm = this.formBuilder.group({
      categoryName: [data['categoryName'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      categoryImage: [''],
      minimum: [data['minimum'],  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      orderProcessing: [data['orderProcessing'],  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      storeId: [data['storeId'],  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      cate_processingMin: [data['cate_processingMin'],  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      arabicName: [data['arabicName'],  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      managerPrice: [managerPrice,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      isComingSoon: [isComingSoon,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
    });
  }

  getStoreList(){
    var params = {
      url: 'admin/getAllStores',
      data: {}
    }
    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.storeList = response.body.data
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },

      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  onSelectFile(event){
    const file = event.target.files && event.target.files[0];
    var valid = this.checkFileFormat(event.target.files[0]);
    if(!valid) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]); 
      this.filesToUpload = file
      // console.log(this.filesToUpload)
    } else {
      // Not valild image
    }
  }

  checkFileFormat(checkFile){
    if(checkFile.type == 'image/png' || checkFile.type == 'image/jpeg' || checkFile.type == 'image/TIF' || checkFile.type == 'image/tif' || checkFile.type == 'image/tiff'){
      return false;
    } else {
      return true;
    }
  }

  async onSubmit(){
    this.submitted = true;
    console.log(this.categoryForm.value)
    if (!this.categoryForm.valid) {
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
    }

    if(this.isEdit){
      this.updateCategoryDetails(this.categoryForm.value)
      return;
    }

    const formData = new FormData();
    formData.append('uploaded_file', this.filesToUpload); 

    const image = await this.apiCall.imageuploadFunctions(formData);
    const object = this.categoryForm.value
    if(!image['error']){
      object['categoryImage'] = image['uploadUrl']

      var params = {
        url: 'admin/addCategory',
        data: object
      }
      this.categoryForm.reset();
      this.apiCall.commonPostService(params).subscribe(
        (response: any) => {
          if (response.body.error == false) {
            // Success
            this.categoryForm.get('managerPrice').setValue(false);
            this.categoryForm.get('isComingSoon').setValue(false);
            this.apiCall.setProductValue('Category')
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
    } else {
      // Upload Error
      this.apiCall.showToast('Upload Error !!', 'Oops', 'errorToastr')
    }
  }

  async updateCategoryDetails(object){
    // console.log(object)
    const data = object 
    data['categoryImage'] = this.editImage
    data['id'] = this.categoryId
    // console.log(this.filesToUpload)
    if(this.filesToUpload){
      const formData = new FormData();
      formData.append('uploaded_file', this.filesToUpload);
      const image = await this.apiCall.imageuploadFunctions(formData);
      data['categoryImage'] = image['uploadUrl']
    }
    console.log(data)
    var params = {
      url: 'admin/editCategory',
      data: data
    }
    this.categoryForm.reset();
    this.categoryForm.get('managerPrice').setValue(false);
    this.categoryForm.get('isComingSoon').setValue(false);
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // Success
          this.apiCall.setProductValue('Category')
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

}
