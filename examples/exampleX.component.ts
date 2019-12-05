import { Component } from '@angular/core';

@Component({})
export class TotalDataDetailsComponent {

  doMore(param) {
    // TODO, this.dataDetails needs to be mocked FROM this.dataService
    this.dataDetails = this.dataService.getDataDetailsForSharing(this.usageDetails);
    this.totalRemainingPercentage = (this.dataDetails.remainingData / this.dataDetails.totalData) * 100;

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

  // setCreditCardDetails() {
  //   const cardImg = {
  //     visa: 'assets/visa.png',
  //     master: 'assets/master.png',
  //     amex: 'assets/amex.png'
  //   };
  //   this.creditCard = this.billingDetails.methodOfPayment.creditCardDetails;
  //   if (this.creditCard && this.creditCard.ccType) {
  //     this.ccImg = cardImg[this.creditCard.ccType.toLowerCase()];
  //   }
  //   this.ccExpiry = lastDayOfMonth(this.billingHeader.getLocalDate(this.creditCard.ccExpiry));
  //   this.ccExpiryDate = this.billingHeader.formatDate(this.ccExpiry, this.language);
  //   this.isCreditCardExpired = this.billingHeader.isCreditCardExpired(this.ccExpiry);
  //   this.isCreditCardExpiring = !this.isCreditCardExpired && this.billingHeader.isCreditCardExpiring(this.ccExpiry);
  //   this.showCCWarning = this.isCreditCardExpired || this.isCreditCardExpiring;
  //   this.daysTillExpired = this.isCreditCardExpiring && differenceInCalendarDays(this.ccExpiry, new Date());
  // }

}