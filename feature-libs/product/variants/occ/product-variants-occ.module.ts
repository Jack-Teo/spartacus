/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideDefaultConfig } from '@spartacus/core';
import { defaultOccProductVariantsConfig } from './config/default-occ-product-variants-config';

@NgModule({
  imports: [CommonModule],
  providers: [provideDefaultConfig(defaultOccProductVariantsConfig)],
})
export class ProductVariantsOccModule {}
