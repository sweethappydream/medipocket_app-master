import { Component, ViewChild } from '@angular/core';
import {
	NavController,
	NavParams,
	ModalController,
	Content
} from 'ionic-angular';
import { SearchMedicinesPage } from '../search-medicines/search-medicines';
// import { MembershipPlanPage } from '../../membership/membership-plan/membership-plan';
import { MembershipCardPage } from '../../membership-card/membership-card';
import { PatientProfilePage } from '../../delivery/patient-profile/patient-profile';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../../providers/temp-storage/temp-storage';
import { DrugInfoPage } from '../drug-info/drug-info';
import { TabPage } from '../../tab/tab';
import { SigninPage } from '../../auth/signin/signin';
// import * as moment from 'moment';
import { App } from 'ionic-angular';
import { ModalPage } from '../modal-page-popup/model-page';
import { SocialSharing } from '@ionic-native/social-sharing';
import { MbscPopupOptions } from '../../../lib/mobiscroll-package';
import { AlertController } from 'ionic-angular';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	userloggedin: boolean;
	toWhom: any = 'family';
	fromPage: any;
	pincode: number;
	pincodeMatch = false;
	@ViewChild(Content) content: Content;

	popupsettings: MbscPopupOptions = {
		display: 'center',
		anchor: '#showVariation',
		//buttons: [],
		cssClass: 'my-btn'
	};
	constructor(
		public deliveryService: DeliveryServiceProvider,
		private app: App,
		public tempStorage: TempStorageProvider,
		public navCtrl: NavController,
		public navParams: NavParams,
		public modalCtrl: ModalController,
		public socialSharing: SocialSharing,
		public alertCtrl: AlertController
	) {
		console.log(this.userloggedin);
		this.tempStorage.setCartMembership();
		//this.tempStorage.setProfileMembership();
		/*  this.deliveryService.getMememberShip(this.tempStorage.authsession.userdata.user_id).then((result) => {
          let resultData                           : any;
              resultData                           = result;
          //this.tempStorage.profile                 = resultData;
        console.log(resultData.data);
        //console.log(resultData.data.membership_end);
          if(resultData.data !== undefined){
              let currentTime = moment().format("X");
            if (currentTime <= resultData.data.membership_end){
                this.tempStorage.setProfileMembership('active', "premium");
              }else{
                this.tempStorage.setProfileMembership('active', "free");
              }
        }else{
            this.tempStorage.setProfileMembership('active', "free");
        }
          
         // console.log(this.tempStorage.profile);

      })*/
		//console.log(this.tempStorage.authsession.userdata);
		if (this.tempStorage.authsession.userdata.profileIncompelete) {
			this.navCtrl.push(PatientProfilePage);
			// this.navCtrl.setRoot(HomePage);
		}
		this.fromPage = this.navParams.get('fromPage');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad HomePage');
		this.content.resize();
	}

	searchMedicines() {
		this.navCtrl.push(SearchMedicinesPage);
		/* let searchModal = this.modalCtrl.create(SearchMedicinesPage);
      searchModal.onDidDismiss(data => {
          console.log('page > modal dismissed > data > ', data);
          if(data){
          }                
      });
      searchModal.present(); */
	}

	ionViewDidEnter() {
		console.log('test');
	}

	cartcount() {
		return this.tempStorage.cart.medications.drugs.length;
	}

	showUpcoming() {
		this.deliveryService.mobiAlert('', 'This feature is coming soon');
	}
	goto(action: any) {
		if (action == 'druginfo') {
			// this.searchDataForm.patchValue({ term: "" });
			// console.log(this.tempStorage.cart);
			if (
				this.tempStorage.cart.pharmacy !== undefined &&
				this.tempStorage.cart.pharmacy !== null &&
				this.tempStorage.cart.pharmacy.pricing !== undefined &&
				this.tempStorage.cart.pharmacy.pricing.length > 0
			) {
				this.navCtrl.push(DrugInfoPage);
			} else {
				this.deliveryService.mobiToast(
					'Please choose price & pharmacy',
					'danger'
				);
			}
		}
	}

	onLogout() {
		console.log(this.tempStorage);
		this.tempStorage.clearAuthSession();
		this.tempStorage.clearCart();
		this.navCtrl.setRoot(SigninPage);
		this.app.getRootNavs()[0].setRoot(SigninPage);
	}

	chooseMembership() {
		this.navCtrl.setRoot(TabPage);
	}

	presentModal() {
		const myModel = this.modalCtrl.create('ModalPage');
		myModel.present();
	}

	discount() {
		const modal = this.navCtrl.push(MembershipCardPage);
	}

	shareMpCard() {
		let msg =
			'Show this with your prescription at the pharmacy counter and receive the instant savings.';
		let shareImageUrl = {
			family: 'https://mymedipocket.com/qa/img/pharmacy-savings-card-front.png',
			pet: 'https://mymedipocket.com/qa/img/pharmacy-savings-card-front-pet.png'
		};
		//console.log(this.httpurl +"assets/pdf/" +this.PoDetail.po_ref +".pdf");
		this.socialSharing
			.shareWithOptions({
				message: msg,
				url: 'https://mymedipocket.com/',
				files: [shareImageUrl[this.toWhom]],
				/////data/user/0/techbee.otpc/753025443.pdf"
				chooserTitle: 'MediPocket Pharmacy Discount Card'
			})
			.then(result => {
				// this.analytics.trackEvent("Share Success" , result.app);
			})
			.catch(err => {
				/// this.analytics.trackEvent("Share Fail" , JSON.stringify(err));
			});
	}

	showPrompt() {
		const prompt = this.alertCtrl.create({
			title: 'Check Availability',
			message: '',
			inputs: [
				{
					name: 'pincode',
					placeholder: 'Enter your zipcode here',
					type: 'number'
				}
			],
			buttons: [
				{
					text: 'Cancel',
					cssClass: 'danger'
				},
				{
					text: 'Continue',
					handler: data => {
						console.log(JSON.stringify(data)); //to see the object
						console.log(data.pincode);
						this.pincode = data.pincode;
						this.checkAvailbility();
					},
					cssClass: 'primary'
				}
			],
			cssClass: 'check-availability-alert-box'
		});
		prompt.present();
	}

	showPromptTwo() {
		if (this.pincodeMatch) {
			const prompt = this.alertCtrl.create({
				title: 'Great!',
				message: 'MediDelivery service is available in your area',
				buttons: [
					{
						text: 'Not Now',
						handler: data => {
							console.log('Cancel clicked');
						},
						cssClass: 'danger'
					},
					{
						text: 'Continue', // Rx Lowest Price search
						handler: data => {
							this.goToSearchMedicinesPage();
						},
						cssClass: 'primary'
					}
				],
				cssClass: 'check-availability-alert-box'
			});
			prompt.present();
		} else {
			const prompt = this.alertCtrl.create({
				title: 'Sorry!',
				message: 'MediDelivery service is not available in your zip code yet ',
				buttons: [
					{
						text: 'CONTINUE RX LOWEST PRICE SEARCH', // Rx Lowest Price search
						handler: data => {
							console.log('Saved clicked');
							this.goToSearchMedicinesPage();
						},
						cssClass: 'primary'
					}
				],
				cssClass: 'check-availability-alert-box'
			});
			prompt.present();
		}
	}

	checkAvailbility() {
		console.log(this.pincode);
		const availablePincodes = [
			91406,
			91423,
			91324,
			91325,
			91326,
			91327,
			90024,
			90210,
			90077,
			91316
		];
		for (const item of availablePincodes) {
			if (item == this.pincode) {
				this.pincodeMatch = true;
				break;
			} else {
				this.pincodeMatch = false;
			}
		}
		this.showPromptTwo();
	}

	goToSearchMedicinesPage() {
		this.navCtrl.push(SearchMedicinesPage);
	}
}
