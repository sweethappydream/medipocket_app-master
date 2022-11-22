import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, Searchbar, ModalController } from 'ionic-angular';
import { DomSanitizer } from "@angular/platform-browser";
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
import { FormBuilder, Validators } from '@angular/forms';
import { DrugSpecPage } from '../../pages/drug-spec/drug-spec';
import { PrescriptionFinalizePage } from '../../pages/prescription-finalize/prescription-finalize';
import { RequestConfirmationPage } from '../../pages/request-confirmation/request-confirmation';
import * as moment from 'moment';


/**
 * Generated class for the RequestDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-request-details',
  templateUrl: 'request-details.html',
})
export class RequestDetailsPage {
	@ViewChild('autosearch') autosearch: Searchbar;
	currOrder 					: any;
	searchDataForm 				: any;
    showAddDrugFab                                   : any; 
    autoCompleteResultShow                              : any;
    autoCompleteNoResultShow                          : any;
    currentDrug                                      : any;
    drugSelected                                      : any;
    searchItemSelected                                 : any;
    autocomplete                                     : any;
    showspinner                                      : any;
    addingInProgress                                  : any;
    searchOptionData                                  : any;
    predictions                                      : any;
    submitted                                         : any;

    addedDrugs                                        : any;
	constructor(public modalCtrl: ModalController, public tempStorage: TempStorageProvider, public deliveryService: DeliveryServiceProvider, private formBuilder: FormBuilder, private sanitization: DomSanitizer, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
		console.log(this.navParams.data);
		this.currOrder			= this.navParams.data.order;

		this.searchDataForm                             = this.formBuilder.group({
            term                                        : ["", Validators.required],
            gpi10s                                       : [""],
        });
        this.drugSelected                               = {QtyPrediction:[{}]};
        this.addedDrugs                                = [];

        if(this.navParams.data.action == 'new') {
            if(Object.keys(this.currOrder.order.medications).length) {
                for(var item in this.currOrder.order.medications) {
                    this.addedDrugs.push(this.currOrder.order.medications[item]);
                }
            }
        }
        else{
            if(Object.keys(this.currOrder.order.doctor_suggested_medications).length) {
                for(var item in this.currOrder.order.doctor_suggested_medications) {
                    this.addedDrugs.push(this.currOrder.order.doctor_suggested_medications[item]);
                }
            }
        }
        
        
	}

	ionViewDidLoad() {
	console.log('ionViewDidLoad RequestDetailsPage');
	}

	dismiss() {
        this.viewCtrl.dismiss();
    }

    searchbarClick() {
        this.showAddDrugFab = false;
    }

    ajaxMedicine(event) {
        this.showAddDrugFab                                 = false;
        this.autoCompleteResultShow                         = false;
        this.autoCompleteNoResultShow                       = false;
        let keyword                                         = event.value;
        this.currentDrug                                    = null;
        this.drugSelected                               = {QtyPrediction:[{}]};
        if(keyword == "" || this.searchItemSelected)
        {
            this.autocomplete                               = [];
            this.autoCompleteResultShow                     = false;
            this.autoCompleteNoResultShow                   = false;
            this.searchItemSelected                         = false;
            if(keyword == "") {
                this.drugSelected                           = {};
            }
            
            return false;
        }

        this.autocomplete                                   = [];
        this.showspinner                                    = true;
        this.addingInProgress   = false;
        this.resetgpi12();
        
        //console.log(event.value);
        this.deliveryService.ajaxDrugs({term: keyword}).then((result) => {
            this.autocomplete                                   = [];
            let resultData                 : any;
                resultData                 = result;

                //console.log(resultData);
                if(resultData.drugs.length > 0) {
                    for (var i = 0; i < resultData.drugs.length; i++) {
                        let item = resultData.drugs[i];
                        let obj : any = {
                            value               : item.GPI10s,
                            GPI10s               : item.GPI10s[0],
                            text                : item.BN,
                            DrugTypes           : item.DrugTypes,
                            display_name        : item.BN,
                            BN                  : [item.BN],
                            AN                  : ((item.AN)?[item.AN]:[]),
                            brand_text          : ((item.AN)?((item.DrugTypes=="B")?"Brand for "+item.AN:"Gneric for "+""+item.AN):"")
                        }
                        let indexMatched : any = this.deliveryService.contains(this.autocomplete, item.GPI10s[0], "GPI10s", true);
                      //  console.log(i);
                      //  console.log(indexMatched);
                       if(indexMatched >= 0){
                            ((this.deliveryService.contains(this.autocomplete[indexMatched]['BN'], item.BN)?"":this.autocomplete[indexMatched]['BN'].push(item.BN)));

                            ((this.deliveryService.contains(this.autocomplete[indexMatched]['AN'], item.AN)?"":this.autocomplete[indexMatched]['AN'].push(item.AN)));

                            this.autocomplete[indexMatched]['brand_text'] =  ((this.autocomplete[indexMatched]['AN'].length > 0)?((item.DrugTypes=="B")?"Brand for "+this.autocomplete[indexMatched]['AN'].join(","):"Gneric for "+this.autocomplete[indexMatched]['AN'].join(",")):"")
                            
                       }else{
                        // this.searchOptionData[item.slug] = obj;
                        this.autocomplete.push(obj);
                       } 
                        
                    }
                    this.autoCompleteResultShow                     = true;
                }
                else{
                    this.autoCompleteNoResultShow                   = true;
                }                
                this.showspinner                                    = false;
              //  console.log(this.autocomplete);
               // console.log(this.autocomplete.length);
        });
    }

    updateAC(item) {
        this.searchDataForm.patchValue({term: item.text});
        this.searchDataForm.patchValue({gpi10s: item.value});
        this.searchItemSelected = true;
        this.autoCompleteResultShow = false;
        let GPI10s_array : any = item.value;
        let GPI10s : any = GPI10s_array.join();
        this.drugSelected                               = {QtyPrediction:[{}]};
        this.trigger_gpi14(GPI10s);
        // this.drugSpec(item);
    }

    trigger_gpi14(gpi10 = "") {
        this.resetdosage();
        this.trigger_dosage(gpi10);
    }

    trigger_dosage(gpi10 = "") {
        let params       : any = {gpi10: gpi10};
        let strength     : any = [];
        let count : any = 0;
        this.addingInProgress = true;
        
        this.deliveryService.rxapi_strength(params).then((result) => {
            let resultData         : any;
                resultData               = result;
            this.predictions             = [];
            this.predictions             = resultData.predictions;
            if(resultData.predictions.length > 0) {
                this.drugSelected =  {...this.predictions[0]};
                this.drugSelected.QtySelected = {...this.predictions[0].QtyPrediction[0]};

                console.log(this.drugSelected);
                this.drugSpec(this.drugSelected, this.predictions);
            }
            this.addingInProgress = false;
        })
    }

    drugSpec(selecteddrug: any, predictions: any ) {
        let drugSpecModal = this.modalCtrl.create(DrugSpecPage, {drug: selecteddrug, order: this.currOrder, predictions: predictions});
        drugSpecModal.onDidDismiss(data => {
            console.log('page > modal dismissed > data > ', data);
            if(data){
                console.log(data.drug);
                this.addedDrugs.push(data.drug);
                this.onClearMedicineSearch(null);
            }                
        });
        drugSpecModal.present();
    }

    resetdosage() {
    }
    resetgpi12() {
    }

    onClearMedicineSearch(event: any) 
    {
        this.drugSelected                                    = {};
        this.resetgpi12();
        
    }

    onCancelMedicineSearch()
    {
        console.log("cancel");
    }
    needConsultation() {
        this.deliveryService.mobiconfirm("Are you sure, this request needs consultation?").then(value => {
            if (value) {
                let postData: any = {};
                postData.order_status                    = "need_consultation";
                this.submitted                           = true;
                if(this.currOrder.order.activities === undefined || this.currOrder.order.activities == null || this.currOrder.order.activities == ""){
                    postData.activities     = [];
                }
                else{
                    postData.activities = this.currOrder.order.activities;
                }
                postData.activities.push({msg: "need_consultation", created_at: moment().format("X")});
                this.deliveryService.createRequest({request_status: "need_consultation", request_from: this.currOrder.request_from, request_to: this.currOrder.request_to, actioned_id: this.currOrder.actioned_id}, this.currOrder._id).then((result)=>{
                    console.log("Request result " + result);
                });
                this.deliveryService.createOrder(postData, this.currOrder.order._id).then((result)=>{
                    this.submitted = false;   
                    let resultData : any =  result;
                    if(resultData.insertedId !== undefined){
                        this.deliveryService.mobiToast("Updating, please wait..", "success").then((result) => {
                            this.navCtrl.setRoot(RequestConfirmationPage, {gotopage: "newrequest", purpose: "need_consultation"});
                            // this.navCtrl.setRoot(CheckoutPage, { createdOrderId: resultData.insertedId, payOption:payOption});
                        });
                    }else if(resultData.updatedId !== undefined){
                        this.deliveryService.mobiToast("Updating, please wait..", "success").then((result) => {
                            this.navCtrl.setRoot(RequestConfirmationPage, {gotopage: "newrequest", purpose: "need_consultation"});
                            // this.navCtrl.setRoot(CheckoutPage, { createdOrderId: resultData.updatedId, payOption:payOption});
                        });
                    }else{
                        this.deliveryService.mobiToast("some technicall issue, please contact adminstrator", "danger");
                    }
                })
            }
        });
        
    }
    submit() {
        if(this.addedDrugs.length > 0 ) {
            let postData : any = {};
            // postData._id                             = this.currOrder.order._id;
            postData.order_status                    = "eprescription";
            postData.activities                      = [];
            postData.doctor_suggested_medications           = {};
            if(this.currOrder.order.activities === undefined || this.currOrder.order.activities == null || this.currOrder.order.activities == ""){
                postData.activities     = [];
            }
            else{
                postData.activities = this.currOrder.order.activities;
            }
            postData.activities.push({msg: "eprescription", created_at: moment().format("X")})

            for(let y = 0; y <= this.addedDrugs.length - 1; y++) {
                postData.doctor_suggested_medications[this.addedDrugs[y].NDC] = {};
                postData.doctor_suggested_medications[this.addedDrugs[y].NDC] = this.addedDrugs[y];
            }
            this.navCtrl.push(PrescriptionFinalizePage, {order: this.currOrder, create_order: postData, create_request: {request_status: "eprescription", request_from: this.currOrder.request_from, request_to: this.currOrder.request_to, actioned_id: this.currOrder.actioned_id}});
            /* let presFinalizeModal = this.modalCtrl.create(PrescriptionFinalizePage, {order: this.currOrder, create_order: postData, create_request: {request_status: "eprescription", request_from: this.currOrder.request_from, request_to: this.currOrder.request_to, actioned_id: this.currOrder.actioned_id}});
            presFinalizeModal.onDidDismiss(data => {
                console.log('page > modal dismissed > data > ', data);
                if(data){
                    console.log(data.drug);
                    this.addedDrugs.push(data.drug);
                    this.onClearMedicineSearch(null);
                }                
            });
            presFinalizeModal.present(); */


                /* this.deliveryService.createRequest({request_status: "eprescription", request_from: this.currOrder.request_from, request_to: this.currOrder.request_to, actioned_id: this.currOrder.actioned_id}, this.currOrder._id).then((result)=>{
                    console.log("Request result " + result);
                });
                this.deliveryService.createOrder(postData, this.currOrder.order._id).then((result)=>{
                    this.submitted = false;   
                    let resultData : any =  result;
                    if(resultData.insertedId !== undefined){
                        this.deliveryService.mobiToast("Confirming your order", "success").then((result) => {
                            this.navCtrl.pop();
                            // this.navCtrl.setRoot(CheckoutPage, { createdOrderId: resultData.insertedId, payOption:payOption});
                        });
                    }else if(resultData.updatedId !== undefined){
                        this.deliveryService.mobiToast("Confirming your order", "success").then((result) => {
                            this.navCtrl.pop();
                            // this.navCtrl.setRoot(CheckoutPage, { createdOrderId: resultData.updatedId, payOption:payOption});
                        });
                    }else{
                        this.deliveryService.mobiToast("some technicall issue, please contact adminstrator", "danger");
                    }
                }) */
                console.log(postData);
        }
        else{
            this.deliveryService.mobiToast("Please add atleast one drug!", "danger").then(() => {
                console.log("no drugs added");
            });
        }
        
        
    }

    removeDrug(index: any) {
        this.deliveryService.mobiconfirm("Are you sure to remove it?").then(value => {
            if (value) {
                this.addedDrugs.splice(index, 1);
            }
        });
        
    }
}
