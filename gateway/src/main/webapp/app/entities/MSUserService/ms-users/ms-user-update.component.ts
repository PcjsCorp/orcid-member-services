import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { IMSUser, MSUser } from 'app/shared/model/MSUserService/ms-user.model';
import { MSUserService } from './ms-user.service';

import { IMSMember } from 'app/shared/model/MSUserService/ms-member.model';
import { MSMemberService } from 'app/entities/MSUserService/ms-members/ms-member.service';
import { emailValidator } from 'app/shared/util/app-validators';
import { AccountService } from 'app/core';
import { SERVER_API_URL } from 'app/app.constants';

@Component({
  selector: 'jhi-ms-user-update',
  templateUrl: './ms-user-update.component.html'
})
export class MSUserUpdateComponent implements OnInit {
  isSaving: boolean;
  isExistentMember: boolean;
  existentMSUser: IMSUser;
  faCheckCircle = faCheckCircle;
  showIsAdminCheckbox = false;
  currentAccount: any;
  validation: any;

  editForm = this.fb.group({
    id: [],
    login: ['', [Validators.required, Validators.email, Validators.maxLength(50), emailValidator]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    mainContact: [],
    assertionServiceEnabled: [],
    salesforceId: ['', Validators.required],
    activated: [],
    isAdmin: [],
    createdBy: [],
    createdDate: [],
    lastModifiedBy: [],
    lastModifiedDate: []
  });

  membersList = [] as IMSMember[];
  hasOwner = false;

  constructor(
    protected alertService: JhiAlertService,
    protected msUserService: MSUserService,
    protected msMemberService: MSMemberService,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
    private fb: FormBuilder,
    private cdref: ChangeDetectorRef
  ) {
    this.validation = {};
  }

  ngOnInit() {
    this.isSaving = false;
    this.isExistentMember = false;
    this.existentMSUser = null;
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.editForm.disable();

    this.msMemberService.allMembers$.subscribe(res => {
      if (res.body) {
        this.membersList = [];
        res.body.forEach((msMember: IMSMember) => {
          this.membersList.push(msMember);
        });
        if (this.membersList.length > 0) {
          this.editForm.enable();
          this.activatedRoute.data.subscribe(({ msUser }) => {
            this.existentMSUser = msUser;
            this.updateForm(msUser);
          });
          this.cdref.detectChanges();
        }
      }
    });

    this.onChanges();
  }

  onChanges(): void {
    this.editForm.get('salesforceId').valueChanges.subscribe(val => {
      const selectedOrg = this.membersList.find(cm => cm.salesforceId === this.editForm.get(['salesforceId']).value);
      if (this.hasRoleAdmin()) {
        if (selectedOrg) {
          this.showIsAdminCheckbox = selectedOrg.superadminEnabled;
          this.editForm.patchValue({
            isAdmin: false
          });
        } else {
          this.showIsAdminCheckbox = false;
          this.editForm.patchValue({
            isAdmin: false
          });
        }
      } else {
        this.showIsAdminCheckbox = false;
        this.editForm.patchValue({
          isAdmin: false
        });
      }
    });
  }

  updateForm(msUser: IMSUser) {
    this.editForm.patchValue({
      id: msUser.id,
      login: msUser.login,
      firstName: msUser.firstName,
      lastName: msUser.lastName,
      mainContact: msUser.mainContact,
      salesforceId: msUser.salesforceId,
      activated: msUser.activated,
      isAdmin: msUser.isAdmin,
      createdBy: msUser.createdBy,
      createdDate: msUser.createdDate != null ? msUser.createdDate.format(DATE_TIME_FORMAT) : null,
      lastModifiedBy: msUser.lastModifiedBy,
      lastModifiedDate: msUser.lastModifiedDate != null ? msUser.lastModifiedDate.format(DATE_TIME_FORMAT) : null
    });
    if (msUser.mainContact) {
      this.editForm.get('mainContact').disable();
      this.editForm.get('salesforceId').disable();
    }

    if (msUser.salesforceId) {
      this.isExistentMember = true;
    }
  }

  previousState() {
    window.history.back();
  }

  disableSalesForceIdDD() {
    if (this.hasRoleAdmin()) {
      return false;
    } else if (this.hasRoleOrgOwner() || this.hasRoleConsortiumLead()) {
      this.editForm.patchValue({
        salesforceId: this.getSalesForceId()
      });
      return true;
    }
    return this.isExistentMember;
  }

  getSalesForceId() {
    return this.accountService.getSalesforceId();
  }

  hasRoleAdmin() {
    return this.accountService.hasAnyAuthority(['ROLE_ADMIN']);
  }

  hasRoleOrgOwner() {
    return this.accountService.hasAnyAuthority(['ROLE_ORG_OWNER']);
  }

  hasRoleConsortiumLead() {
    return this.accountService.hasAnyAuthority(['ROLE_CONSORTIUM_LEAD']);
  }

  validateOrgOwners() {
    this.isSaving = true;
    this.msUserService.hasOwner(this.editForm.get('salesforceId').value).subscribe(value => {
      this.isSaving = false;
      if (!this.editForm.get('mainContact').value) {
        this.hasOwner = false;
      } else {
        this.hasOwner = value;
      }
    });

    if (this.editForm.get('mainContact').value) {
      this.editForm.get('salesforceId').disable();
    } else {
      this.editForm.get('salesforceId').enable();
    }
  }

  save() {
    if (this.editForm.valid) {
      this.isSaving = true;
      const msUser = this.createFromForm();

      this.msUserService.validate(msUser).subscribe(response => {
        const data = response.body;
        if (data.valid) {
          if (msUser.id !== undefined) {
            if (this.currentAccount.id === msUser.id) {
              if (this.currentAccount.mainContact !== msUser.mainContact) {
                this.subscribeToUpdateResponseWithOwnershipChange(this.msUserService.update(msUser));
              } else {
                this.subscribeToUpdateResponse(this.msUserService.update(msUser));
              }
            } else if (msUser.mainContact && !this.hasRoleAdmin()) {
              this.subscribeToUpdateResponseWithOwnershipChange(this.msUserService.update(msUser));
            } else {
              this.subscribeToUpdateResponse(this.msUserService.update(msUser));
            }
          } else {
            if (msUser.mainContact && !this.hasRoleAdmin()) {
              this.subscribeToSaveResponseWithOwnershipChange(this.msUserService.create(msUser));
            } else {
              this.subscribeToSaveResponse(this.msUserService.create(msUser));
            }
          }
        } else {
          this.isSaving = false;
          this.validation = data;
        }
      });
    }
  }

  sendActivate() {
    this.msUserService.sendActivate(this.existentMSUser).subscribe(res => {
      if (res.ok) {
        this.alertService.success('gatewayApp.msUserServiceMSUser.sendActivate.success.string', null, null);
      } else {
        this.alertService.success('gatewayApp.msUserServiceMSUser.sendActivate.error.string', null, null);
      }
      this.previousState();
    });
  }

  displaySendActivate() {
    if (this.existentMSUser && this.existentMSUser.login && !this.existentMSUser.activated) {
      console.log('this.existentMSUser: ', this.existentMSUser);
      console.log('this.existentMSUser.activated', this.existentMSUser.activated);
      return true;
    }
    return false;
  }

  private createFromForm(): IMSUser {
    return {
      ...new MSUser(),
      id: this.editForm.get(['id']).value,
      login: this.editForm.get(['login']).value,
      firstName: this.editForm.get(['firstName']).value,
      lastName: this.editForm.get(['lastName']).value,
      mainContact: this.editForm.get(['mainContact']).value,
      isAdmin: this.editForm.get(['isAdmin']) ? this.editForm.get(['isAdmin']).value : false,
      salesforceId: this.editForm.get(['salesforceId']).value,
      createdBy: this.editForm.get(['createdBy']).value,
      createdDate:
        this.editForm.get(['createdDate']).value != null ? moment(this.editForm.get(['createdDate']).value, DATE_TIME_FORMAT) : undefined,
      lastModifiedBy: this.editForm.get(['lastModifiedBy']).value,
      lastModifiedDate:
        this.editForm.get(['lastModifiedDate']).value != null
          ? moment(this.editForm.get(['lastModifiedDate']).value, DATE_TIME_FORMAT)
          : undefined
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMSUser>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected subscribeToUpdateResponse(result: Observable<HttpResponse<IMSUser>>) {
    result.subscribe(() => this.onUpdateSuccess(), () => this.onSaveError());
  }

  protected subscribeToSaveResponseWithOwnershipChange(result: Observable<HttpResponse<IMSUser>>) {
    result.subscribe(() => this.onSaveSuccessOwnershipChange(), () => this.onSaveError());
  }

  protected subscribeToUpdateResponseWithOwnershipChange(result: Observable<HttpResponse<IMSUser>>) {
    result.subscribe(() => this.onUpdateSuccessOwnershipChange(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
    this.alertService.success('userServiceApp.user.created.string');
  }

  protected onUpdateSuccess() {
    this.isSaving = false;
    this.previousState();
    this.alertService.success('userServiceApp.user.updated.string');
  }

  protected onSaveSuccessOwnershipChange() {
    this.isSaving = false;
    window.location.href = SERVER_API_URL;
    this.alertService.success('userServiceApp.user.created.string');
  }

  protected onUpdateSuccessOwnershipChange() {
    this.isSaving = false;
    window.location.href = SERVER_API_URL;
    this.alertService.success('userServiceApp.user.updated.string');
  }

  protected onSaveError() {
    this.isSaving = false;
  }

  protected onError(errorMessage: string) {
    this.alertService.error(errorMessage, null, null);
  }
}
