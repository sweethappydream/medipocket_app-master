import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { RegisterPage } from '../register/register';
import { RegisterOtpVerifyPage } from '../register-otp-verify/register-otp-verify';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../../providers/temp-storage/temp-storage';
import { ForgetPasswordPage } from '../forget-password/forget-password';
import { AppSettings } from '../../../app/settings';
import { e } from '@angular/core/src/render3';

/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {
	logintype 										: any;
	loginForm                                       : any;
	passwordLogin 									: any;
	defaultPasswordBtnColor 						: any;
	defaultOtpBtnColor		 						: any;
	passwordInputtype								: any;
	passwordInputPH 								: any;
	displayError 									: any;
	loginSpinner 									: any;
	ionInputType 									: any;
	isSubmitted : any =  false;
	constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private deliveryService: DeliveryServiceProvider, private tempStorage: TempStorageProvider) {
		this.logintype 								= this.navParams.get('logintype');
		this.isSubmitted  =  false;
		/* #40525a */
		this.passwordLogin 							= true;
		this.defaultOtpBtnColor 					= 'redinput';
		this.defaultPasswordBtnColor 				= 'dark';
		this.passwordInputtype						= 'password';
		this.ionInputType							= 'password';
		this.passwordInputPH 						= '********';
		this.loginSpinner 							= false;
		this.loginForm 								= this.formBuilder.group({
            username								: ["kkarda77@gmail.com", Validators.required],
            password								: ["kapilkk", Validators.required]
        });
	}

	ionViewDidLoad() {
	console.log('ionViewDidLoad SigninPage');
	}

	

	doRegister(type)
	{
		// console.log(type);
		this.navCtrl.push(RegisterPage, {registertype: type});
	}

	takeToRegister(){
		this.navCtrl.push(RegisterPage,{});
	}
	takeToForget() {
		this.navCtrl.push(ForgetPasswordPage);
	}
	takeToOtpVerify(){
		this.navCtrl.push(RegisterOtpVerifyPage);
	}

	doSignin()
	{
		if (!this.loginForm.valid) {
            this.displayError = true;
            return false;   
		}
		
		this.isSubmitted        = true;
        this.loginSpinner              	  = true;
        let postData                      = this.loginForm.value;
            postData.user_type                 = AppSettings.usertype;
         	this.deliveryService.login(postData).then((result) => { 
	            let resultData                  : any;
	                resultData                  = result;
	            this.loginSpinner               = false;
	            if(typeof resultData.user_id !== "undefined" )
	            {
					this.isSubmitted        = false;
	            	let userData			  		: any;
					setTimeout(()=>{
						this.tempStorage.setAuthSession(resultData);
	                    this.events.publish('user:loggedin', resultData, Date.now());
	                }, 1000);
	                
	            }else{
					this.isSubmitted        = false;
					if(resultData){
					let errorData = JSON.parse(resultData);
						if(errorData.error !== undefined){
							this.deliveryService.mobiToast("Invalid credentials !!!", "danger");
						}
					}
				}
			},
			(error)=>{
				console.log(error);
			}); 
       

        
	}

	forgotPassword() {

	}

	resendOTP() {
		let postData                      = this.loginForm.value;
            postData.type                 = this.logintype;
            postData.resend               = true;
	}

}
