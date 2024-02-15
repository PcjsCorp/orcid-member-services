import { Pipe, PipeTransform } from '@angular/core'
import { AlertType } from 'src/app/app.constants'

@Pipe({
  name: 'localize',
})
export class LocalizePipe implements PipeTransform {
  transform(value: string, ...args: any[]): any {
    switch (value) {
      case AlertType.SEND_ACTIVATION_SUCCESS:
        return $localize`:@@gatewayApp.msUserServiceMSUser.sendActivate.success.string:Invite sent.`
      case AlertType.SEND_ACTIVATION_FAILURE:
        return $localize`:@@gatewayApp.msUserServiceMSUser.sendActivate.error.string:Invite email couldn't be sent.`
      case AlertType.USER_CREATED:
        return $localize`:@@userServiceApp.user.created.string:User created. Invite sent.`
      case AlertType.USER_UPDATED:
        return $localize`:@@userServiceApp.user.updated.string:User updated successfully`
      case AlertType.USER_DELETED:
        return $localize`:@@userServiceApp.user.deleted.string:User deleted successfully`
    }
  }
}
