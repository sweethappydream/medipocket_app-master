import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, ModalController } from 'ionic-angular';
import { MultiImageUpload } from "../../components/multi-image-upload/multi-image-upload";
import { DomSanitizer } from "@angular/platform-browser";
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
import { ImageSlidePage } from '../../pages/image-slide/image-slide';


/**
 * Generated class for the UploadRxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-upload-rx',
  templateUrl: 'upload-rx.html',
})
export class UploadRxPage {
	@ViewChild(MultiImageUpload) multiImageUpload: MultiImageUpload;
    protected uploadFinished = false;
    uploadedRXimages             : any;
	constructor(public tempStorage: TempStorageProvider, public modalCtrl: ModalController, private deliveryService: DeliveryServiceProvider, public navCtrl: NavController, private sanitization: DomSanitizer, public navParams: NavParams, private alertCtrl: AlertController, private toastCtrl: ToastController) {
        
        this.setuploadRX();
	}

	ionViewDidLoad() {
        console.log('ionViewDidLoad UploadRxPage');
        //console.log(this.multiImageUpload);
         this.multiImageUpload.showLibrary = false;
	}
    ionViewDidEnter() {
        this.setuploadRX();
        
    }
	protected submit() {
        if (this.multiImageUpload.images.length == 0) {
            this.deliveryService.mobiToast("Please select at least 1 photo", "danger");
            return;
        }

        this.multiImageUpload.uploadImages().then((images) => {
            this.deliveryService.mobiToast("Uploaded successfully.", 'success').then((result) => {
                this.uploadFinished                           = false;
                this.multiImageUpload.isUploading             = false;
                this.multiImageUpload.images                  = [];
                this.multiImageUpload.imagesValue             = [];
                this.multiImageUpload.imagesBase64            = [];
                this.multiImageUpload.uploadingHandler        = {};
                this.multiImageUpload.uploadingProgress       = {};


                for(var i = 0; i <= images.length -1; i++) {
                    let item = {
                        originalpath: images[i].file.path,
                        path: this.sanitization.bypassSecurityTrustStyle("url(" + images[i].file.path + ")")
                    }
                    this.uploadedRXimages.push(item);
                }
                this.tempStorage.uploadrx                      = this.uploadedRXimages;
            });
            
        }).catch(() => {
        });
    }

    protected cancel() {
        this.deliveryService.confirm('Are you sure to cancel?').then(value => {
            if (value) {
                this.multiImageUpload.abort();
            }
        })
    }

    setuploadRX() {
        console.log(this.multiImageUpload);
        this.uploadedRXimages                         = [];
        let getImages                               : any = [];
        getImages                         = this.tempStorage.uploadrx;
        for(var i = 0; i <= getImages.length -1; i++) {
            let item = {
                originalpath: getImages[i].originalpath,
                path: this.sanitization.bypassSecurityTrustStyle("url(" + getImages[i].originalpath + ")")
            }
            this.uploadedRXimages.push(item);
        }
        console.log(this.uploadedRXimages);
    }

    removeImage(image: any, index: any) {
        this.deliveryService.confirm("Are you sure to remove it?").then(value => {
            if (value) {
                this.uploadedRXimages.splice(index, 1);
                this.tempStorage.uploadrx = this.uploadedRXimages;
            }
        });
    }

    zoomImage(image: any) {
        let searchModal = this.modalCtrl.create(ImageSlidePage, {url: image.originalpath});
        searchModal.onDidDismiss(data => {
            console.log('page > modal dismissed > data > ', data);
            if(data){
            }                
        });
        searchModal.present();
    }

}
