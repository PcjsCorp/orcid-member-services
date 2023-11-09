import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { PasswordResetInitService } from '../service/password-reset-init.service'
import { EMAIL_NOT_FOUND_TYPE } from 'src/app/app.constants'

@Component({
  selector: 'app-password-reset-init',
  templateUrl: './password-reset-init.component.html',
})
export class PasswordResetInitComponent implements AfterViewInit {
  error: string | undefined
  errorEmailNotExists: string | undefined
  success: string | undefined
  resetRequestForm = this.fb.group({
    email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
  })

  constructor(
    private passwordResetInitService: PasswordResetInitService,
    private renderer: Renderer2,
    private fb: FormBuilder
  ) {}

  ngAfterViewInit() {
    setTimeout(() => this.renderer.selectRootElement('#email').focus())
  }

  requestReset() {
    this.error = undefined
    this.errorEmailNotExists = undefined

    if (this.resetRequestForm.get(['email'])) {
      this.passwordResetInitService.initPasswordReset(this.resetRequestForm.get(['email'])!.value).subscribe({
        next: () => {
          this.success = 'OK'
        },
        error: (response) => {
          this.success = undefined
          if (response.status === 400 && response.error.type === EMAIL_NOT_FOUND_TYPE) {
            this.errorEmailNotExists = 'ERROR'
          } else {
            this.error = 'ERROR'
          }
        },
      })
    }
  }
}
