import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { of, tap } from 'rxjs';
import { Photo } from '../_models/photo';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  members = signal<Member[]>([]);
  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'users').subscribe({
      next: members => this.members.set(members)
    });
  }
  getMember(username: string) {
    const member = this.members().find(m => m.username === username);
    if (member) {
      return of(member);
    }
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }
  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      tap(() => {
        this.members.update(m => m.map(x => x.username === member.username ? member : x));
      })
    )
  }
  setMainPhoto(photo: Photo) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photo.id, {}).pipe(
      tap(() => {
        this.members.update(m => m.map(x => {
          if (x.photos.includes(photo)) {
            x.photoUrl = photo.url
          }
          return x;
        }))
      }))
  }
  deletePhoto(photo: Photo) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photo.id).pipe(
      tap(() => {
        this.members.update(m => m.map(x => {
          if (x.photos.includes(photo)) {
            x.photos = x.photos.filter(p => p.id !== photo.id);
          }
          return x;
        }))
      })
    );
  }
}

