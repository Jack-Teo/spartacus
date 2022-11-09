import { TestBed } from '@angular/core/testing';
import {
  createFrom,
  CurrencySetEvent,
  CxEvent,
  EventService,
  GlobalMessageService,
  GlobalMessageType,
  LanguageSetEvent,
  LoginEvent,
  LogoutEvent,
} from '@spartacus/core';
import { Subject } from 'rxjs';
import { STATUS } from '../model';
import { CustomerTicketingEventListener } from './customer-ticketing-event.listener';
import {
  GetTicketAssociatedObjectsQueryResetEvent,
  GetTicketCategoryQueryResetEvent,
  GetTicketQueryReloadEvent,
  GetTicketQueryResetEvent,
  TicketEventCreatedEvent,
} from './customer-ticketing.events';
import createSpy = jasmine.createSpy;

const mockEventStream$ = new Subject<CxEvent>();

class MockEventService implements Partial<EventService> {
  get = createSpy().and.returnValue(mockEventStream$.asObservable());
  dispatch = createSpy();
}

class MockGlobalMessageService implements Partial<GlobalMessageService> {
  add = createSpy();
}

describe('CustomerTicketingEventListener', () => {
  let eventService: EventService;
  let globalMessageService: GlobalMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CustomerTicketingEventListener,
        { provide: EventService, useClass: MockEventService },
        { provide: GlobalMessageService, useClass: MockGlobalMessageService },
      ],
    });

    TestBed.inject(CustomerTicketingEventListener);
    eventService = TestBed.inject(EventService);
    globalMessageService = TestBed.inject(GlobalMessageService);
  });

  function assertServiceDispatchForEvent(event: CxEvent, dispatchedEvent: any) {
    mockEventStream$.next(event);
    expect(eventService.dispatch).toHaveBeenCalledWith({}, dispatchedEvent);
  }

  describe('onGetTicketQueryReload', () => {
    it('LanguageSetEvent should dispatch GetTicketQueryReloadEvent', () => {
      assertServiceDispatchForEvent(
        new LanguageSetEvent(),
        GetTicketQueryReloadEvent
      );
    });

    it('CurrencySetEvent should dispatch GetTicketQueryReloadEvent', () => {
      assertServiceDispatchForEvent(
        new CurrencySetEvent(),
        GetTicketQueryReloadEvent
      );
    });
  });

  describe('onLoginAndLogoutEvent', () => {
    it('LogoutEvent should dispatch GetTicketQueryResetEvent', () => {
      assertServiceDispatchForEvent(
        new LogoutEvent(),
        GetTicketQueryResetEvent
      );
    });

    it('LoginEvent should dispatch GetTicketQueryResetEvent', () => {
      assertServiceDispatchForEvent(new LoginEvent(), GetTicketQueryResetEvent);
    });
    it('LogoutEvent should dispatch GetTicketCategoryQueryReloadEvent', () => {
      assertServiceDispatchForEvent(
        new LogoutEvent(),
        GetTicketCategoryQueryResetEvent
      );
    });
    it('LoginEvent should dispatch GetTicketCategoryQueryResetEvent', () => {
      assertServiceDispatchForEvent(
        new LoginEvent(),
        GetTicketCategoryQueryResetEvent
      );
    });
    it('LogogoutEvent should dispatch GetTicketAssociatedObjectsQueryResetEvent', () => {
      assertServiceDispatchForEvent(
        new LogoutEvent(),
        GetTicketAssociatedObjectsQueryResetEvent
      );
    });
    it('LoginEvent should dispatch GetTicketAssociatedObjectsQueryResetEvent', () => {
      assertServiceDispatchForEvent(
        new LoginEvent(),
        GetTicketAssociatedObjectsQueryResetEvent
      );
    });
  });

  describe('onTicketEventCreated', () => {
    it('TicketEventCreatedEvent should trigger requestClosed global message', () => {
      mockEventStream$.next(
        createFrom(TicketEventCreatedEvent, { status: STATUS.CLOSED })
      );

      expect(globalMessageService.add).toHaveBeenCalledWith(
        { key: 'customerTicketing.requestClosed' },
        GlobalMessageType.MSG_TYPE_CONFIRMATION
      );
    });

    it('TicketEventCreatedEvent should trigger requestReopened global message', () => {
      mockEventStream$.next(
        createFrom(TicketEventCreatedEvent, { status: STATUS.OPEN })
      );

      expect(globalMessageService.add).toHaveBeenCalledWith(
        { key: 'customerTicketing.requestReopened' },
        GlobalMessageType.MSG_TYPE_CONFIRMATION
      );
    });
  });
});