import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { interactionsIconMap } from './interactions-icon-map';
@Component({
  selector: 'app-interactions',
  templateUrl: './interactions.html',
  styleUrls: [`./interactions.scss`]
})

export class InteractionsComponent implements OnInit, AfterViewInit {
  interactions: any;
  pagedInteractions: any = [];
  interactionErr: any;
  filteredInteractions: any;
  optionsList: any = [];
  selectedFilter = 'All';
  searchString = '';
  datePipe = new DatePipe('en-US');
  __currentPage = 1;
  numItemsInPage = 6;
  totalPages: number;

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    const interactionList = this.route.snapshot.data['interactions'];
    this.getInteractions(interactionList);
    if (!this.interactionErr) {
      this.currentPage = 1;
      this.totalPages = Math.ceil(this.interactions.length / this.numItemsInPage);
      this.optionsList = this.interactions.map(item => item.topics[0].callReason1)
      .filter((value, index, self) => self.indexOf(value) === index);
    }
  }

  ngAfterViewInit() {
    // TODO: refactor this to a directive or component'
    if (window.innerWidth < 600 || window.innerWidth > 900) {
      return false;
    }
    const tableEl: any = document.querySelector('table');
    const thEls = tableEl.querySelectorAll('thead th');
    const tdLabels = Array.from(thEls).map((el: any) => el.innerText);
    tableEl.querySelectorAll('tbody tr').forEach( tr => {
      Array.from(tr.children).forEach(
        (td: any, ndx) =>  td.setAttribute('label', tdLabels[ndx])
      );
    });
  }

  get currentPage() {
    return this.__currentPage;
  }

  set currentPage(pageNum) {
    this.__currentPage = Math.min(pageNum, this.totalPages) || 1;
    const staIndex = (pageNum - 1) * this.numItemsInPage;
    const endIndex = pageNum * this.numItemsInPage;
    this.filteredInteractions = this.interactions
    .filter(interaction => interaction.topics[0].callReason1 === this.selectedFilter || this.selectedFilter === 'All')
    .filter(interaction => this.searchString === ''
      || JSON.stringify(interaction).toLowerCase().indexOf(this.searchString.toLowerCase()) !== -1
      || (this.datePipe.transform (interaction.sortedDate, 'mediumDate') + ' at ' +
      this.datePipe.transform (interaction.sortedDate, 'shortTime')).toLowerCase().indexOf(this.searchString.toLowerCase()) !== -1);
    this.pagedInteractions = this.filteredInteractions.slice(staIndex, endIndex);
    this.totalPages = Math.ceil(this.filteredInteractions.length / this.numItemsInPage) || 1;
  }

  applyFilter(event: any) {
    this.selectedFilter = event.target.value;
    this.currentPage = 1;
  }

  getInteractions(interactionList) {
    if (interactionList.error) {
      this.interactionErr = this.translate.instant('genericError');
    } else {
      this.interactions = interactionList.filter(el => el.itemType === 'interaction');
    }
  }

  searchInteractions(value: any) {
    this.searchString = value;
    this.currentPage = 1;
  }

  iconToShow(itemType: string, media: string): string {
    let icon: string;
    if (itemType.toLowerCase() === 'interaction') {
      if (interactionsIconMap.hasOwnProperty(media.toLowerCase()) && media !== '') {
        icon = interactionsIconMap[media.toLowerCase()];
      } else {
        icon = 'rui-icon-question';
      }
    } else {
        icon = 'rui-icon-alert-i';
    }
    return icon;
  }
}

