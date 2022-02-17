import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PassivSymbolRequest, PassivTradeRequest } from '../models';

const header = {
  headers: new HttpHeaders()
    .set('Authorization',  `Token c50416e736642a0e69a74512a9d14c4c633fd1cc`)
}
const options = {
  headers: header,
};

@Injectable({
  providedIn: 'root'
})

export class PassivService {
  
  constructor(private http: HttpClient) { }

  search(request: PassivSymbolRequest) {
    return this.http.post('https://api.passiv.com/api/v1/symbols', request, header);
  }

  getTrades(request: PassivTradeRequest) {
    return this.http.post('https://api.passiv.com/api/v1/embeddedTrades', request, header);
  }

  getCurrencies() {
    return this.http.get('https://api.passiv.com/api/v1/currencies/rates', header);
  }
}
