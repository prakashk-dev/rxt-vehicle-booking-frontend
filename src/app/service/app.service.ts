import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFormValue, Vehicle } from '../app.types';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getMakeAndModels(): Observable<Record<string, string[]>> {
    return this.http.get<Record<string, string[]>>(
      `${this.apiUrl}/make-and-models`
    );
  }

  getAvailableCars(searchRequest: IFormValue): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/available-cars`, {
      params: new HttpParams({
        fromObject: searchRequest as unknown as Record<string, string>,
      }),
    });
  }
}
