import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { I18nTestingModule } from '@spartacus/core';
import { LaunchDialogService } from '@spartacus/storefront';
import { BehaviorSubject } from 'rxjs';
import { CustomerTicketingDetailsService } from '../../customer-ticketing-details.service';
import { CustomerTicketingDialogComponent } from './customer-ticketing-dialog.component';

@Component({
  template: '',
})
class DialogComponent extends CustomerTicketingDialogComponent {}

class MockCustomerTicketingDetailsService
  implements Partial<CustomerTicketingDetailsService>
{
  dataLoading$ = new BehaviorSubject<boolean>(false);
}

class MockLaunchDialogService implements Partial<LaunchDialogService> {
  closeDialog(_reason: string): void {}
}

describe('CustomerTicketingDialogComponent', () => {
  let component: CustomerTicketingDialogComponent;
  let fixture: ComponentFixture<CustomerTicketingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [DialogComponent],
      providers: [
        {
          provide: CustomerTicketingDetailsService,
          useClass: MockCustomerTicketingDetailsService,
        },
        { provide: LaunchDialogService, useClass: MockLaunchDialogService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
