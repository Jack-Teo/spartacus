/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ACTIONS,
  ANGULAR_CORE,
  EVENT_SERVICE,
  NGRX_EFFECTS,
  NGRX_STORE,
  OBJECT_TYPE,
  PLATFORM,
  PLATFORM_ID_STRING,
  STORE,
} from '../../../../shared/constants';
import { SPARTACUS_CORE } from '../../../../shared/libs-constants';
import { ConstructorDeprecation } from '../../../../shared/utils/file-utils';

export const PRODUCT_LOADING_SERVICE_MIGRATION: ConstructorDeprecation = {
  // projects/core/src/product/services/product-loading.service.ts
  class: `ProductLoadingService`,
  importPath: SPARTACUS_CORE,
  deprecatedParams: [
    { className: STORE, importPath: NGRX_STORE },
    { className: `LoadingScopesService`, importPath: SPARTACUS_CORE },
    { className: ACTIONS, importPath: NGRX_EFFECTS },
    {
      className: PLATFORM,
      literalInference: OBJECT_TYPE,
      injectionToken: {
        token: PLATFORM_ID_STRING,
        importPath: ANGULAR_CORE,
      },
    },
  ],
  addParams: [{ className: EVENT_SERVICE, importPath: SPARTACUS_CORE }],
};
