import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { mobiscroll, MbscPopupOptions, MbscSelectOptions, MbscListviewOptions } from '@mobiscroll/angular';

/**
 * Generated class for the DrugSpecPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-drug-spec',
  templateUrl: 'drug-spec.html',
})
export class DrugSpecPage {
	currOrder 					: any;
	currDrug 					: any;
	drugSelected 				: any;
	drugFormData 				: any;
	predictions                                         : any;
    enhancedDrug                : any;
	variationsSettings: MbscPopupOptions = {
        display: 'top',
        anchor: '#showVariations',
        buttons: ['cancel'],
        cssClass: 'mbsc-no-padding md-vertical-list'
    };
    lvSettings: MbscListviewOptions = {
        enhance: true,
        swipe: false,
        onItemTap: function (event, inst) {
        }
    };
	constructor(private formBuilder: FormBuilder, public zone: NgZone, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
        this.predictions                                = [];
        this.drugSelected                               = {QtyPrediction:[{}], QtySelected:{}};
		this.drugSelected		= this.navParams.data.drug;
		this.currOrder 			= this.navParams.data.order;
        this.enhancedDrug                                = {QtyPrediction:[{}], QtySelected:{}}; 
		
		this.drugFormData 			= this.formBuilder.group({
            mg                        	: [{value: this.drugSelected.Strength, disabled: true}],
            type 						: [{value: this.drugSelected.DosageForm, disabled: true}],
            qty 						: [this.drugSelected.QtySelected.qty],
            morning 					: [""],
            noon						: [""],
            evening 					: [""],
            night						: [""]
        });
        setTimeout(() => {
            this.predictions         = this.navParams.data.predictions;
        }, 500);
       
		console.log(this.drugSelected);
	}

    updateDrugSelection(variationItem){
        this.zone.run(() => {
            this.drugSelected   = variationItem;
            console.log(variationItem);
            this.drugSelected.QtySelected = variationItem.QtyPrediction[0];
            this.drugFormData.patchValue({mg: this.drugSelected.Strength, type: this.drugSelected.DosageForm, qty: this.drugSelected.QtySelected.qty})
        });
    }

    addDrug() {
        this.enhancedDrug             = {...this.drugSelected};
        this.enhancedDrug.QtySelected.qty =  this.drugFormData.value.qty;
        this.enhancedDrug.usage           = {
            morning: this.drugFormData.value.morning,
            noon: this.drugFormData.value.noon,
            evening: this.drugFormData.value.evening,
            night: this.drugFormData.value.night                        
        };
        this.viewCtrl.dismiss({drug: this.enhancedDrug});
        console.log(this.enhancedDrug);
    }
	ionViewDidLoad() {
		console.log('ionViewDidLoad DrugSpecPage');
	}

	dismiss() {
        this.viewCtrl.dismiss();
    }

}
