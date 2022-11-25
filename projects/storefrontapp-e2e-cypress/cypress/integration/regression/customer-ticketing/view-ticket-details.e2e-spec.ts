import { viewportContext } from '../../../helpers/viewport-context';
import * as customerTicketing from '../../../helpers/customer-ticketing/customer-ticketing';

describe('ticket details', () => {
  viewportContext(['desktop', 'mobile'], () => {
    context('Registered User', () => {
      before(() => {
        cy.window().then((win) => {
          win.sessionStorage.clear();
        });
      });
      it('should be able to view ticket details page for an existing ticket', () => {
        customerTicketing.loginRegisteredUser();
        customerTicketing.clickMyAccountMenuOption();
        customerTicketing.clickCustomerSupportMenuOption();
        customerTicketing.verifyTicketListingPageVisit();
        customerTicketing.createTicket({
          subject: 'ticket details',
          message: 'ticket details',
          category: customerTicketing.TestCategory.complaint,
        });
        customerTicketing.clickTicketInRow();
        customerTicketing.verifyTicketDetailsPageVisit();
      });
    });
  });
});