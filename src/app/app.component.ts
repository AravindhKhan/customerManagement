import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'custManagement';

  registerForm: FormGroup;
  submitted = false;
  editMode = false;
  enableform = false;

  constructor(private formBuilder: FormBuilder) { }

  public countryCodes: string[] = ["+91", "+101", "+67"];
  selectedCountryCode = "+91";

  customerDatas:Array<any> = [
    // {id:Math.floor(Math.random() * Math.floor(5)+1),firstName:"Aravindh",lastName:"S",userName:"aravindh",phoneNumber:"76785657",countryCode:"+91"},
    // {id:Math.floor(Math.random() * Math.floor(5)+1),firstName:"Sony",lastName:"s",userName:"sony",phoneNumber:"234567",countryCode:"+91"}
  ]
  
  ngOnInit(){
    // localStorage.setItem("customerDatas", JSON.stringify(this.customerDatas));
    this.customerDatas = JSON.parse(localStorage.getItem("customerDatas") || "[]");
    this.enableform = this.customerDatas.length == 0 ? true : false;
    this.registerForm = this.formBuilder.group({
      id:Math.floor(Math.random() * 100) + 1,
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      phoneNumber: ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10)]],
      countryCode: [this.selectedCountryCode, Validators.required]
  });
  }

  onAddCustomer(){
    this.enableform = true;
  }

  onCountryCodeChange(event){
    var currentCountryCode = event.target.value;
   this.registerForm.get('countryCode').setValue(currentCountryCode);
  }

  onSubmit(){
    this.submitted = true;
    if (this.registerForm.invalid) {
      console.log(JSON.stringify(this.registerForm.value));
    }
    else{
      if(!this.editMode){
        var duplicateCustomerData = this.customerDatas;
        duplicateCustomerData.push(this.registerForm.value);
        localStorage.setItem("customerDatas", JSON.stringify(duplicateCustomerData));
        this.onFormReset();
      }
      else{
      var selectedCustomer = this.registerForm.value;
      var duplicateCustomerData = this.customerDatas;
      var index = duplicateCustomerData.findIndex(customer =>customer.id == selectedCustomer.id)
      duplicateCustomerData[index] = selectedCustomer;
      localStorage.setItem("customerDatas", JSON.stringify(duplicateCustomerData));
      this.customerDatas = duplicateCustomerData;
      this.editMode = false;
      this.onFormReset();
      }
    }
  }

  onFormReset(){
    this.registerForm.reset();
    this.submitted = false;
    this.enableform = false;
    this.registerForm.get('countryCode').setValue(this.selectedCountryCode);
    this.registerForm.get('id').setValue(Math.floor(Math.random() * 100) + 1);
    document.getElementById("tabledataid_row").scrollIntoView();
  }

  onEditCustomer(selectedCustomer){
   this.editMode = true;
   this.enableform = true;
   this.registerForm.patchValue(selectedCustomer);
  }

  onDeleteCustomer(selectedCustomer){
    this.customerDatas = this.customerDatas.filter(customer=> customer.id != selectedCustomer.id);
    localStorage.setItem("customerDatas", JSON.stringify(this.customerDatas));
  }

  onCancel(){
    this.registerForm.get('countryCode').setValue(this.selectedCountryCode);
    this.onFormReset();
    this.editMode = false;
  }

  onHideDialog(){
    this.onFormReset();
    this.editMode = false;
  }

}
