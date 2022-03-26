import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-grades-results',
  templateUrl: './grades-results.component.html',
  styleUrls: ['./grades-results.component.css']
})
export class GradesResultsComponent implements OnInit {
  initialData = [];
  gradesData = [];
  targetGrade: number = 0;
  year: string = '';
  status: number = 1;
  markArr = [];
  editMark: number = 0;

  constructor(private router: Router, private _dataService: DataService) { }

  ngOnInit(): void {
    if (this._dataService.token === null) {
      this.router.navigateByUrl('/login');
    }
    this._dataService.currentData.subscribe(data => this.initialData.push(data));
    this.gradesData = this.initialData;
    if (this.gradesData[0] !== "") {
      this.findYear();
      this.findTarget();
      this.calculate();
    } else {
      console.log('No data!');
      this.status = -1;
    }
  }

  findYear() {
    switch (this.gradesData[0].year) {
      case 'firstYear':
        this.year = 'Year 1';
        break
      case 'secondYear':
        this.year = 'Year 2';
        break
      case 'finalYear':
        this.year = 'Final Year';
        break
    }
  }

  findTarget() {
    switch (this.gradesData[0].targetGrade) {
      case 'custom':
        this.targetGrade = this.gradesData[0].customTarget;
        break;
      case 'first':
        this.targetGrade = 70;
        break;
      case 'twoOne':
        this.targetGrade = 60;
        break;
      case 'twoTwo':
        this.targetGrade = 50;
        break;
      case 'third':
        this.targetGrade = 40;
        break;
    }
  }

  calculate() {
    let totalMark: number = 0;
    let incompleteMod: number = 0; // remove????
    let requiredMark: number = 0;
    let remainingWeights: number = 0;
    let perModMark: number = 0; // remove!!!!!!!

    this.gradesData[0].modules.forEach((module, i) => {
      this.markArr.push({
        id: i,
        // complete: true,
        remPrecent: 0,
        skip: false,
        assess: []
      });

      module.assessments.forEach((assessment, j) => {
        if (assessment.grade !== null) {
          // Calculate the relative grade for the module
          const relMark = assessment.grade * (assessment.weight / 100);

          // Dissertation module have only one assessment
          // If module is a Dissertation, multiply relative grade by 2
          // and add to the total mark
          if (module.dess) totalMark += relMark * 2;
          else totalMark += relMark;
          this.markArr[i].assess.push({
            id: j,
            weight: assessment.weight,
            calRequired: false,
            edited: false
          });
        } else {
          if (module.dess) remainingWeights += assessment.weight * 2;
          else remainingWeights += assessment.weight;
          // remainingWeights += assessment.weight
          // Module with one or more incomplete assessments
          this.markArr[i].remPrecent += assessment.weight;
          this.markArr[i].assess.push({
            id: j,
            weight: assessment.weight,
            calRequired: true,
            edited: false
          });
        }
      });

      if (this.markArr[i].remPrecent > 0) incompleteMod++;
    });

    this.assignMarks(incompleteMod, totalMark, requiredMark, remainingWeights);
  }

  assignMarks(incompleteMod, totalMark, requiredMark, remainingWeights) {
    // If any marks to calculate
    if (incompleteMod > 0) {
      // Calculate per module marks
      // maximum credits for academic year is 120 and
      // for each module 20. 120 / 20 = 6 therefore
      // required marks = 6 * target marks
      requiredMark = parseFloat(((this.targetGrade * 6) - totalMark).toFixed(10));
      // perModMark = parseFloat((requiredMark / incompleteMod).toFixed(10));
      // console.log('requiredMark:: ' + requiredMark); // #####################################
      // console.log('remainingWeights:: ' + remainingWeights); // #####################################
      // console.log('incompleteMod:: ' + incompleteMod); // #####################################
      // console.log('Initial Target:: ' + this.targetGrade); // #####################################
      // // console.log('perModMark:: ' + perModMark); // #####################################
      // console.log('-------------------------'); // #####################################

      // Assign marks
      // console.log(remainingWeights);
      // console.log(requiredMark);
      if (remainingWeights >= requiredMark) {
        let grade = (requiredMark / remainingWeights) * 100;
        if (grade >= 40) {
          this.markArr.forEach(m => {
            // If marks to calculate
            if (m.remPrecent > 0) {
              m.assess.forEach(a => {
                // If grade is required to be calculated
                if (a.calRequired) {
                  // let calculatedGrade = grade;
                  // if (this.gradesData[0].modules[m.id].dess) {
                  //     calculatedGrade = calculatedGrade / 2;
                  // }
                  this.gradesData[0].modules[m.id].assessments[a.id].grade = parseFloat(grade.toFixed(0));
                }
              });
            }
          });
        } else {
          let mimPossibleMarkls = 0;
          this.markArr.forEach(m => {
            // If marks to calculate
            if (m.remPrecent > 0) {
              m.assess.forEach(a => {
                // If grade is required to be calculated
                if (a.calRequired) {
                  this.gradesData[0].modules[m.id].assessments[a.id].grade = 40;
                  let calculatedGrade = 40 * (a.weight / 100);
                  if (this.gradesData[0].modules[m.id].dess) {
                    calculatedGrade = calculatedGrade * 2;
                  }
                  mimPossibleMarkls += calculatedGrade;
                }
              });
            }
          });
          this.targetGrade = (totalMark + mimPossibleMarkls) / 6;
          setTimeout(function () {
            alert("CONGRATULATIONS!\nYou've done soo well that youre exceding your target grade.\nThe target you see was increased.\nIt is the lowest you can get with your current grades.");
          }, 100);
        }
      } else {
        let maxPossibleMarkls = 0;
        this.markArr.forEach(m => {
          // If marks to calculate
          if (m.remPrecent > 0) {
            m.assess.forEach(a => {
              // If grade is required to be calculated
              if (a.calRequired) {
                this.gradesData[0].modules[m.id].assessments[a.id].grade = 100;
                let calculatedGrade = 100 * (a.weight / 100);
                if (this.gradesData[0].modules[m.id].dess) {
                  calculatedGrade = calculatedGrade * 2;
                }
                maxPossibleMarkls += calculatedGrade;
              }
            });
          }
        });
        this.targetGrade = (totalMark + maxPossibleMarkls) / 6;
        setTimeout(function () {
          alert("Target garde cannot be reached!\nThe target you see is the highest you can get with your current grades.");
        }, 100);
      }
      /*this.markArr.forEach(m => {
          // If marks to calculate
          if (m.remPrecent > 0) {
              console.log('m.remPrecent:: ' + m.remPrecent); // #####################################
              m.assess.forEach(a => {
                  // If grade is required to be calculated
                  if (a.calRequired) {
                      console.log('perModMark:: ' + perModMark); // #####################################
                      const weight = this.gradesData[0].modules[m.id].assessments[a.id].weight;
                      // If grade to be calculated will not be above 100%
                      if (perModMark <= m.remPrecent) {
                          // If marks required are above or equal to the passing marks
                          if ((perModMark / (m.remPrecent / 100)) >= 40) {
                              if (m.remPrecent === 100) {
                                  console.log('##############');
                                  this.gradesData[0].modules[m.id].assessments[a.id].grade = perModMark;
                              } else {
                                  console.log('======================');
                                  // Calculate grade => e.g. weight = 70%, marks required = 45.5 => grade = (45.5 / 0.7) = 65%
                                  this.gradesData[0].modules[m.id].assessments[a.id].grade = perModMark / (a.weight / 100);
                              }
                          } else {
                              // Set mark to minimum passing mark
                              this.gradesData[0].modules[m.id].assessments[a.id].grade = 40;
                              
                              console.log('this.targetGrade before :: ' + this.targetGrade); // #####################################
                              this.targetGrade = (totalMark + (40 * incompleteMod)) / 6;
                              console.log('this.targetGrade after :: ' + this.targetGrade); // #####################################
                              // Status 1 = target increased
                              this.status = 1;
                              console.log('Target Increased:: ' + this.targetGrade); // #####################################
                          }
                      } else {
                          console.log("Cannot reach target: " + this.targetGrade); // #####################################
                          this.markArr
                          // if ()

                          // Calculate highest possible overall grade
                          this.targetGrade = (totalMark + (100 * incompleteMod)) / 6;
                          if (this.targetGrade >= 40) {
                              // Set mark to maximum (100%)
                              this.gradesData[0].modules[m.id].assessments[a.id].grade = 100;

                              // Status 0 = target lowered
                              this.status = 0;
                          }
                          else {
                              console.log('You will FAIL!');
                              // do something #####################################
                          }
                          console.log('Target Lowered:: ' + this.targetGrade); // #####################################
                      }
                  }
              });
          }
      });*/ // end !!!!!!!!!!!!!!!!!!!!
    } else {
      alert("no grades to calculate!\nCalculating target grade...");

    }
  }

  editResult(i, j) {
    let edited = this.markArr[i].assess[j].edited;
    let calRequired = this.markArr[i].assess[j].calRequired;

    if (edited && !calRequired) {
      console.log('222');
      this.editMark = this.gradesData[0].modules[i].assessments[j].grade;
      this.markArr[i].assess[j].edited = true;
      this.markArr[i].assess[j].calRequired = true;
    } else {
      console.log('333');
      this.editMark = this.gradesData[0].modules[i].assessments[j].grade;
      this.markArr[i].assess[j].edited = true;
    }
  }

  saveResults(i, j) {
    this.markArr.forEach((m, i) => {
      m.assess.forEach((a, j) => {
        if (a.calRequired) {
          if (!a.edited) {
            this.gradesData[0].modules[i].assessments[j].grade = null;
          }
        }
      });
    });
    // this.markArr[i].assess[j].calRequired = false;
    this.markArr = [];
    this.calculate();
  }

  cancelEdit(i, j) {
    this.markArr[i].assess[j].edited = false;
    this.gradesData[0].modules[i].assessments[j].grade = this.editMark;
  }
}
