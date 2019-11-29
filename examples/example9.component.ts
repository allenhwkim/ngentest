import { Component, OnInit } from '@angular/core';
import { GetUsageDeatilsResponse } from 'src/app/wireless/models/get-usage-details';
import { WirelessDashboardResponse } from 'src/app/wireless/models/wireless-dashboard';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-total-data-details',
  templateUrl: './total-data-details.component.html',
  styleUrls: ['./total-data-details.component.scss']
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
    usageDetails.body.dataPurchaseList.filter(item => item.cost === 0).forEach(dataItem => {
      bonusDataList[dataItem.size / 1024] = bonusDataList[dataItem.size] || [];
      bonusDataList[dataItem.size / 1024].push({ ...dataItem, size: dataItem.size / 1024 });
    });
    return bonusDataList;
  }

}