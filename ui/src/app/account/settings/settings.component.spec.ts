import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsComponent } from './settings.component'
import { ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HttpResponse } from '@angular/common/http'
import { LanguageService } from 'src/app/shared/service/language.service'
import { AccountService } from '../service/account.service'
import { of, throwError } from 'rxjs'

describe('SettingsComponent', () => {
  let component: SettingsComponent
  let fixture: ComponentFixture<SettingsComponent>
  let accountServiceSpy: jasmine.SpyObj<AccountService>
  let languageServiceSpy: jasmine.SpyObj<LanguageService>

  beforeEach(() => {
    accountServiceSpy = jasmine.createSpyObj('AccountService', [
      'getAccountData',
      'getUserName',
      'save',
      'getMfaSetup',
      'enableMfa',
      'disableMfa',
    ])
    languageServiceSpy = jasmine.createSpyObj('LanguageService', [
      'getAllLanguages',
      'getCurrentLanguage',
      'changeLanguage',
    ])

    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [ReactiveFormsModule, HttpClientModule],
      providers: [
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: AccountService, useValue: accountServiceSpy },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(SettingsComponent)
    component = fixture.componentInstance
    accountServiceSpy = TestBed.inject(AccountService) as jasmine.SpyObj<AccountService>
  })

  it('should create', () => {
    accountServiceSpy.getAccountData.and.returnValue(
      of({
        activated: true,
        authorities: ['test', 'test'],
        email: 'email@email.com',
        firstName: 'name',
        langKey: 'en',
        lastName: 'surname',
        imageUrl: 'url',
        salesforceId: 'sfid',
        loggedAs: false,
        loginAs: 'sfid',
        mainContact: false,
        mfaEnabled: true,
      })
    )

    expect(component).toBeTruthy()
  })

  it('should flip mfa fields when mfa state changed', () => {
    accountServiceSpy.getAccountData.and.returnValue(
      of({
        activated: true,
        authorities: ['test', 'test'],
        email: 'email@email.com',
        firstName: 'name',
        langKey: 'en',
        lastName: 'surname',
        imageUrl: 'url',
        salesforceId: 'sfid',
        loggedAs: false,
        loginAs: 'sfid',
        mainContact: false,
        mfaEnabled: false,
      })
    )
    accountServiceSpy.getMfaSetup.and.returnValue(of({ secret: 'test', otp: 'test', qrCode: 'test' }))
    accountServiceSpy.getUserName.and.returnValue('test')
    fixture.detectChanges()

    expect(component.showMfaSetup).toBeFalsy()
    expect(component.showMfaBackupCodes).toBeFalsy()

    component.mfaForm.patchValue({ mfaEnabled: true })
    component.mfaEnabledStateChange()

    expect(component.showMfaSetup).toBeTruthy()
    expect(component.showMfaBackupCodes).toBeFalsy()
  })

  it('should flip mfa fields when mfa state changed', () => {
    accountServiceSpy.getAccountData.and.returnValue(
      of({
        activated: true,
        authorities: ['test', 'test'],
        email: 'email@email.com',
        firstName: 'name',
        langKey: 'en',
        lastName: 'surname',
        imageUrl: 'url',
        salesforceId: 'sfid',
        loggedAs: false,
        loginAs: 'sfid',
        mainContact: false,
        mfaEnabled: true,
      })
    )
    accountServiceSpy.getMfaSetup.and.returnValue(of({ secret: 'test', otp: 'test', qrCode: 'test' }))

    expect(component.showMfaTextCode).toBeFalsy()

    component.toggleMfaTextCode()

    expect(component.showMfaTextCode).toBeTruthy()
  })

  it('save mfa enabled should call account service enable', () => {
    accountServiceSpy.getAccountData.and.returnValue(
      of({
        activated: true,
        authorities: ['test', 'test'],
        email: 'email@email.com',
        firstName: 'name',
        langKey: 'en',
        lastName: 'surname',
        imageUrl: 'url',
        salesforceId: 'sfid',
        loggedAs: false,
        loginAs: 'sfid',
        mainContact: false,
        mfaEnabled: false,
      })
    )
    accountServiceSpy.getMfaSetup.and.returnValue(of({ secret: 'test', otp: 'test', qrCode: ['test'] }))
    accountServiceSpy.enableMfa.and.returnValue(of(new HttpResponse()))
    fixture.detectChanges()

    component.mfaForm.patchValue({ mfaEnabled: true, verificationCode: 'test' })
    component.saveMfa()

    expect(accountServiceSpy.enableMfa).toHaveBeenCalled()
    expect(accountServiceSpy.disableMfa).toHaveBeenCalledTimes(0)
  })

  it('save mfa enabled should call account service disable', () => {
    accountServiceSpy.getAccountData.and.returnValue(
      of({
        activated: true,
        authorities: ['test', 'test'],
        email: 'email@email.com',
        firstName: 'name',
        langKey: 'en',
        lastName: 'surname',
        imageUrl: 'url',
        salesforceId: 'sfid',
        loggedAs: false,
        loginAs: 'sfid',
        mainContact: false,
        mfaEnabled: true,
      })
    )
    accountServiceSpy.getMfaSetup.and.returnValue(of({ secret: 'test', otp: 'test', qrCode: ['test'] }))
    accountServiceSpy.disableMfa.and.returnValue(of(new HttpResponse()))

    component.mfaForm.patchValue({ mfaEnabled: false, verificationCode: 'test' })
    component.saveMfa()

    expect(accountServiceSpy.disableMfa).toHaveBeenCalled()
    expect(accountServiceSpy.enableMfa).toHaveBeenCalledTimes(0)
  })

  it('save form should call accountService.save and then account data requested when save is successful', () => {
    accountServiceSpy.save.and.returnValue(of(new HttpResponse()))
    accountServiceSpy.getAccountData.and.returnValue(
      of({
        activated: true,
        authorities: ['test', 'test'],
        email: 'email@email.com',
        firstName: 'name',
        langKey: 'en',
        lastName: 'surname',
        imageUrl: 'url',
        salesforceId: 'sfid',
        loggedAs: false,
        loginAs: 'sfid',
        mainContact: false,
        mfaEnabled: true,
      })
    )
    languageServiceSpy.getCurrentLanguage.and.returnValue(of('en'))
    fixture.detectChanges()
    expect(component.success).toBeFalsy()
    component.save()
    expect(component.success).toBeTruthy()
    expect(accountServiceSpy.save).toHaveBeenCalled()
  })

  it('save form should call accountService.save and then account data requested when save is successful', () => {
    accountServiceSpy.save.and.returnValue(throwError(() => new Error('error')))
    accountServiceSpy.getAccountData.and.returnValue(
      of({
        activated: true,
        authorities: ['test', 'test'],
        email: 'email@email.com',
        firstName: 'name',
        langKey: 'en',
        lastName: 'surname',
        imageUrl: 'url',
        salesforceId: 'sfid',
        loggedAs: false,
        loginAs: 'sfid',
        mainContact: false,
        mfaEnabled: true,
      })
    )
    fixture.detectChanges()
    expect(component.success).toBeFalsy()
    component.save()
    expect(component.success).toBeFalsy()
    expect(accountServiceSpy.save).toHaveBeenCalled()
    expect(languageServiceSpy.getCurrentLanguage).toHaveBeenCalledTimes(0)
  })
})
