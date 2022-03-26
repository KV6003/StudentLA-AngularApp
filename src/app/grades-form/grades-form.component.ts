import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, AbstractControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-grades-form',
  templateUrl: './grades-form.component.html',
  styleUrls: ['./grades-form.component.css']
})
export class GradesFormComponent implements OnInit {

  gradesCalculatorForm: FormGroup;
  valArr = [];
  gradesErr: boolean = true;
  moduleIndex: string = '';
  weightsBalanced: boolean = false;
  finalYear: boolean = false;
  anyDessChecked: boolean = false; // TODO: Change name
  displayCustomTarget: boolean = false;
  targetValid: boolean = true;
  showInfo: boolean = false;
  // semisterBalanced: boolean = false;

  gradesData: string = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: Router,
    private _dataService: DataService
  ) { }

  ngOnInit() {
    if (this._dataService.token === null) {
      this.router.navigateByUrl('/login');
    }
    this._dataService.currentData.subscribe(data => this.gradesData = data);
    this.newForm();
  }

  newForm() {
    this.hideDessertation();
    this.hideCustomTarget();
    this.targetValid = true;
    this.gradesCalculatorForm = this.fb.group({
      courseName: ['', Validators.required],
      year: ['firstYear', Validators.required],
      targetGrade: ['first', Validators.required],
      customTarget: [0],
      modules: this.fb.array([
        this.addModulesFormGroup()
      ])
    });
    this.validateForm();
    this.onChanges();
  }

  onChanges(): void {
    this.gradesCalculatorForm.valueChanges.subscribe(form => {
      this.validateForm();
    });
  }

  addModulesFormGroup(): FormGroup {
    return this.fb.group({
      moduleName: ['', Validators.required],
      dess: [false],
      // semister: ['', Validators.required],
      assessments: this.fb.array([
        this.addAssessmentsFormGroup()
      ])
    })
  }

  addAssessmentsFormGroup(): FormGroup {
    return this.fb.group({
      assess: ['', Validators.required],
      grade: [],
      weight: [, [Validators.required, Validators.pattern('([0-9]|[1-9][0-9]|100)')]]
    })
  }

  addModule(): void {
    (<FormArray>this.gradesCalculatorForm.get('modules')).push(this.addModulesFormGroup());
  }

  addAssessment(i) {
    this.moduleIndex = '' + i;
    (<FormArray>this.getFormAssessments).push(this.addAssessmentsFormGroup());
  }

  get getFormModules() {
    return <FormArray>this.gradesCalculatorForm.get('modules');
  }

  get getFormAssessments() {
    return <FormArray>this.gradesCalculatorForm.get('modules').get(this.moduleIndex).get('assessments');
  }

  getAssessments(i) {
    this.moduleIndex = '' + i;
    return this.getFormAssessments;
  }

  toggleAnyDessChecked() {
    this.anyDessChecked = !this.anyDessChecked;
  }

  displayDessertation() {
    this.finalYear = true;
  }

  hideDessertation() {
    // reset Dessertation values for all modules
    this.finalYear = false;
    this.anyDessChecked = false;
    this.valArr.forEach((module, i) => {
      if (module.d) {
        module.d = false;
        this.getFormModules.controls[i].patchValue({
          dess: false
        });
      }
    })
  }

  showCustomTarget() {
    this.displayCustomTarget = true;
  }

  hideCustomTarget() {
    this.displayCustomTarget = false;
  }

  onSaveData(): void {
    // Save data
  }

  validateForm() {
    this.valArr = []; // Form Error Array
    // let sem1: number = 0;
    // let sem2: number = 0;
    // let yl: number = 0;

    if (this.gradesCalculatorForm.get('targetGrade').value === 'custom') {
      if (this.gradesCalculatorForm.get('customTarget').value >= 40 && this.gradesCalculatorForm.get('customTarget').value <= 100) {
        this.targetValid = true;
      } else {
        this.targetValid = false;
      }
    } else {
      this.targetValid = true;
    }

    this.getFormModules.controls.forEach((module, i) => {
      // if (module.get('semister').value === "SEM1") sem1++;
      // else if (module.get('semister').value === "SEM2") sem2++;
      // else if (module.get('semister').value === "YL") yl++;

      let anyWeights = false;

      this.valArr.push({
        wUB: null,              // Weights unbalanced error flag
        d: false,               // Is module dessertation flag
        a: []                   // Assessments error array
      });

      if (module.get('dess').value !== null && module.get('dess').value) {
        this.valArr[i].d = true;
      }

      let weight: number = 0;
      let ubW: boolean = false;

      module.value.assessments.forEach((assessment, j) => {

        this.valArr[i].a.push({
          g: false,           // Grage field error flag
          w: false,           // Weight field error flag
          wEmptyErr: false    // Empty error flag for weight field
        });

        if (assessment.grade !== '' && assessment.grade !== null) {
          if (!(parseInt(assessment.grade) >= 0 && parseInt(assessment.grade) <= 100)) this.valArr[i].a[j].g = true;
        }
        if (assessment.weight !== '' && assessment.weight !== null) {
          anyWeights = true;
          weight += parseInt(assessment.weight);
          if (!(parseInt(assessment.weight) >= 0 && parseInt(assessment.weight) <= 100)) this.valArr[i].a[j].w = true;
        } else {
          this.valArr[i].a[j].wEmptyErr = true;
          ubW = true;
        }

      });
      if (weight !== 100) {
        this.weightsBalanced = false;
        if (anyWeights) this.valArr[i].wUB = weight;
      } else this.weightsBalanced = true;

      if (ubW) this.weightsBalanced = false;
    });

    // if ((sem1 === 2 && sem2 === 0 && yl === 0) || (sem1 === 2 && sem2 === 2 && yl === 2)) this.semisterBalanced = true;
    // else this.semisterBalanced = false;

    this.valArr.forEach(module => {
      if (module.wUB) this.gradesErr = true;
      else this.gradesErr = false;
      module.a.find(a => {
        if (a.g || a.w) this.gradesErr = true;
        else this.gradesErr = false;
      });
    });
  }

  verifyForm(): boolean {
    return this.gradesCalculatorForm.invalid || !this.weightsBalanced || this.gradesErr || !this.targetValid || (this.finalYear && !this.anyDessChecked); // || !this.semisterBalanced
  }

  onSubmit(): void {
    this._dataService.updateGradesData(<string>this.gradesCalculatorForm.getRawValue());
    this.route.navigate(['/gradesResults']);
  }

  // getValues(): Observable<string> {

  // }

  onLoadData(): void {
    this.newForm();

    this._dataService.getData();
    // TODO: Get from api call using user id
    // let data = [];
    // data.push(this._dataService.getData());

    // data[0].modules.forEach((m, i) => {
    //   if (i > 0) {
    //     this.addModule();
    //   }
    //   m.assessments.forEach((a, j) => {
    //     if (j > 0) {
    //       this.addAssessment(i);
    //     }
    //   });
    // });

    // this.gradesCalculatorForm.patchValue(data[0]);
    // this.weightsBalanced = true;
    // if (data[0].courseName === 'finalYear') this.finalYear = true;
    // else this.finalYear = false;

    // if (data[0].targetGrade === 'custom') {
    //   this.displayCustomTarget = true;
    //   this.targetValid = true;
    // } else {
    //   this.displayCustomTarget = false;
    //   this.targetValid = true;
    // }
  }

  toggleInfo(): void {
    this.showInfo = !this.showInfo;
  }
}
