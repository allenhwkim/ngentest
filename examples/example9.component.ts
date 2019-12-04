import { Component, OnInit } from '@angular/core';
import { GetUsageDeatilsResponse } from 'src/app/wireless/models/get-usage-details';
import { WirelessDashboardResponse } from 'src/app/wireless/models/wireless-dashboard';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from '@rogers/oneview-components';
import { HttpClient } from '@angular/common/http';

import { SuspendCtnService } from '../suspend-ctn.service';
import { DataManagerService } from '../data-manager.service';

@Component({
  selector: 'app-total-data-details',
  templateUrl: './total-data-details.component.html',
  styleUrls: ['./total-data-details.component.scss']
  providers: [SuspendCtnService]
})
export class TotalDataDetailsComponent implements OnInit {

  data: any;
  addedDataList: any;
  bonusDataList: any;
  planDetails: any = {};
  totalData: number;
  totalCost: number;
  individualAlertMessage: string;

  constructor(
    private translate: TranslateService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private dataService: DataManagerService,
    private encryptionService: EncryptionService
  ) { }

  // TODO, !!!!! need mock for this.encryptionService and this.route.snapshot.params in a service
  urlData$ = this.encryptionService.decrypt(decodeURIComponent(this.route.snapshot.params['cipherText']), this.keyMap);

  ngOnInit() {
    // TODO !!!!! subList returns item.shareEverything?
    this.individualCtnList = this.accountSummary.subList.filter(item => !item.shareEverything.isSharingData);
    this.commonData.accountSummary.subList.filter(contact => contact.shareEverything.isPrimaryCtn)[0].subNumber;
    // TODO this.getPastUsage must return {ctnDataUsed, dates}
    const { ctnDataUsed, dates } = this.getPastUsage1(this.pastUsageBills, this.pricePlansList);
    // TODO this.getPastUsage must return [ctnDataUsed, dates]
    const [ ctnDataUsed2, dates2 ] = this.getPastUsage2(this.pastUsageBills, this.pricePlansList);
    const myVar = this.getPastUsage3(this.pastUsageBills, this.pricePlansList);
    // // TODO, this.dataService needs to be mocked FROM this.dataService
    // this.dataDetails = this.dataService.getDataDetailsForSharing(this.usageDetails);
    // this.usageSubscriptionBars = this.getUsageSubscriptionBars(this.usageDetails, this.dataDetails);
    // this.totalRemainingPercentage = (this.dataDetails.remainingData / this.dataDetails.totalData) * 100;
  }

  getPrimaryCtn(pricePlansCurrent): any {
    const featureGroup = pricePlansCurrent.featureGroupList
      .subscribe(group => group.featureGroup.label.en === 'Data')[0];

    return this.commonData.accountSummary.subList
      .filter(contact => contact.shareEverything.isPrimaryCtn)[0]
      .subNumber;
  }

  openErrorDialog(title, code): Observable<any> {
    return this.dialog.open(ErrorComponent, {
      data: {
        error: this.translate.instant(title), // TODO, this.translate.instant is not mocked
        content: this.translate.instant(code),
        showCustomButton: true,
        customButtonName: 'OK',
      },
      showCloseButton: true,
      backgroundClickClose: false
    }).dialogOutput;
  }

  getWirelessDetails() {
    return zip(
        this.getPostPaidDetails(this.ctn, this.ban), // TODO, need mock
        this.getCurrentSubsidy(this.ctn, +this.ban, cdr) // TODO, need mock
      ).pipe(
        tap(([ppDetails, _]) => {
          this.postPaidDetails = ppDetails;
        })
      );
  }

  getBonusDataListForSharing(usageDetails, subscriptionsDataUsage) {
    // TODO need mocks for `this.data.ctn`
    const seCTNList = subscriptionsDataUsage.data.seCTNList &&
      subscriptionsDataUsage.data.seCTNList.filter(ctn => ctn === this.data.ctn)[0];
  }

  // getObjToEncrypt() {
  //   let deviceDetailsNumber = '';
  //   let deviceDetail = null;
  //   deviceDetail = this.deviceDetails[deviceDetailsNumber];
  //   const obj = {
  //     1: this.ctn,
  //     8: this.accSub.firstName,
  //     5: this.email,
  //     6: deviceDetail ? deviceDetail.EN.productTitle : '',
  //     7: deviceDetail ? deviceDetail.FR.productTitle : '',
  //     9: this.email // email
  //   };
  //   // TODO need this.deviceDetails[{EN:xxx, FR:xxx}]

  //   const dialogComponent = this.dialogService.open(HupErrorComponent, { data: { result, reasonCode } });
  //   dialogComponent.userAction.subscribe(ret => ret);
  //   // TODO this.dialogService.open().userAction. required
  // }

  getPastUsage(bills: RogersRestBillResponse[], pricePlansList: PricePlansListCurrentResponse[]) {
    const ctnDataUsed = {};
    const dates = [];
    bills.forEach(bill => {
      const dataSharedBundle = bill.shared_bundles.shared_bundle.filter(bundle => bundle.category === 'Data')[0];
      dataSharedBundle.used_amount_details.forEach((usedAmountDetails, index) => {
        const phoneNumber = usedAmountDetails.subscriber_phone_number.split('-').join('');
        ctnDataUsed[phoneNumber] = ctnDataUsed[phoneNumber] || {};
        ctnDataUsed[phoneNumber]['name'] = ctnDataUsed[phoneNumber]['name'] || usedAmountDetails.subscriber_first_name;
        ctnDataUsed[phoneNumber][bill.issue_date] = usedAmountDetails.used_amount;
        ctnDataUsed[phoneNumber]['totalUsage'] = ctnDataUsed[phoneNumber]['totalUsage'] || 0;
        ctnDataUsed[phoneNumber]['totalUsage'] += +usedAmountDetails.used_amount;
      });

      // Total usage per date
      const totalUsageThisDate = dataSharedBundle.used_amount_details.reduce((acc, val) => acc + +val.used_amount, 0);
      dates.push({ issueDate: bill.issue_date, totalUsageThisDate });
    });
  }

  funcParamAsArray(myParam) {
    myParam.map( ([param1, param2]) => {
      param1.foo.bar.baz = 1;
      param2.a.b.c = 2;
    });
  }

  funcParamAsObject(myParam) {
    myParam.subscribe( ({param3, param4}) => {
      param3.foo.bar.baz = 3;
      param4.a.b.c = 4;
    });
  }

  funcParamAsCombined(myParam) {
    myParam.subscribe( ([param1, param2, {param3, param4}]) => {
      param1.foo.bar.baz = 1;
      param2.a.b.c = 2;
      param3.x.y.z = 3;
      param4.one.two.three = 4;
    });
  }
}