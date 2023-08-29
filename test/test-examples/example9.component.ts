import { Component, OnInit } from '@angular/core';
import { GetUsageDeatilsResponse } from 'src/app/wireless/models/get-usage-details';
import { WirelessDashboardResponse } from 'src/app/wireless/models/wireless-dashboard';
import { ServiceFive } from '@ngx-serviceFive/core';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from '@rogers/oneview-components';
import { HttpClient } from '@angular/common/http';

import { SuspendcccService } from '../suspend-ccc.service';
import { DataManagerService } from '../data-manager.service';

@Component({
  selector: 'app-total-data-details',
  templateUrl: './total-data-details.component.html',
  styleUrls: ['./total-data-details.component.scss']
  providers: [SuspendcccService]
})
export class TotalDataDetailsComponent implements OnInit {

  data: any;
  addedDataList: any;
  bonusDataList: any;
  planDetails: any = {};
  totalData: number;
  totalCost: number;
  individualAlertMessage: string;

  urlData$ = this.encryptionService.decrypt(decodeURIComponent(this.route.snapshot.params['cipherText']), this.keyMap);

  constructor(
    private serviceFive: ServiceFive,
    private http: HttpClient,
    private route: ActivatedRoute,
    private dataService: DataManagerService,
    private encryptionService: EncryptionService
  ) { }

  ngOnInit() {
    this.individualcccList = this.ssssMmmm.subList.filter(item => !item.shareEverything.isSharingData);
    this.service8.ssssMmmm.subList.filter(contact => contact.shareEverything.isPrimaryccc)[0].numSxFoo;
    const { cccDataUsed, dates } = this.getPastUsage1(this.pastUsageBills, this.pricePlansList);
    const [ cccDataUsed2, dates2 ] = this.getPastUsage2(this.pastUsageBills, this.pricePlansList);
    const myVar = this.getPastUsage3(this.pastUsageBills, this.pricePlansList);
  }

  getPrimaryccc(pricePlansCurrent): any {
    const featureGroup = pricePlansCurrent.featureGroupList
      .subscribe(group => group.featureGroup.label.en === 'Data')[0];

    return this.service8.ssssMmmm.subList
      .filter(contact => contact.shareEverything.isPrimaryccc)[0]
      .numSxFoo;
  }

  openErrorserviceThree(title, code): Observable<any> {
    return this.serviceThree.open(Component64, {
      data: {
        error: this.serviceFive.instant(title),
        content: this.serviceFive.instant(code),
        showCustomButton: true,
        customButtonName: 'OK',
      },
      showBbbbCccc: true,
      backgroundClickClose: false
    }).serviceThreeOutput;
  }

  getWirelessDetails() {
    return zip(
        this.getPostPaidDetails(this.ccc, this.ban), 
        this.getCurrentSubsidy(this.ccc, +this.ban, cdr)
      ).pipe(
        tap(([ppDetails, _]) => {
          this.postPaidDetails = ppDetails;
        })
      );
  }

  getBonusDataListForSharing(usageDetails, subscriptionsDataUsage) {
    const secccList = subscriptionsDataUsage.data.secccList &&
      subscriptionsDataUsage.data.secccList.filter(ccc => ccc === this.data.ccc)[0];
  }

  getPastUsage(fuz: RogersRestBillResponse[], pricePlansList: PricePlansListCurrentResponse[]) {
    const cccDataUsed = {};
    const dates = [];
    fuz.forEach(bill => {
      const dataSharedBundle = bill.shared_bundles.shared_bundle.filter(bundle => bundle.category === 'Data')[0];
      dataSharedBundle.used_amount_details.forEach((usedAmountDetails, index) => {
        const phoneNumber = usedAmountDetails.subscriber_phone_number.split('-').join('');
        cccDataUsed[phoneNumber] = cccDataUsed[phoneNumber] || {};
        cccDataUsed[phoneNumber]['name'] = cccDataUsed[phoneNumber]['name'] || usedAmountDetails.subscriber_first_name;
        cccDataUsed[phoneNumber][bill.issue_date] = usedAmountDetails.used_amount;
        cccDataUsed[phoneNumber]['totalUsage'] = cccDataUsed[phoneNumber]['totalUsage'] || 0;
        cccDataUsed[phoneNumber]['totalUsage'] += +usedAmountDetails.used_amount;
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