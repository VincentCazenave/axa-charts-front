import { Injectable } from '@angular/core';
import 'jest-preset-angular/setup-jest';

@Injectable({
    providedIn: 'root'
  })
  export class MyService {
    getValue() {
      return 'Hello Jest!';
    }
  }