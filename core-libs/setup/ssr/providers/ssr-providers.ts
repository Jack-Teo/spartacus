/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ErrorHandler, StaticProvider } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import {
  LoggerService,
  SERVER_REQUEST_ORIGIN,
  SERVER_REQUEST_URL,
} from '@spartacus/core';
import { ssrErrorHandlerFactory } from '../error-handlers';
import { getRequestOrigin } from '../express-utils/express-request-origin';
import { getRequestUrl } from '../express-utils/express-request-url';
import { SERVER_LOGGER, serverLoggerServiceFactory } from '../logger';
import { serverLoggerFactory } from '../logger/loggers';
import { ServerOptions } from './model';
import { serverRequestOriginFactory } from './server-request-origin';
import { serverRequestUrlFactory } from './server-request-url';

/**
 * Returns the providers used for SSR and pre-rendering processes.
 */
export function provideServer(options?: ServerOptions): StaticProvider[] {
  return [
    {
      provide: SERVER_REQUEST_ORIGIN,
      useFactory: serverRequestOriginFactory(options),
    },
    {
      provide: SERVER_REQUEST_URL,
      useFactory: serverRequestUrlFactory(options),
    },
    {
      provide: ErrorHandler,
      useFactory: ssrErrorHandlerFactory,
      multi: true,
    },
    // for pre-rendering purposes - "there is no Express" fallback
    {
      provide: SERVER_LOGGER,
      useFactory: serverLoggerFactory,
    },
    {
      provide: LoggerService,
      useFactory: serverLoggerServiceFactory,
    },
  ];
}
/**
 * Returns Spartacus providers to be passed to the Angular express engine (in SSR)
 *
 * @param options
 */
export function getServerRequestProviders(): StaticProvider[] {
  return [
    {
      provide: SERVER_REQUEST_ORIGIN,
      useFactory: getRequestOrigin,
      deps: [REQUEST],
    },
    {
      provide: SERVER_REQUEST_URL,
      useFactory: getRequestUrl,
      deps: [REQUEST],
    },
  ];
}
