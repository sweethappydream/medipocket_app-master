import { Component,NgZone, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SingleImageUploadComponent } from "../../components/single-image-upload/single-image-upload";
// import { DrugInfoPage } from '../../../pages/delivery/drug-info/drug-info';
import { AppSettings } from '../../app/settings';
import { mobiscroll, MbscPopupOptions, MbscSelect, MbscSelectOptions } from '@mobiscroll/angular';
import { DomSanitizer } from "@angular/platform-browser";
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
import * as moment from 'moment';

/**
 * Generated class for the MembershipSignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
mobiscroll.settings = {
    theme: 'ios'
};
@Component({
  selector: 'page-delivery-profile',
  templateUrl: 'delivery-profile.html',
})
export class DeliveryProfilePage {
	
	profileFormData 					: FormGroup;
	today 								: any = new Date().toISOString();
	displayError 						: any;
	memberdetails						: any;
	cartOrders 							: any;
	profileUpdate : any;
	profileSpecSettings                                : MbscPopupOptions;
	tempData                         	: any = {country: null, state: null, city: null};
	
	user_id : any ;
	profileInfo : any;
	displayMode : boolean = false;

	@ViewChild(SingleImageUploadComponent) singleImageUpload: SingleImageUploadComponent;
	@ViewChild('mbscRemoteCoun') remoteCoun: MbscSelect;
	@ViewChild('mbscRemoteReg') remoteReg: MbscSelect;
    @ViewChild('mbscRemoteDiv') remoteDiv: MbscSelect;
	protected uploadFinished = false;
		uploadedAvatar               	: any = [];
		liveurl                         : any = AppSettings.liveurl;
		localurl 						: any = AppSettings.localurl;
		nodeserverurl                   : any = AppSettings.nodeserverurl;
		httpurl                         : any = AppSettings.API_ENDPOINT;
		emptyValue = { value: '', text: '', disabled: true };
		processResponse = (result) => {
	        let data : any = result.data;
	        var i,
	                item,
	                ret = [];

	            if (data) {
	                for (i = 0; i < result.data.length; i++) {
	                    item = data[i];
	                    ret.push({
	                        value: item._id,
	                        text: item.name
	                    });
	                }
	            }
	            // ret.unshift(this.emptyValue);
	            return ret;
	    }
	countryData : any = {
        url: this.httpurl + 'public-collections/mp_countries/',
        dataType: 'json',
        remoteFilter: true,
        processResponse: this.processResponse
    };
    stateData : any = {
        url: this.httpurl + 'public-collections/mp_states/0',
        dataType: 'json',
        remoteFilter: true,
        processResponse: this.processResponse
    };

    cityData: any = {
        url: this.httpurl + 'public-collections/mp_cities/0',
        dataType: 'json',
        remoteFilter: true,
        processResponse: this.processResponse
    };
    countrySettings: MbscSelectOptions = {
        data: this.countryData,
        filter: true,
        onSet: (ev, inst) => {
        	console.log(typeof inst);
        	console.log(inst);
            console.log(ev);
            console.log("test");
            console.log(this.tempData);
            this.profileFormData.patchValue({countryname: ev.valueText});
            if(typeof inst !== 'boolean') {
                this.tempData.state = null;
                this.tempData.city  = null;
            }
            this.remoteReg.instance.settings.invalid.length = 0;
            this.remoteReg.instance.settings.data.url = this.httpurl + 'public-collections/mp_states/' + this.profileFormData.value.country + '/';
            this.remoteDiv.instance.settings.invalid.length = 0;
            if(this.tempData.state === null) {
                this.profileFormData.patchValue({state: "", city: ""});
            }
            else{
                this.profileFormData.patchValue({city: ""});
            }
            
            setTimeout(() => {
                this.remoteReg.instance.refresh();
                this.remoteReg.instance.enable();
                this.remoteDiv.instance.disable();
                if(this.tempData.state !== null) {
                    this.profileFormData.patchValue({state: this.tempData.state});
                    this.stateSettings.onSet({valueText: this.profileFormData.value.statename}, true);
                }
            }, 200);
            
        }
    };
    stateSettings: MbscSelectOptions = {
        data: this.stateData,
        filter: true,
        disabled: true,
        onSet: (ev, inst) => {
        	this.profileFormData.patchValue({statename: ev.valueText});
            if(typeof inst !== 'boolean') {
                this.tempData.city  = null;
            }
            this.remoteDiv.instance.settings.invalid.length = 0;
            this.remoteDiv.instance.settings.data.url = this.httpurl + 'public-collections/mp_cities/' + this.profileFormData.value.state + '/';
            if(this.tempData.city === null) {
                this.profileFormData.patchValue({city: ""});
            }
            setTimeout(() => {
                this.remoteDiv.instance.refresh();
                this.remoteDiv.instance.enable();
                if(this.tempData.city !== null) {
                    this.profileFormData.patchValue({city: this.tempData.city});
                }
            }, 200);
        }
    };

    citySettings: MbscSelectOptions = {
        data: this.cityData,
        disabled: true,
        filter: true,
        onSet: (ev, inst) => {
        	this.profileFormData.patchValue({cityname: ev.valueText});
        }
    };
		
	constructor(private changeDetector : ChangeDetectorRef, public zone: NgZone, private formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams, private deliveryService: DeliveryServiceProvider, private tempService: TempStorageProvider, private sanitization: DomSanitizer) {
		
		console.log(this.navParams.get('viewMode'));
		this.displayMode 					= true;
		if(this.navParams.get('viewMode') !== undefined){
			this.displayMode = this.navParams.get('viewMode');
		}
		console.log(this.displayMode);
		// this.changeDetector.detectChanges();
		this.profileFormData 			= this.formBuilder.group({
            name                        	: ["", Validators.required],
			email: [{ value: "", disabled: true }, Validators.required],
			dob                        		: ["", Validators.required],
			gender                        	: ["", Validators.required],
			address 						: ["", Validators.required],
			city: ["", Validators.required],
			cityname 						: [""],
			state 							: ["", Validators.required],
			statename 						: [""],
			zip_code 						: ["", Validators.required],
			country 						: ["", Validators.required],
			countryname 					: [""],
			phone							: ["", Validators.required],
			avatar							: [{}]
            
        });
				
				this.user_id =  this.tempService.authsession.userdata.user_id;
				this.profileInfo = {};
				this.profileInfo.avatar = {}; 
				this.getProfileInfo();

			/*	this.profileFormData.controls['dob'].valueChanges.subscribe(
					(selectedValue) => {
						if(selectedValue){
							this.updateProfileFields({"dob": moment(selectedValue).format("X")});
						}
						console.log(selectedValue);
						 
					}
			);*/

		/*	this.profileFormData.controls['gender'].valueChanges.subscribe(
				(selectedValue) => {
					if(selectedValue){
						//this.updateProfileFields({"dob": moment(selectedValue).format("X")});
						this.profileInfo.gender = selectedValue;
					}
					console.log(selectedValue);
					 
				}
		);*/

			this.profileSpecSettings                           = {
				display: 'center',
				theme: 'ios', 
				buttons: [{
						text: 'Update',
						handler: 'set'
				}],
				onSet: function (event, inst) {
						console.log(event);
						console.log(inst);
						
				},
				onBeforeShow:function (event, inst) {
					console.log(event);
					console.log(inst);
					
			},
			
			
		};

	}

	ionViewDidLoad() {
		console.log(this.profileInfo);
		console.log('ionViewDidLoad MembershipSignupPage');
	}

	protected uploadAvatharFn(postData) {

		if(!this.profileFormData.valid) {
				this.displayError             = true;
				return false;
		}
		if (this.singleImageUpload.images.length == 0) {
				this.deliveryService.mobiToast("Please add profile image", "danger");
				return;
		}

		

		//let postData                         : any = {};
		this.singleImageUpload.uploadImages().then((images) => {
				this.uploadFinished                            = false;
				this.singleImageUpload.isUploading             = false;
				this.singleImageUpload.images                  = [];
				this.singleImageUpload.imagesValue             = [];
				this.singleImageUpload.imagesBase64            = [];
				this.singleImageUpload.uploadingHandler        = {};
				this.singleImageUpload.uploadingProgress       = {};
        

				for(var i = 0; i <= images.length -1; i++) {
						let item = {
								originalpath: images[i].file.path,
								path: this.sanitization.bypassSecurityTrustStyle("url(" + images[i].file.path + ")")
						}
						this.uploadedAvatar = [];
						this.uploadedAvatar.push(item);
				}
				
				postData.avatar                                  = this.uploadedAvatar[0];
		//		console.log(postData);
				this.updateProfileFields(postData);
				/*this.deliveryService.doctorProfile(postData).then((result) => {
						let resultData                               : any;
								resultData                               = result;
								if(resultData.status == 'success') {
										this.deliveryService.mobiToast(resultData.msg, 'success').then((result) => {
								
										});
								}
								else{
										this.deliveryService.mobiToast("Error: Problem updating profile.", 'danger').then((result) => {
								
										});
								}
						
				})*/
				
		}).catch(() => {
		});
}

	protected cancel() {
		this.deliveryService.confirm('Are you sure to cancel?').then(value => {
				if (value) {
						this.singleImageUpload.abort();
				}
		})
	}

	setDisplayMode(value:boolean){
		// console.log(this.profileInfo);
		if(!value) {
			this.displayMode = value;
			this.changeDetector.detectChanges();
			this.countrySettings.onSet({valueText: this.profileInfo.countryname}, true);			
		}
		else{
			this.profileFormData.patchValue({	
				country						: this.profileInfo.country,
				countryname					: this.profileInfo.countryname,
				state						: this.profileInfo.state,
				statename					: this.profileInfo.statename,
				city						: this.profileInfo.city,
				cityname					: this.profileInfo.cityname
			});
			this.tempData.country                  = this.profileInfo.country;
            this.tempData.state                    = this.profileInfo.state;
            this.tempData.city                     = this.profileInfo.city;
			this.remoteReg.instance.settings.data.url = this.httpurl + 'public-collections/mp_states/' + this.profileInfo.country + '/';
			this.remoteDiv.instance.settings.data.url = this.httpurl + 'public-collections/mp_cities/' + this.profileInfo.state + '/';
			this.displayMode = value;
		}

		
		
		
	/*	setTimeout(() => {
		this.profileFormData.patchValue(
			{
				gender: 'female',
			});
		}, 1000); */
	}

	removeAvatar(image: any, index: any) {
		this.deliveryService.confirm("Are you sure to remove it?").then(value => {
				if (value) {
						this.uploadedAvatar.splice(index, 1);
						this.profileFormData.patchValue(
							{
								avatar: {}
							}
					);
				}
		});
}
	updateProfileFields(Objs){

		this.deliveryService.updateProfileInfo(Objs, this.user_id).then((result)=>{
			let resultData : any = {};
			resultData    = result;
			//console.log(result);
			if(resultData.data !== undefined){
			 
				this.displayMode = true;

				
				
				
				this.deliveryService.mobiToast("Profile updated successfully.", "success");
			 setTimeout(()=>{

				this.profileInfo  = Objs;
				this.profileInfo.dob = moment.unix(Objs.dob).toISOString();
				
				if(this.profileInfo.avatar !== undefined && this.profileInfo.avatar.originalpath !== undefined){
					this.profileInfo.avatar.path     = this.sanitization.bypassSecurityTrustStyle("url(" + this.profileInfo.avatar.originalpath + ")");
					
					}
					// image form control value as well
					this.profileFormData.patchValue(
																					{
																						avatar: this.profileInfo.avatar
																					}
																			);
				this.tempData.country                  = this.profileInfo.country;
	            this.tempData.state                    = this.profileInfo.state;
	            this.tempData.city                     = this.profileInfo.city;

			 },500);
 
			}else{
				this.deliveryService.mobiToast("Error in updating profile.", "danger");
			}
			

			
		
		});

	}

	submitProfileInfo(){
		
		if (!this.profileFormData.valid) {
			// console.log(this.profileFormData.value);
            this.displayError = true;
            return false;   
		}else{
			// console.log(this.profileFormData.value);
			// return false;   
		}

		let postData =  {...this.profileFormData.value};
		postData.dob  = moment(postData.dob).format("X");
         
		
   // console.log(this.singleImageUpload.images);
		if (this.singleImageUpload !== undefined && this.singleImageUpload.images !== undefined && this.singleImageUpload.images.length > 0) {
		 this.uploadAvatharFn(postData);
		}else{
			this.updateProfileFields(postData);
		}
	   
		
	}
	getProfileInfo() {
		this.tempData                            = {country: null, state: null, city: null};
		this.deliveryService.profileInfo(AppSettings.usertype,this.user_id).then((result)=>{
				let resultData : any = {}; 
				resultData    = result;
				if(resultData.data !== undefined){
					this.zone.run(() => {	 
					   this.profileInfo = resultData.data;
						 this.profileInfo.dob = moment.unix(resultData.data.dob).toISOString();
						 
					
				if( this.profileInfo.avatar !== undefined && this.profileInfo.avatar.path !== undefined ){
						 this.profileInfo.avatar.path     = this.sanitization.bypassSecurityTrustStyle("url(" + this.profileInfo.avatar.originalpath + ")");
						 this.uploadedAvatar = [];
						this.uploadedAvatar.push(this.profileInfo.avatar);
						this.uploadedAvatar[0].path = this.sanitization.bypassSecurityTrustStyle("url(" + this.profileInfo.avatar.originalpath + ")");
				}else{
					this.profileInfo.avatar = {};
					this.uploadedAvatar = [];
				}
						 
					 //console.log(this.profileInfo);
						this.profileFormData.patchValue(
							{
								name: this.profileInfo.name,
								dob:  this.profileInfo.dob,
								gender: this.profileInfo.gender,
								address: this.profileInfo.address,
								zip_code: this.profileInfo.zip_code,
								country: this.profileInfo.country,
								countryname: this.profileInfo.countryname,
								statename: this.profileInfo.statename,
								cityname: this.profileInfo.cityname,
								phone: this.profileInfo.phone,
								email: this.profileInfo.email,
								avatar: this.profileInfo.avatar,

							});
						this.tempData.country                  = this.profileInfo.country;
			            this.tempData.state                    = this.profileInfo.state;
			            this.tempData.city                     = this.profileInfo.city;
							if(!this.displayMode) {
								this.countrySettings.onSet({valueText: this.profileFormData.value.countryname}, true);
							}
							else{
								
							}
							
						});

				}else{

				} 

		});	

	}


}
