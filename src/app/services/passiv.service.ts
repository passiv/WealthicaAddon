import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PassivSymbolRequest, PassivTradeRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PassivService {

  constructor(private http: HttpClient) { }

  search(request: PassivSymbolRequest) {
    return this.http.post('https://getpassiv.com/api/v1/symbols', request);
  }

  getTrades(request: PassivTradeRequest) {
    return this.http.post('https://getpassiv.com/api/v1/embeddedTrades', request);
  }
}
