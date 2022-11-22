import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { SingleImageUploadComponent } from "../../components/single-image-upload/single-image-upload";
import { FormBuilder, Validators } from '@angular/forms';
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { DomSanitizer } from "@angular/platform-browser";

/**
 * Generated class for the ImageUploadAdvancedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-image-upload-advanced',
  templateUrl: 'image-upload-advanced.html',
})
export class ImageUploadAdvancedPage {
	imageadvFormData						: any;
	uploadFinished 							: any;
	uploadedimages 							: any;
	displayError 							: any;
	postData 								: any;
	pagetitle 								: any;
	imagelabel 								: any;
    purpose                                 : any;
    data                                    : any;
    action                                  : any;
	@ViewChild(SingleImageUploadComponent) singleImageUpload: SingleImageUploadComponent;
	constructor(public deliveryService: DeliveryServiceProvider, private formBuilder: FormBuilder, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private sanitization: DomSanitizer) {
		this.pagetitle 						= this.navParams.get('pagetitle');
		this.imagelabel 					= this.navParams.get('imagelabel');
        this.purpose                        = this.navParams.get('purpose');
        this.data                           = this.navParams.get('data');
        this.action                         = this.navParams.get('action');
        if(this.purpose == 'education') {
            if(this.action == 'update') {
                this.imageadvFormData             = this.formBuilder.group({
                    title                             : [this.data.title, Validators.required],
                    univ                              : [this.data.univ, Validators.required],
                    comment                           : [this.data.comment, Validators.required]
                });
                this.setuploadImage();
            }
            else{
                this.imageadvFormData             = this.formBuilder.group({
                    title                             : ["", Validators.required],
                    univ                              : ["", Validators.required],
                    comment                           : ["", Validators.required]
                });
                this.uploadedimages             = [];
            }
        }
        else{
            
            if(this.action == 'update') {
                this.imageadvFormData             = this.formBuilder.group({
                    title                            : [this.data.title, Validators.required],
                    univ                             : [""],
                    comment                          : [this.data.comment, Validators.required]
                });
                this.setuploadImage();
            } else{
                this.imageadvFormData             = this.formBuilder.group({
                    title                            : ["", Validators.required],
                    univ                             : [""],
                    comment                          : ["", Validators.required]
                });
                this.uploadedimages             = [];
            }
        }
		
        this.displayError 				= false;
        this.postData					= {title: "", univ: "", comment: "", images: [], loaded: false};
        this.postData					= {};
	}

	protected submit() {
		if(!this.imageadvFormData.valid) {
			this.displayError = true;
            return false;   
		}
        this.postData = {};
        if(this.action == "update" && this.uploadedimages.length > 0) {
            this.deliveryService.mobiToast("Updated successfully.", 'success').then((result) => { 
                this.postData.title                       = this.imageadvFormData.value.title;
                this.postData.univ                        = this.imageadvFormData.value.univ;
                this.postData.comment                     = this.imageadvFormData.value.comment;
                this.postData.images                      = this.uploadedimages;
                this.postData.loaded                      = true;
                this.dismiss();
            });
        }
        else {
            if (this.singleImageUpload.images.length == 0) {
                this.deliveryService.mobiToast("Please select at least 1 photo", "danger");
                return;
            }
            this.singleImageUpload.uploadImages().then((images) => {
                this.deliveryService.mobiToast("Uploaded successfully.", 'success').then((result) => {
                    this.uploadFinished                           = false;
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
                        this.uploadedimages.push(item);
                    }
                    this.postData.title                       = this.imageadvFormData.value.title;
                    this.postData.univ                        = this.imageadvFormData.value.univ;
                    this.postData.comment                     = this.imageadvFormData.value.comment;
                    this.postData.images                      = this.uploadedimages;
                    this.postData.loaded                      = true;
                    this.dismiss();
                    // this.tempStorage.uploadrx                      = this.uploadedimages;
                });
                
            }).catch(() => {
            });
        }
        

        
        
    }

    protected cancel() {
        this.deliveryService.confirm('Are you sure to cancel?').then(value => {
            if (value) {
                this.singleImageUpload.abort();
            }
        })
    }

    setuploadImage() {
        console.log(this.data);
        this.uploadedimages                         = [];
        let getImages                               : any = [];
        getImages                                   = this.data.images;
        for(var i = 0; i <= getImages.length -1; i++) {
            let item = {
                originalpath: getImages[i].originalpath,
                path: this.sanitization.bypassSecurityTrustStyle("url(" + getImages[i].originalpath + ")")
            }
            this.uploadedimages.push(item);
        }
        console.log(this.uploadedimages);
        console.log(this.uploadedimages.length);
    }

    removeImage(image: any, index: any) {
        this.deliveryService.confirm("Are you sure to remove it?").then(value => {
            if (value) {
                this.uploadedimages.splice(index, 1);
            }
        });
    }
	ionViewDidLoad() {
		console.log('ionViewDidLoad ImageUploadAdvancedPage');
	}
	dismiss() {
		this.viewCtrl.dismiss(this.postData);
	}

}
