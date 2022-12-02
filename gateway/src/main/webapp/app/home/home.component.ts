import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/core';
import { IMSUser } from 'app/shared/model/user.model';
import { ISFMemberData } from 'app/shared/model/salesforce-member-data.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  subject: BehaviorSubject<ISFMemberData>;
  account: IMSUser;
  memberData: ISFMemberData;
  memberDataLoaded = false;
  fetchingMemberData: boolean = undefined;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.accountService.getFetchingMemberDataState().subscribe(fetchingMemberData => {
      this.fetchingMemberData = fetchingMemberData;
    });
    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
      this.getMemberData();
    });
    this.accountService.identity().then((account: IMSUser) => {
      this.account = account;
      if (!this.fetchingMemberData) {
        this.getMemberData();
      }
    });
  }

  getMemberData() {
    if (this.account === null) {
      this.memberDataLoaded = false;
      this.memberData = null;
    } else if (this.account !== null && !this.memberData) {
      this.accountService.getCurrentMemberData().then(res => {
        this.memberDataLoaded = true;
        if (res && res.value.id) {
          this.memberData = res.value;
        }
      });
    }
  }
}
