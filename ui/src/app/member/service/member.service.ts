import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, of, map, catchError } from 'rxjs'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { IMember } from '../model/member.model'
import * as moment from 'moment'
import { createRequestOption } from 'src/app/shared/request-util'
import { IMemberPage, MemberPage } from '../model/member-page.model'

@Injectable({ providedIn: 'root' })
export class MemberService {
  constructor(protected http: HttpClient) {}

  public resourceUrl = '/services/memberservice/api'
  public managedMember = new BehaviorSubject<string | null>(null)

  find(id: string): Observable<IMember> {
    return this.http.get<IMember>(`${this.resourceUrl}/members/${id}`).pipe(
      map((res: IMember) => this.convertDateFromServer(res)),
      catchError((err) => {
        return of(err)
      })
    )
  }

  create(msMember: IMember): Observable<IMember> {
    const copy = this.convertDateFromClient(msMember)
    return this.http
      .post<IMember>(`${this.resourceUrl}/members`, copy)
      .pipe(map((res: IMember) => this.convertDateFromServer(res)))
  }

  update(msMember: IMember): Observable<IMember> {
    const copy = this.convertDateFromClient(msMember)
    return this.http
      .put<IMember>(`${this.resourceUrl}/members`, copy)
      .pipe(map((res: IMember) => this.convertDateFromServer(res)))
  }

  validate(member: IMember): Observable<{ valid: boolean; errors?: string[] }> {
    const copy = this.convertDateFromClient(member)
    return this.http.post<{ valid: boolean; errors: string[] }>(`${this.resourceUrl}/members/validate`, copy)
  }

  getAllMembers(): Observable<IMember[]> {
    return this.http
      .get<IMember[]>(`${this.resourceUrl}/members/list/all`)
      .pipe(map((res: IMember[]) => this.convertMembersArrayFromServer(res)))
  }

  query(req?: any): Observable<IMemberPage | null> {
    const options = createRequestOption(req)
    return this.http
      .get<IMember[]>(this.resourceUrl + '/members', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<IMember[]>) => this.convertToMemberPage(res)))
  }

  getManagedMember(): Observable<string | null> {
    return this.managedMember.asObservable()
  }

  setManagedMember(value: string | null) {
    this.managedMember.next(value)
  }

  protected convertDateFromClient(member: IMember): IMember {
    const copy: IMember = Object.assign({}, member, {
      createdDate: member.createdDate != null && member.createdDate.isValid() ? member.createdDate.toJSON() : null,
      lastModifiedDate:
        member.lastModifiedDate != null && member.lastModifiedDate.isValid() ? member.lastModifiedDate.toJSON() : null,
    })
    return copy
  }

  protected convertDateFromServer(member: IMember): IMember {
    if (member) {
      member.createdDate = member.createdDate != null ? moment(member.createdDate) : undefined
      member.lastModifiedDate = member.lastModifiedDate != null ? moment(member.lastModifiedDate) : undefined
    }
    return member
  }

  protected convertMembersArrayFromServer(members: IMember[]): IMember[] {
    if (members) {
      members.forEach((member: IMember) => {
        member.createdDate = member.createdDate != null ? moment(member.createdDate) : null
        member.lastModifiedDate = member.lastModifiedDate != null ? moment(member.lastModifiedDate) : null
      })
    }
    return members
  }

  protected convertToMemberPage(res: HttpResponse<IMember[]>): IMemberPage | null {
    if (res.body) {
      res.body.forEach((member: IMember) => {
        member.createdDate = member.createdDate ? moment(member.createdDate) : undefined
        member.lastModifiedDate = member.lastModifiedDate ? moment(member.lastModifiedDate) : undefined
      })
      const totalCount: string | null = res.headers.get('X-Total-Count')
      if (totalCount) {
        const userPage = new MemberPage(res.body, parseInt(totalCount, 10))
        return userPage
      }
    }
    return null
  }
}
