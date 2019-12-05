import { Component } from '@angular/core';

@Component({})
export class TotalDataDetailsComponent {

  doMore(param) {
    // TODO, this.dataDetails needs to be mocked FROM this.dataService
    this.dataDetails = this.dataService.getDataDetailsForSharing(this.usageDetails);
    // this.totalRemainingPercentage = (this.dataDetails.remainingData / this.dataDetails.totalData) * 100;

    // let deviceDetail;
    // deviceDetail = this.deviceDetails[deviceDetailsNumber];
    // const title = {
    //   en: deviceDetail ? deviceDetail.EN.productTitle : '',
    //   fr: deviceDetail ? deviceDetail.FR.productTitle
    // };

    // const x = param.x.y.z;
    // x.foo.bar();

    // const dialogComponent = this.dialogService.open(HupErrorComponent, { data: { result, reasonCode } });
    // dialogComponent.userAction.subscribe(ret => ret);
  }

}