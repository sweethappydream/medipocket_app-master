import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FileTransfer, FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { MbscScrollViewOptions } from '@mobiscroll/angular';

/**
 * Generated class for the ImageOriginalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
	selector: 'page-image-original',
	templateUrl: 'image-original.html',
})
export class ImageOriginalPage {
	url 						: any;
	fullpageSettings: MbscScrollViewOptions = {
		theme: 'ios'
	};
	constructor(private transfer: FileTransfer, private file: File, public navCtrl: NavController, public navParams: NavParams) {
		this.url 				= this.navParams.data.url;
	}

	ionViewDidLoad() {
	console.log('ionViewDidLoad ImageOriginalPage');
	}

	downloadImage(url: any = null) {
		const fileTransfer: FileTransferObject = this.transfer.create();
		fileTransfer.download(url, this.file.dataDirectory + 'file.pdf').then((entry) => {
		console.log('download complete: ' + entry.toURL());
		}, (error) => {
		// handle error
		});
	}

}
