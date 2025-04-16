import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractResourceService } from './abstract-resource.service';
import { ChartData } from '../models/charts.model';

@Injectable({
  providedIn: 'root'
})
export class ChartsService extends AbstractResourceService{

  // Get Random Data Set
  getRandomData(numEntries = 50): Observable<ChartData[]> {
    const params = new HttpParams().set('numEntries', numEntries.toString());
    return this.http.get<ChartData[]>(`${this.endpoint}random-data`, { params });
  }

  getFalseCall(): Observable<any> {
    return this.http.get('http://non-existent-url.com');
  }
  
}
