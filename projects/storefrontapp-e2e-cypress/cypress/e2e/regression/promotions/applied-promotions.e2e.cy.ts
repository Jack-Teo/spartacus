/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as appliedPromotions from '../../../helpers/applied-promotions';
import { clearCacheTestIsolation } from '../../../helpers/utils-cypress-legacy';
import { viewportContext } from '../../../helpers/viewport-context';

context('Applied promotions', { testIsolation: false }, () => {
  clearCacheTestIsolation();
  viewportContext(['mobile'], () => {
    before(() => {
      cy.window().then((win) => {
        win.sessionStorage.clear();
        win.localStorage.clear();
      });
      cy.requireLoggedIn();
    });

    // Core test. Repeat in mobile.
    appliedPromotions.testPromotionsForLoggedInUser();
  });
});