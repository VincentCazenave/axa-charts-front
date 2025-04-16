import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AbstractResourceService {
  protected endpoint = environment.apiUrl;

  constructor(
    protected readonly http: HttpClient,
  ) { }
}