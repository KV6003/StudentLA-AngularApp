import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpRequest, HttpClient, HttpHeaders } from '@angular/common/http'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private gradesDataSource = new BehaviorSubject<string>('');
  currentData = this.gradesDataSource.asObservable();

  url = 'http://localhost:8080';

  get token() {
    return localStorage.getItem('token');
  }

  constructor(private http: HttpClient) { }

  updateGradesData(data: string) {
    this.gradesDataSource.next(data);
  }

  login(username: string, password: string) {
    return this.http.post<any>(this.url + `/authenticate`, { username, password })
      .pipe(map(user => {
        // store jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('token', JSON.stringify(user.token));
        return user;
      }));
  }

  // TODO: Make api call with user id
  getData() {
    const headers = { 'Authorization': `Bearer $(this.token)`, 'My-Custom-Header': 'foobar' }
    return this.http.get<any>('https://api.npms.io/v2/search?q=scope:angular', { headers }).subscribe(data => {
      console.log(data);
      return data;
    })
    // request = new HttpRequest<any>("GET")
    // this._tokenInterceptor.intercept()
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': `Bearer ${localStorage.getItem('token')}`
    // });
    // return this.http.get(this.url + `/loadGrades`, { headers: headers });
    // return this.http.get<any>(this.url + `/authenticate`, { username, password })
    //   .pipe(map(user => {
    //     // store jwt token in local storage to keep user logged in between page refreshes
    //     localStorage.setItem('token', JSON.stringify(user.token));
    //     return user;
    //   }));
    console.log({ courseName: 'Computer Science', year: 'firstYear', targetGrade: 'custom', customTarget: 84.8, modules: [{ moduleName: 'Computing Fundamentals', dess: null, assessments: [{ assess: 'Classroom Test 1', grade: 100, weight: 50 }, { assess: 'Classroom Test 2', grade: 80, weight: 50 }] }, { moduleName: 'Programming 1', dess: null, assessments: [{ assess: 'Workshop Exercises', grade: 98, weight: 100 }] }, { moduleName: 'Systems Analysis', dess: null, assessments: [{ assess: 'Project', grade: 86, weight: 90 }, { assess: 'Presentation', grade: 72, weight: 10 }] }, { moduleName: 'Programming 2', dess: null, assessments: [{ assess: 'Workshop Exercises', grade: 100, weight: 30 }, { assess: 'Exam', grade: 76, weight: 70 }] }, { moduleName: 'Relational Databases', dess: null, assessments: [{ assess: 'Exam 1', grade: 76, weight: 50 }, { assess: 'Exam 2', grade: 60, weight: 50 }] }, { moduleName: 'Web Technologies', dess: null, assessments: [{ assess: 'Coursework', grade: 85, weight: 100 }] }] });
    const data = {
      courseName: 'Computer Science',
      year: 'firstYear',
      targetGrade: 'custom',
      customTarget: 84.8,
      modules: [
        {
          moduleName: 'Computing Fundamentals',
          dess: null,
          assessments: [
            {
              assess: 'Classroom Test 1',
              grade: 100,
              weight: 50
            },
            {
              assess: 'Classroom Test 2',
              grade: 80,
              weight: 50
            }
          ]
        },
        {
          moduleName: 'Programming 1',
          dess: null,
          assessments: [
            {
              assess: 'Workshop Exercises',
              grade: 98,
              weight: 100
            }
          ]
        },
        {
          moduleName: 'Systems Analysis',
          dess: null,
          assessments: [
            {
              assess: 'Project',
              grade: 86,
              weight: 90
            },
            {
              assess: 'Presentation',
              grade: 72,
              weight: 10
            }
          ]
        },
        {
          moduleName: 'Programming 2',
          dess: null,
          assessments: [
            {
              assess: 'Workshop Exercises',
              grade: 100,
              weight: 30
            },
            {
              assess: 'Exam',
              grade: 76,
              weight: 70
            }
          ]
        },
        {
          moduleName: 'Relational Databases',
          dess: null,
          assessments: [
            {
              assess: 'Exam 1',
              grade: 76,
              weight: 50
            },
            {
              assess: 'Exam 2',
              grade: 60,
              weight: 50
            }
          ]
        },
        {
          moduleName: 'Web Technologies',
          dess: null,
          assessments: [
            {
              assess: 'Coursework',
              grade: 85,
              weight: 100
            }
          ]
        }
      ]
    };
    console.log(data);
    // return data;
  }

  x = 70;
  getDataX() {
    const data = {
      courseName: 'Computer Science',
      year: 'firstYear',
      targetGrade: 'first',
      customTarget: 0,
      modules: [
        {
          moduleName: 'Computing Fundamentals',
          dess: null,
          assessments: [
            {
              assess: 'Classroom Test 1',
              grade: this.x,
              weight: 50
            },
            {
              assess: 'Classroom Test 1',
              grade: this.x,
              weight: 50
            }
          ]
        },
        {
          moduleName: 'Programming 1',
          dess: null,
          assessments: [
            {
              assess: 'Workshop Exercises',
              grade: this.x,
              weight: 100
            }
          ]
        },
        {
          moduleName: 'Systems Analysis',
          dess: null,
          assessments: [
            {
              assess: 'Project',
              grade: this.x,
              weight: 90
            },
            {
              assess: 'Presentation',
              grade: this.x,
              weight: 10
            }
          ]
        },
        {
          moduleName: 'Programming 2',
          dess: null,
          assessments: [
            {
              assess: 'Workshop Exercises',
              grade: this.x,
              weight: 30
            },
            {
              assess: 'Exam',
              grade: this.x,
              weight: 70
            }
          ]
        },
        {
          moduleName: 'Relational Databases',
          dess: null,
          assessments: [
            {
              assess: 'Exam 1',
              grade: this.x,
              weight: 50
            },
            {
              assess: 'Exam 2',
              grade: this.x,
              weight: 50
            }
          ]
        },
        {
          moduleName: 'Web Technologies',
          dess: null,
          assessments: [
            {
              assess: 'Coursework',
              grade: this.x,
              weight: 100
            }
          ]
        }
      ]
    };

    return data;
  }
}
