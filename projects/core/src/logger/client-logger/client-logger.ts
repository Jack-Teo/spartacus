import { Injectable } from '@angular/core';
import { Logger } from '../logger';

@Injectable()
export class ClientLogger extends Logger {
  log(message?: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);
  }
  warn(message?: any, ...optionalParams: any[]): void {
    console.warn(message, ...optionalParams);
  }
  error(message?: any, ...optionalParams: any[]): void {
    console.error(message, ...optionalParams);
  }
}