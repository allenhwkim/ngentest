import { Component, OnInit } from '@angular/core';
import { GetUsageDeatilsResponse } from 'src/app/wireless/models/get-usage-details';
import { WirelessDashboardResponse } from 'src/app/wireless/models/wireless-dashboard';
import { TranslateService } from '@ngx-translate/core';
import { SuspendCtnService } from '../suspend-ctn.service';

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

  constructor(private translate: TranslateService) { }

  getBonusDataListForSharing(usageDetails) {
    const bonusDataList = {};
    usageDetails.body.dataPurchaseList.filter(item => item.cost === 0).forEach( (dataItem) => {
      dataItem.size++;
      dataItem.size--;
      bonusDataList[dataItem.size / 1024] = bonusDataList[dataItem.size] || [];
      bonusDataList[dataItem.size / 1024].push({ ...dataItem, size: dataItem.size / 1024 });
    });
    return bonusDataList;
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