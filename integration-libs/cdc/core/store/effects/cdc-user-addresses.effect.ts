/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CdcJsService } from '@spartacus/cdc/root';
import {
  Address,
  GlobalMessageService,
  GlobalMessageType,
  UserActions,
  UserAddressConnector,
  UserAddressService,
  UserIdService,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, take } from 'rxjs/operators';

@Injectable()
export class CdcUserAddressesEffects {
  addressFieldKeys = ['line1', 'line2', 'region.name', 'town', 'postalCode'];

  cdcAddUserAddress$: Observable<UserActions.UserAddressesAction> =
    createEffect(
      () =>
        this.actions$.pipe(
          ofType(UserActions.ADD_USER_ADDRESS_SUCCESS),
          mergeMap(() => {
            return this.updateDefaultAdressInCDC().pipe(
              map((data: any) => {
                return new UserActions.LoadUserAddressesSuccess(data);
              }),
              catchError((error) => {
                let errorMessage = error?.errorMessage || ' ';
                this.messageService.add(
                  errorMessage,
                  GlobalMessageType.MSG_TYPE_ERROR
                );
                return of(new UserActions.AddUserAddressFail(error));
              })
            );
          })
        ),
      { dispatch: false } //prevent dispatching duplicate events in the case of CDC success / failure
    );

  cdcUpdateUserAddress$: Observable<UserActions.UserAddressesAction> =
    createEffect(
      () =>
        this.actions$.pipe(
          ofType(
            UserActions.UPDATE_USER_ADDRESS_SUCCESS,
            UserActions.LOAD_USER_ADDRESSES /* needed because `updateUserAddress$` dispatches a LOAD_USER_ADDRESSES
                                             in the scenario where an address is set as default from the address book page */
          ),
          mergeMap(() => {
            return this.updateDefaultAdressInCDC().pipe(
              map((data: any) => {
                return new UserActions.LoadUserAddressesSuccess(data);
              }),
              catchError((error) => {
                let errorMessage = error?.errorMessage || ' ';
                this.messageService.add(
                  errorMessage,
                  GlobalMessageType.MSG_TYPE_ERROR
                );
                return of(new UserActions.UpdateUserAddressFail(error));
              })
            );
          })
        ),
      { dispatch: false } //prevent dispatching duplicate events in the case of CDC success / failure
    );

  cdcDeleteUserAddress$: Observable<UserActions.UserAddressesAction> =
    createEffect(
      () =>
        this.actions$.pipe(
          ofType(UserActions.DELETE_USER_ADDRESS_SUCCESS),
          switchMap(() => {
            return this.updateDefaultAdressInCDC().pipe(
              map((data: any) => {
                return new UserActions.LoadUserAddressesSuccess(data);
              }),
              catchError((error) => {
                let errorMessage = error?.errorMessage || ' ';
                this.messageService.add(
                  errorMessage,
                  GlobalMessageType.MSG_TYPE_ERROR
                );
                return of(new UserActions.DeleteUserAddressFail(error));
              })
            );
          })
        ),
      { dispatch: false } //prevent dispatching duplicate events in the case of CDC success / failure
    );

  getAddresses(): Observable<Address[]> {
    return this.userIdService.takeUserId().pipe(
      take(1),
      switchMap((userId) => this.userAddressConnector.getAll(userId))
    );
  }

  getDefaultAddress(addresses: Address[]) {
    return addresses.find((address) => address?.defaultAddress === true);
  }

  updateDefaultAdressInCDC() {
    return this.getAddresses().pipe(
      take(1),
      switchMap((addresses: Address[]) => {
        let defaultAddress = this.getDefaultAddress(addresses) || {};
        return this.sendAddressToCDC(defaultAddress);
      })
    );
  }

  sendAddressToCDC(address: Address): Observable<{ status: string }> {
    //send to CDC
    let formattedAddress = address.formattedAddress || ' ';
    return this.cdcJsService.updateAddressWithoutScreenSet(
      formattedAddress,
      address.postalCode || ' ',
      address.town || ' ',
      address.country?.name || ' '
    );
  }

  constructor(
    protected actions$: Actions,
    protected userIdService: UserIdService,
    protected userAddressConnector: UserAddressConnector,
    protected userAddressService: UserAddressService,
    protected messageService: GlobalMessageService,
    protected cdcJsService: CdcJsService
  ) {}
}
