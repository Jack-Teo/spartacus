/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DIALOG_TYPE, LayoutConfig } from '@spartacus/storefront';
import { QuoteRequestDialogComponent } from './quote-request-dialog.component';
import { QuoteConfirmRequestDialogComponent } from './quote-confirm-request-dialog/quote-confirm-request-dialog.component';

export const defaultQuoteRequestDialogConfig: LayoutConfig = {
  launch: {
    REQUEST_QUOTE: {
      inline: true,
      component: QuoteRequestDialogComponent,
      dialogType: DIALOG_TYPE.DIALOG,
    },
    REQUEST_CONFIRMATION: {
      inline: true,
      component: QuoteConfirmRequestDialogComponent,
      dialogType: DIALOG_TYPE.DIALOG,
    },
  },
};