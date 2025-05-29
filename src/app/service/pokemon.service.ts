// src/app/pokemon.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = '/api/cards';

  constructor(private http: HttpClient) {}

  getPokemonList(limit = 20, name = ''): Observable<any[]> {
    const url = `${this.apiUrl}?name=${name}&limit=${limit}`;
    return this.http.get<{ cards: any[] }>(url).pipe(map(res => res.cards));
  }
}