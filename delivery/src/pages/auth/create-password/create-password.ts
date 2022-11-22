import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { SigninPage } from '../signin/signin';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';

/**
 * Generated class for the CreatePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-create-password',
  templateUrl: 'create-password.html',
})
export class CreatePasswordPage {
	passwordForm 							: any;
	showSpinner 						: any;		
	displayError						: any;	
	userid 								: any;
	constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private deliveryService: DeliveryServiceProvider) {
		this.showSpinner						= false;
		this.displayError 						= false;
		this.userid 							= this.navParams.get('user_id');
		this.passwordForm 						= this.formBuilder.group({
			userid 									: [this.userid],
            password								: ["", Validators.required],
            confirmpassword							: ["", Validators.required]
        });
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CreatePasswordPage');
	}

	createPassword() {
		console.log(this.passwordForm.value);
		if (!this.passwordForm.valid) {
            this.displayError = true;
            return false;   
        }
        if(this.passwordForm.value.password != this.passwordForm.value.confirmpassword) {
        	this.deliveryService.mobiToast("Password does not match!", "danger");;
        	return false;
        }
        this.showSpinner 						= true;
        let postData 							: any = {};
            postData.password 				    	= this.passwordForm.value.password,
            
         this.deliveryService.updateProfileInfo(postData, this.passwordForm.value.userid).then((result) => {
            // this.deliveryService.generatePassword(postData).then((result) => { 
            let resultData                : any;
                resultData                = result;

                console.log(resultData);
            this.showSpinner              = false;
            if(resultData.data !== undefined)
            {
                this.deliveryService.mobiToast("Password has been sent, redirecting...", "success").then(() => {
                    this.navCtrl.setRoot(SigninPage, {});
                });
                
            }else{
                this.deliveryService.mobiToast("Technical issue!!!", "danger").then(() => {
                   
                });
            }
        });
	}

}
