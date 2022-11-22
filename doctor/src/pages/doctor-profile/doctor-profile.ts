import { Component, ViewChild } from '@angular/core';
import { AppSettings } from '../../app/settings';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { SingleImageUploadComponent } from "../../components/single-image-upload/single-image-upload";
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { ImageUploadAdvancedPage } from '../../pages/image-upload-advanced/image-upload-advanced';
import { DomSanitizer } from "@angular/platform-browser";
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
import { mobiscroll, MbscSelect, MbscSelectOptions, MbscNumpadOptions, MbscPopupOptions } from '@mobiscroll/angular';
import { LandingPage } from '../../pages/auth/landing/landing';

/**
 * Generated class for the DoctorProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
mobiscroll.settings = {
    theme: 'ios'
};
@Component({
  selector: 'page-doctor-profile',
  templateUrl: 'doctor-profile.html',
})
export class DoctorProfilePage {
    pageSpinner                      : any;
    showSpinner                      : any;
    education                        : any;
    idproof                          : any;
    displayError                     : any;
    tempData                         : any = {country: null, state: null, city: null, license_country: null, license_state: null};
    processResponseStatic = (arr) => {
        arr.unshift(this.emptyValue);
        return arr;
    }
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
	@ViewChild(SingleImageUploadComponent) singleImageUpload: SingleImageUploadComponent;
    @ViewChild('mbscRemoteCoun') remoteCoun: MbscSelect;
	@ViewChild('mbscRemoteReg') remoteReg: MbscSelect;
    @ViewChild('mbscRemoteDiv') remoteDiv: MbscSelect;
    @ViewChild('mbscRemoteLicCoun') remoteLicCoun: MbscSelect;
    @ViewChild('mbscRemoteLicReg') remoteLicReg: MbscSelect;
    httpurl                         : any = AppSettings.API_ENDPOINT;
    localurl                        : any = AppSettings.localurl;
    nodeserverurl                   : any = AppSettings.nodeserverurl;
    usertype                        : any = AppSettings.usertype;
    city	= '';
    specialitySettings: MbscSelectOptions = {
        theme: 'ios',
        filter: true
    };
    medicalSchoolSettings: MbscSelectOptions = {
        theme: 'ios',
        filter: true
    };
    degreeSettings: MbscSelectOptions = {
        theme: 'ios'
    }
    yearSettings: MbscSelectOptions = {
        theme: 'ios'
    }
    specialityItems                 : any = AppSettings.doctor_speciality;
    medicalSchoolItems              : any = AppSettings.doctor_medical_school;
    degreeItems                     : any = AppSettings.doctor_degree;
    yearItems                       : any = AppSettings.doctor_year;

    countryData : any = {
        url: this.httpurl + 'public-collections/mp_countries/',
        dataType: 'json',
        remoteFilter: true,
        processResponse: this.processResponse,
        /* headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "X-Amz-Date": "",
            "X-Api-Key": true,
            "X-Amz-Security-Token": ""
        } */
    };

    license_countryData : any = {
        url: this.httpurl + 'public-collections/mp_countries/',
        dataType: 'json',
        remoteFilter: true,
        processResponse: this.processResponse
    };
    stateData : any = {
        url: this.httpurl + 'public-collections/mp_states/0',
        dataType: 'json',
        remoteFilter: true,
        processResponse: this.processResponse,
        /* headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "X-Amz-Date": "",
            "X-Api-Key": true,
            "X-Amz-Security-Token": ""
        } */
    };
    license_stateData : any = {
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
    emptyValue = { value: '', text: '', disabled: true };
    countrySettings: MbscSelectOptions = {
        data: this.countryData,
        filter: true,
        onSet: (ev, inst) => {
            console.log(ev);
            console.log("test");
            this.profileFormData.patchValue({countryname: ev.valueText});
            if(typeof inst !== 'boolean' && ev.valueText != this.tempData.country) {
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
    license_countrySettings: MbscSelectOptions = {
        data: this.license_countryData,
        filter: true,
        onSet: (ev, inst) => {
            this.profileFormData.patchValue({license_countryname: ev.valueText});
            if(typeof inst !== 'boolean' && ev.valueText != this.tempData.license_country) {
                this.tempData.license_state = null;
            }
            this.remoteLicReg.instance.settings.invalid.length = 0;
            this.remoteLicReg.instance.settings.data.url = this.httpurl + 'public-collections/mp_states/' + this.profileFormData.value.license_country + '/';

            if(this.tempData.license_state === null) {
                this.profileFormData.patchValue({licence_state: ""});
            }
            
            setTimeout(() => {
                this.remoteLicReg.instance.refresh();
                this.remoteLicReg.instance.enable();
                if(this.tempData.license_state !== null) {
                    this.profileFormData.patchValue({license_state: this.tempData.license_state});
                    // this.license_stateSettings.onSet(null, true);
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
            if(typeof inst !== 'boolean' && ev.valueText != this.tempData.state) {
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

    license_stateSettings: MbscSelectOptions = {
        data: this.license_stateData,
        disabled: true,
        filter: true,
        onSet: (ev, inst) => {
            this.profileFormData.patchValue({license_statename: ev.valueText});
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

	protected uploadFinished = false;
    uploadedAvatar               : any;
    profileFormData 			 : any;
    user_id                      : any;
    @ViewChild('verifyPhone')
    VerifyPhone: any;
    verifyPhonesettings: MbscPopupOptions = {
        display: 'center',
        buttons: [
            {
                text: 'Close',
                handler: 'cancel'
            },
            {
                text: 'Verify',
                handler: (event, inst) => {
                    // do your check here
                    console.log(this.verifyOtp);
                    if (this.verifyOtp) {
                        this.verifyAndCreate(inst);
                        //inst.hide();
                    } else {
                        this.deliveryService.mobiToast("OTP can't be empty", "danger");
                        return false;
                    }
					/*if (youWantoCloseIt) {
						inst.hide();
					} else {
						// do other things
					}*/
                }
            }
        ],

        onSet: (event, inst) => {
            // Your custom event handler goes here



        },
        onClose: (event, inst) => {
            // Your custom event handler goes here
        }
    };
    verifyOtp: number;
    showspinnerOTP: any;

    numpadSettings: MbscNumpadOptions = {
        theme: 'ios',
        template: 'dddd',
        allowLeadingZero: true,
        placeholder: '-',

        validate: (event) => {
            return {
                disabled: [],
                invalid: event.values.length !== 4
            };
        }
    };
    
	constructor(public modalCtrl: ModalController, public tempStorage: TempStorageProvider, private formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams, private deliveryService: DeliveryServiceProvider, private sanitization: DomSanitizer) {
      //  console.log(this.tempStorage.authsession);
        this.user_id = this.tempStorage.authsession.userdata.user_id;
        this.showSpinner                    = false;
		this.profileFormData 			= this.formBuilder.group({
            name                        	: ["", Validators.required],
            email                        	: ["", Validators.required],
            phone                           : ["", Validators.required],
            phone_verified                  : [false, Validators.required],
            
			city                        	: ["", Validators.required],
            cityname                        : [""],
			state                        	: ["", Validators.required],
            statename                       : [""],
            country                         : ["", Validators.required],
            countryname                     : [""],
			speciality						: ["", Validators.required],
            medical_school                  : ["", Validators.required],
            degree                          : ["", Validators.required],
            year                            : ["", Validators.required],
            license_number                  : ["", Validators.required],
            license_country                 : [""],
            license_countryname             : [""],            
            license_state                   : [""],
            license_statename               : [""],
            license_expiry                  : ["", Validators.required],
            experience                      : ["", Validators.required]
        });
        this.education                      = [];

        this.idproof                        = [];
        this.displayError                    = false;
        this.uploadedAvatar                  = [];
        // this.getProfileInfo();
	}

	ionViewDidLoad() {
	    console.log('ionViewDidLoad DoctorProfilePage');
	}

    ionViewDidEnter() {
        this.pageSpinner                    = true;
        if(this.tempStorage.authsession.userdata === null )
        {
            this.navCtrl.setRoot(LandingPage);
            return;
        }
        
        this.getProfileInfo();
    }

	protected submit() {

        if(!this.profileFormData.valid) {
            this.displayError             = true;
            return false;
        }
        
        if(this.uploadedAvatar.length == 0) {
            /* if (this.singleImageUpload.images.length == 0) {
                this.deliveryService.mobiToast("Please add profile image", "danger");
                return;
            } */
            this.singleImageUpload.uploadImages().then((images) => {
                this.showSpinner                               = true;
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
                    this.uploadedAvatar.push(item);
                }
                this.updateProfileinfo();
                
            }).catch(() => {
            });
        }
        else{
            this.showSpinner                                    = true;
            this.updateProfileinfo();                
        }        
    }

    updateProfileinfo() {
        let postData                                     : any = {};
        postData.name                                    = this.profileFormData.value.name;
        postData.email                                   = this.profileFormData.value.email;
        postData.phone                                   = this.profileFormData.value.phone;
        postData.country                                 = this.profileFormData.value.country;
        postData.city                                    = this.profileFormData.value.city;
        postData.state                                   = this.profileFormData.value.state;
        postData.countryname                             = this.profileFormData.value.countryname;
        postData.cityname                                = this.profileFormData.value.cityname;
        postData.statename                               = this.profileFormData.value.statename;
        postData.experience                              = this.profileFormData.value.experience;
        postData.speciality                              = this.profileFormData.value.speciality;
        postData.degree                                  = this.profileFormData.value.degree;
        postData.medical_school                          = this.profileFormData.value.medical_school;
        postData.year                                    = this.profileFormData.value.year;
        postData.license_number                          = this.profileFormData.value.license_number;
        postData.license_country                         = this.profileFormData.value.license_country;
        postData.license_state                           = this.profileFormData.value.license_state;
        postData.license_countryname                     = this.profileFormData.value.license_countryname;
        postData.license_statename                       = this.profileFormData.value.license_statename;
        postData.license_expiry                          = this.profileFormData.value.license_expiry;
        postData.education                               = this.education;
        postData.idproof                                 = this.idproof;
        postData.avatar                                  = {};
        if(this.uploadedAvatar.length > 0) {
            postData.avatar                                  = this.uploadedAvatar[0];
        }
        
        console.log(postData);
        this.deliveryService.updateProfileInfo(postData, this.tempStorage.authsession.userdata.user_id).then((result) => {
            let resultData                               : any;
                resultData                               = result;
            this.showSpinner                             = false;
                if(resultData !== 'undefined') {
                    this.deliveryService.mobiToast("Profile updated successfully", 'success').then((result) => {
                        
                    });
                }
                else{
                    this.deliveryService.mobiToast("Error: Problem updating profile.", 'danger').then((result) => {
                
                    });
                }
            
        })
    }

    protected cancel() {
        this.deliveryService.confirm('Are you sure to cancel?').then(value => {
            if (value) {
                this.singleImageUpload.abort();
            }
        })
    }

    addEducation(index: any = -1) {
        let sendData         : any = {purpose: "education", for: "doctor", pagetitle: "Add educational details", imagelabel: "Certificate image", data: {}, action: "add"};
        if(index > -1) {
            sendData.data         = this.education[index];
            sendData.pagetitle    = "Update educational details";
            sendData.action       = "update";
        }
        console.log(this.education);
        let educationModal = this.modalCtrl.create(ImageUploadAdvancedPage, sendData);
        educationModal.onDidDismiss(data => {
            console.log('page > modal dismissed > data > ', data);
            if(data){
                if(data.loaded) {
                    if(index > -1) {
                        this.education[index] = data;
                    }
                    else{
                        this.education.push(data);
                    }
                }
                console.log(this.education);
            }                
        });
        educationModal.present();
    }

    deleteEdu(index: any) {
        this.deliveryService.confirm("Are you sure to remove it?").then(value => {
            if (value) {
                this.education.splice(index, 1);
            }
        });
    }

    editEdu(index : any) {
        this.addEducation(index);
    }

    addIDproof(index: any = -1) {
        let sendData         : any = {purpose: "idproof", for: "doctor", pagetitle: "Add ID proof", imagelabel: "Image", data: {}, action: "add"};
        
        if(index > -1) {
            sendData.data    = this.idproof[index];
            sendData.pagetitle    = "Update ID proof";
            sendData.action       = "update";
        }
        let idproofModal = this.modalCtrl.create(ImageUploadAdvancedPage, sendData);
        idproofModal.onDidDismiss(data => {
            console.log('page > modal dismissed > data > ', data);
            if(data){
                
                if(data.loaded) {
                    if(index > -1) {
                        this.idproof[index] = data;
                    }
                    else{
                        this.idproof.push(data);
                    }
                }
                console.log(this.idproof);
            }                
        });
        idproofModal.present();
    }

    deleteIDproof(index: any) {
        this.deliveryService.confirm("Are you sure to remove it?").then(value => {
            if (value) {
                this.idproof.splice(index, 1);
            }
        });
    }

    editProof(index: any) {
        this.addIDproof(index);
    }

    removeAvatar(image: any, index: any) {
        this.deliveryService.confirm("Are you sure to remove it?").then(value => {
            if (value) {
                this.uploadedAvatar.splice(index, 1);
            }
        });
    }

    getProfileInfo() {
        this.tempData                            = {country: null, state: null, city: null};
        this.deliveryService.profileInfo(this.usertype, this.tempStorage.authsession.userdata.user_id).then((result) => {
            let resultData : any;
                resultData = result;

            this.profileFormData.patchValue({
                name                             : resultData.data.name,
                email                            : resultData.data.email,
                phone                            : resultData.data.phone,
                phone_verified                   : resultData.data.phone_verified,
                // city                             : resultData.data.city,
                country                          : resultData.data.country,
                speciality                       : resultData.data.speciality,
                medical_school                   : resultData.data.medical_school,
                degree                           : resultData.data.degree,
                year                             : resultData.data.year,
                license_number                   : resultData.data.license_number,
                license_country                  : resultData.data.license_country,
                license_state                    : resultData.data.license_state,
                license_expiry                   : resultData.data.license_expiry,
                experience                       : resultData.data.experience
            });
            this.uploadedAvatar                  = [];
            if(resultData.data !== undefined && resultData.data.avatar !== undefined){
            if(Object.keys(resultData.data.avatar).length > 0) {
                let avatar = {
                    originalpath: resultData.data.avatar.originalpath,
                    path: this.sanitization.bypassSecurityTrustStyle("url(" + resultData.data.avatar.originalpath + ")")
                }
                this.uploadedAvatar.push(avatar);
            }
        }
            this.education                           = [];
            console.log(resultData.data.education);
            if(resultData.data.education && resultData.data.education.length > 0) {
                this.education                       = resultData.data.education;
                
            }
            this.idproof                           = [];
            if(resultData.data.idproof && resultData.data.idproof.length > 0) {
                this.idproof                         = resultData.data.idproof;
            }
            this.countrySettings.onSet({valueText: this.profileFormData.value.countryname}, true);
            this.license_countrySettings.onSet({valueText: this.profileFormData.value.license_countryname}, true);
            this.tempData.country                  = resultData.data.country;
            this.tempData.state                    = resultData.data.state;
            this.tempData.city                     = resultData.data.city;
            this.tempData.license_country          = resultData.data.license_country;
            this.tempData.license_state            = resultData.data.license_state;
            
            setTimeout(() => {
                this.pageSpinner                         = false;
            }, 500);
            /* setTimeout(() => { 
                this.profileFormData.patchValue({state: resultData.data.state});
                this.stateSettings.onSet(null, true);
                setTimeout(() => { 
                    this.profileFormData.patchValue({city: resultData.data.city});
                    this.pageSpinner                         = false;
                }, 500);
            }, 500); */
            
            console.log(result);
        })
    }

    verifyAndCreate(popoverInst) {
        //console.log(this.verifyOtp);
        this.showspinnerOTP = false;
        if (!this.verifyOtp) {
            this.displayError = true;
            return false;
        }
        this.showspinnerOTP = true;
        // if(type == 'trainer')
        // {
        let postData: any = {};
        postData.to = this.profileFormData.value.phone;
        postData.action = "verify-phone";
        postData.purpose = "otp";
        postData.source = "sms";
        postData.user_id = this.user_id;
        postData.otp = this.verifyOtp;
        // console.log(type); 
        return this.deliveryService.verifyOTP(postData).then((result) => {
            let resultData: any;
            resultData = result;
            this.showspinnerOTP = false;
            if (resultData.data !== undefined) {
                let updateObj = {};
                updateObj = {
                    phone: this.profileFormData.value.phone,
                    phone_verified: true
                };
               // this.profileInfo.phone = this.profileFormData.value.phone;
               // this.profileInfo.phone_verified = true;
                this.profileFormData.patchValue({
                    phone: this.profileFormData.value.phone,
                    phone_verified: true,
                });
                this.tempStorage.authsession.userdata.profileData.phone_verified = true;
                this.deliveryService.updateProfileInfo(updateObj, this.user_id).then((result) => {



                });
                this.deliveryService.mobiToast("OTP Verified, Successfully", "success");
                setTimeout(() => {
                    popoverInst.hide();
                }, 2000);

                return false;


            } else {
                this.deliveryService.mobiToast("Sorry, unable to verify. OTP not mathcing", "danger");
                return false;
            }
        });

        // }
        //console.log();
    }

    openVerifyWindow() {
        let postData: any = {};
        postData.msg = "will be replaced";
        postData.action = "verify-phone";
        postData.purpose = "otp";
        this.displayError = false;

        if (!this.profileFormData.value.phone) {
            this.displayError = true;
            this.deliveryService.mobiToast("Phone number can not be empty!!!", "danger");
            return false;
        }
        // postData.source 					= "email";
        //	postData.subject = "Otp to rest password";
        postData.to = this.profileFormData.value.phone; //this.profileInfo.phone,
        postData.user_id = this.user_id,

            //postData.resend                     = false
            //	postData.user_type = this.profileInfo.user_type;
            this.deliveryService.mobiToast('Sending OTP, Please wait...', 'success');
        this.deliveryService.registerGetOTP(postData).then((result) => {

            this.VerifyPhone.instance.show();

        });

    }

}
