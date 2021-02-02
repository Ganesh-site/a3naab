import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  productForm: FormGroup;
  submitted = false;
  storeList:any;
  category: any;
  subCategory: any;
  subSubCategory: any;
  productImages:string [] = [];

  subCategoryId: any;
  mainCateId: any;
  subSubCate: any;

  cuttingStyle:any;
  productList: any;
  selectedProduct: any;
  selectedProductList:string [] = [];
  proImages= [];
  finalFilterProduct = [];
  productId: number;

  isEdit =false;

  dropdownList = [];
    selectedItems = [];
    dropdownSettings = {};

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {

   
    console.log('ll')
this.dropdownSettings = { 
          singleSelection: false, 
          text:"Select Store",
          selectAllText:'Select All',
          unSelectAllText:'UnSelect All',
          enableSearchFilter: true,
          classes:"myclass custom-class"
        }; 

        

    this.apiCall.subCateFn.subscribe(result => {
      if(result != '0'){
         this.subCategoryId = result
        }
      }, err => {
      console.log(err);
    });

    this.apiCall.CateFn.subscribe(result => {
      if(result != '0'){
         this.mainCateId = result
        }
      }, err => {
      console.log(err);
    });

    this.apiCall.subSubCateFn.subscribe(result => {
      if(result != '0'){
         this.subSubCate = result
        }
      }, err => {
      console.log(err);
    });

    console.log('subCateID', this.subCategoryId)
    console.log('mainCateID', this.mainCateId)
    console.log('subsubCateID', this.subSubCate)

    this.productForm = this.formBuilder.group({
      productName: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      arabicName: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      qty: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      maxQty: ['',  [Validators.required, Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      productPrice: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      productDiscount: ['',  [Validators.required, Validators.required, Validators.pattern(/^(99(\.00?)?|[1-9]?\d(\.\d\d?)?)$/)]],
      // productDescription: ['',  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      managerPrice: [false,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      // orderVariants: [false,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      instructionsStatus: [false,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      // differentPriceVariant: [false,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      isComingSoon: [false,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      categoryId: [this.mainCateId,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      productCategoryId: [this.subCategoryId,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      productSubCategoryId: [this.subSubCate],
      storeId: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      relCategory: [''],
      relProCategory: [''],
      relsubCategory: [''],
      images: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      cuttingStyle: this.formBuilder.array([
        this.getcuttingStyle()
      ]),
      boxStyle: this.formBuilder.array([
        this.getboxStyle()
      ]),
    });
    this.productForm.get('relsubCategory').disable();
    this.getStoreList();
    this.getCatgoryList();

    this.apiCall.categoryFn.subscribe(result => {
      if(result != '0'){
        if(result['isEdit'] === true){
          this.isEdit = true;
          this.editProducts(result)
        } else {
          this.isEdit = false;
          this.productForm.reset();
          this.productForm.get('categoryId').setValue(this.mainCateId);
          this.productForm.get('productCategoryId').setValue(this.subCategoryId);
          this.productForm.get('productSubCategoryId').setValue(this.subSubCate);
          this.productForm.get('isComingSoon').setValue(false);
          this.productForm.get('instructionsStatus').setValue(false);
          this.productForm.get('managerPrice').setValue(false);
          this.finalFilterProduct = []
        }
        
        }
      }, err => {
      console.log(err);
    });
    this.cuttingStyle = this.productForm.controls.cuttingStyle.value
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  OnItemDeSelect(items: any) {
    console.log(items);
  }
  onSelectAll(items: any){
    console.log(items);
  }

  public editProducts(data){
    console.log(data)
    // return;
    var relCategory = null
    var relProCategory = null
    var relsubCategory = null
    var rel = data['relatedProduct']

    this.productId = data['id']

    if(rel.length > 0){
      var relCategory = rel[0].relCategory
      var relProCategory = rel[0].relProCategory
      var relsubCategory = rel[0].relsubCategory
    }

    var managerPrice = false
    var isComingSoon = false
    var instructionsStatus = false

    if(data['managerPrice'] == 'true'){
      var managerPrice = true
    }
    if(data['isComingSoon'] == 'true'){
      var isComingSoon = true
    }

    if(data['instructionsStatus'] == 'true'){
      var instructionsStatus = true
    }


    var cuttingStyle = data['cuttingStyle']
    var boxStyle = data['boxStyle']
    var cuttingArray = []
    var boxArray = []

    console.log(cuttingStyle)

    if(cuttingStyle.length > 0){
      for(var i=0; i < cuttingStyle.length; i++){
        cuttingArray.push(this.buildFormCuttingArray(cuttingStyle[i]))
      }
    }

    if(boxStyle.length > 0){
      for(var i=0; i < boxStyle.length; i++){
        boxArray.push(this.buildFormBoxArray(boxStyle[i]))
      }
    }

    if(data['managerPrice'] == 'true'){
      var managerPrice = true
    }
    if(data['isComingSoon'] == 'true'){
      var isComingSoon = true
    }

    this.finalFilterProduct = data['relatedProduct']
    this.selectedProductList = data['relatedProduct']
    this.proImages = data['images']
    this.cuttingStyle = data['cuttingStyle']

    this.selectedItems = data['storeProduct']

    this.productForm = this.formBuilder.group({
      productName: [data['productName'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      arabicName: [data['arabicName'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      productPrice: [data['productPrice'],  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      qty: [data['qty'],  [Validators.required, Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      maxQty: [data['maxQty'],  [Validators.required, Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      productDiscount: [data['productDiscount'],  [Validators.required, Validators.required, Validators.pattern(/^(99(\.00?)?|[1-9]?\d(\.\d\d?)?)$/)]],
      // productDescription: [data['productDescription'],  [ Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      managerPrice: [managerPrice,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      // orderVariants: [orderVariants,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      instructionsStatus: [instructionsStatus,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      // differentPriceVariant: [differentPriceVariant,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      isComingSoon: [isComingSoon,  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      categoryId: [data['categoryId'],  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      productCategoryId: [data['productCategoryId'],  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      productSubCategoryId: [data['productSubCategoryId']],
      storeId: [data['storeId'],  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
      relCategory: [relCategory],
      relProCategory: [relProCategory],
      relsubCategory: [relsubCategory],
      images: [''],
      cuttingStyle: this.formBuilder.array(cuttingArray),
      boxStyle: this.formBuilder.array(boxArray)
    });
  }

  buildFormCuttingArray(obj): FormGroup{
    return this.formBuilder.group({
      cuttingName: [obj.cuttingName,  [Validators.pattern(/^\S+(?: \S+)*$/)]],
      arabicName: [obj.arabicName,  [Validators.pattern(/^\S+(?: \S+)*$/)]],
      cuttingPrice: [obj.cuttingPrice,  [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
    })
  }

  buildFormBoxArray(obj): FormGroup{
    return this.formBuilder.group({
      boxName: [obj.boxName,  [Validators.pattern(/^\S+(?: \S+)*$/)]],
      arabicName: [obj.arabicName,  [Validators.pattern(/^\S+(?: \S+)*$/)]],
      boxPrice: [obj.boxPrice,  [ Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
    })
  }

  // onSelectFile(event, i){
  //   const file = event.target.files && event.target.files[0];
  //   this.variantArray.forEach((item, index) => {
  //       this.variantArray[i].image =  file
  //   })
  //   console.log(this.variantArray)
  // }

  // productVariantChange(value, type, i){
  //   this.variantArray.forEach((item, index) => {
  //     if(type == 'name'){
  //       this.variantArray[i].name =  value
  //     }
  //     if(type == 'price'){
  //       this.variantArray[i].price =  value
  //     }
  //     if(type == 'stock'){
  //       this.variantArray[i].stock =  value
  //     }
  //   })
  //   console.log(this.variantArray)
  // }

  private getcuttingStyle() {
    return this.formBuilder.group({
      cuttingName: ['',  [Validators.pattern(/^\S+(?: \S+)*$/)]],
      arabicName: ['',  [Validators.pattern(/^\S+(?: \S+)*$/)]],
      cuttingPrice: ['',  [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]]
    })
  }

  private getboxStyle() {
    return this.formBuilder.group({
      boxName: ['',  [Validators.pattern(/^\S+(?: \S+)*$/)]],
      arabicName: ['',  [Validators.pattern(/^\S+(?: \S+)*$/)]],
      boxPrice: ['',  [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]]
    })
  }

  addboxStyle(){
    let control = <FormArray>this.productForm.controls.boxStyle;
    control.push(
      this.formBuilder.group({
        boxName: ['',  [Validators.pattern(/^\S+(?: \S+)*$/)]],
        arabicName: ['',  [Validators.pattern(/^\S+(?: \S+)*$/)]],
        boxPrice: ['',  [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]]
      })
    )
  }

  addcuttingStyle(){
    let control = <FormArray>this.productForm.controls.cuttingStyle;
    control.push(
      this.formBuilder.group({
        cuttingName: ['',  [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]],
        arabicName: ['',  [Validators.pattern(/^\S+(?: \S+)*$/)]],
        cuttingPrice: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]]
      })
    )
  }

  deleteCuttingStyle(index){
    let control = <FormArray>this.productForm.controls.cuttingStyle;
    control.removeAt(index)
  }

  deleteBoxStyle(index){
    let control = <FormArray>this.productForm.controls.boxStyle;
    control.removeAt(index)
  }

  getCatgoryList(){
    var params = {
      url: 'admin/getAllCategory',
      data: {
      }
    }
    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.category = response.body.data
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  onChangeCategory(id, value){
    // console.log(id)
    // return;
    if(value === 'Category'){
      this.productCategory(id)
    } else {
      const object = { type: 'SUBCATEGORY', id: id, isActive: 'none'}
      this.getProductList(object)
    }
  }
  getProductList(object){
    var params = {
      url: 'admin/getProductList',
      data: object
    }
    // console.log(params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          // console.log(response.body)
          this.productList = response.body.data.products
          // this.subCategory = response.body.data
          console.log(response.body)
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        console.log('Error', error)
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  onChangeSubCategory(value){
    var params = {
      url: 'admin/findSubCategory',
      data: {
        id: value
      }
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          if(response.body.isSubcate == 1) {
            this.productForm.get('relsubCategory').enable();
            this.subSubCategory = response.body.data
            this.productList = []
          } else {
            this.productForm.get('relsubCategory').disable();
            this.subSubCategory = []
            this.productList = response.body.data
          }
          // this.subCategory = response.body.data
          console.log(response.body)
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        console.log('Error', error)
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }
  productCategory(id){
    var params = {
      url: 'admin/getProductCategory',
      data: {
        categoryId: id
      }
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        // console.log(response.body)
        if (response.body.error == false) {
          this.subCategory = response.body.data
          // console.log(this.subCategory)
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        console.log('Error', error)
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  getStoreList(){
    var params = {
      url: 'admin/getAllStores',
      data: {}
    }
    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.dropdownList = response.body.data
          // console.log(this.dropdownList)
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },

      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }

  changeProductImages(e: any){
    for (var i = 0; i < e.target.files.length; i++) { 
      this.productImages.push(e.target.files[i]);
    }
  }

  onChangeProducts(id): void {
    this.selectedProduct = this.productList.filter(value => value.id === parseInt(id));

    this.selectedProductList.push(this.selectedProduct[0])

    var result = this.selectedProductList.reduce((unique, o) => {
      if(!unique.some(obj => obj['id'] === o['id'] )) {
        unique.push(o);
      }
      return unique;
      },[]);

      this.finalFilterProduct = result
      console.log(this.finalFilterProduct)
  }

  async onSubmit(){
    
    console.log(this.productForm.value)
    // console.log(this.productForm)
    // console.log(this.variantArray)
    console.log(this.productImages)
    this.submitted = true;
    console.log(this.productForm.value)
    if (!this.productForm.valid) {
      this.apiCall.showToast('Please Fill the mandatory field', 'Error', 'errorToastr')
      return false;
    }

    console.log('submit')

    var variantList = []
    // var proImages = []
    const productObject = {}
    this.spinner.show();
    productObject['productName'] = this.productForm.value.productName
    productObject['arabicName'] = this.productForm.value.arabicName
    productObject['productPrice'] = this.productForm.value.productPrice
    productObject['productDiscount'] = this.productForm.value.productDiscount
    // productObject['productDescription'] = this.productForm.value.productDescription

    // productObject['orderVariants'] = this.productForm.value.orderVariants
    productObject['instructionsStatus'] = this.productForm.value.instructionsStatus
    // productObject['differentPriceVariant'] = this.productForm.value.differentPriceVariant

    productObject['managerPrice'] = this.productForm.value.managerPrice
    productObject['isComingSoon'] = this.productForm.value.isComingSoon

    productObject['qty'] = this.productForm.value.qty
    productObject['maxQty'] = this.productForm.value.maxQty
    

    productObject['categoryId'] = this.productForm.value.categoryId
    productObject['productCategoryId'] = this.productForm.value.productCategoryId
    productObject['productSubCategoryId'] = this.productForm.value.productSubCategoryId
    productObject['storeId'] = JSON.stringify(this.productForm.value.storeId)
    productObject['boxStyle'] = JSON.stringify(this.productForm.value.boxStyle)
    productObject['cuttingStyle'] = JSON.stringify(this.productForm.value.cuttingStyle)

    productObject['relCategory'] = this.productForm.value.relCategory
    productObject['relProCategory'] = this.productForm.value.relProCategory
    productObject['relsubCategory'] = this.productForm.value.relsubCategory
    productObject['relatedProducts'] = JSON.stringify(this.finalFilterProduct)
    // console.log(productObject)
    // return
    if(this.isEdit){
      this.updateProducts(productObject)
      return;
    }

    var imgLength = this.productImages.length;
    for (var i = 0; i < this.productImages.length; i++) { 
      const imageformData = new FormData();
      imageformData.append("uploaded_file", this.productImages[i]);
      var image = await this.apiCall.imageuploadFunctions(imageformData);
      const imgObj = {}
      imgObj['productImage'] = image['uploadUrl']
      this.proImages.push(imgObj)
      if(0 === --imgLength) {
        console.log('final Call')
        console.log(productObject)
        productObject['images'] = JSON.stringify(this.proImages)
        this.saveProductService(productObject);
      }
    }
  }

  saveProductService(object){
    var params = {
      url: 'admin/addProduct',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == 'false') {
          this.productForm.reset();
          this.productForm.get('categoryId').setValue(this.mainCateId);
          this.productForm.get('productCategoryId').setValue(this.subCategoryId);
          this.productForm.get('productSubCategoryId').setValue(this.subSubCate);
          this.productForm.get('isComingSoon').setValue(false);
          this.productForm.get('instructionsStatus').setValue(false);
          this.productForm.get('managerPrice').setValue(false);
          this.spinner.hide();
          this.apiCall.setProductValue('products')
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          // this.router.navigateByUrl('/product-stats');
        } else {
          this.spinner.hide();
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.spinner.hide();
        console.log('Error', error)
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )
  }
  
  updateProducts(data){
    data['images'] = JSON.stringify(this.proImages)
    // data['productVariants'] = JSON.stringify(this.variantArray)
    data['relatedProducts'] = JSON.stringify(this.finalFilterProduct)
    data['id'] = this.productId

    // console.log(data)
    // return;

    var params = {
      url: 'admin/editProduct',
      data: data
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        // console.log(response.body)
        if (response.body.error == 'false') {
          this.productForm.reset();
          this.productForm.get('categoryId').setValue(this.mainCateId);
          this.productForm.get('productCategoryId').setValue(this.subCategoryId);
          this.productForm.get('productSubCategoryId').setValue(this.subSubCate);
          this.productForm.get('isComingSoon').setValue(false);
          this.productForm.get('instructionsStatus').setValue(false);
          this.productForm.get('managerPrice').setValue(false);
          this.spinner.hide();
          this.apiCall.setProductValue('products')
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          // this.router.navigateByUrl('/product-stats');
        } else {
          this.spinner.hide();
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.spinner.hide();
        console.log('Error', error)
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      }
    )

    console.log('update product')
    console.log(data)
  }

}
