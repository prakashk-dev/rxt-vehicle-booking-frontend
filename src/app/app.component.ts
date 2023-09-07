import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { vehicles } from './vehicles-mock';
import { Observable, of } from 'rxjs';
import * as dayjs from 'dayjs';
import { IFormSelect, IFormValue, Vehicle } from './app.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  myForm?: FormGroup;
  makes: IFormSelect[] = [];
  models: IFormSelect[] = [];
  allVehicles: Vehicle[] = [];
  availableVehicles: Vehicle[] = [];
  displayedColumns: string[] = ['make', 'model', 'vin', 'price'];
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // get this data from the backend
    this.fetchVehicles().subscribe((vehicles) => {
      this.allVehicles = vehicles;
      this.createForm();
      this.watchForMakeChanges();
      // backend will send this one
      this.makes = this.calculateUniqueMakes();
    });
  }

  private fetchVehicles(): Observable<Vehicle[]> {
    const sortedVehicles: Vehicle[] = vehicles.sort((a, b) => {
      if (a.make === b.make) {
        return a.model.localeCompare(b.model);
      }
      return a.make.localeCompare(b.make);
    });
    return of(sortedVehicles);
  }

  private createForm(): void {
    this.myForm = this.fb.group({
      // we are assuming that the user can select only one make at a time
      make: new FormControl(''),
      // we are assuming that the user can select only one model at a time
      model: [{ value: '', disabled: true }],
      // we are assuming that the price is for a day and is not related to startDate and endDate
      minPrice: new FormControl(''),
      maxPrice: new FormControl(''),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
    });
  }

  private calculateUniqueMakes(): IFormSelect[] {
    const makeHash: Record<string, string> = {};
    const makes: IFormSelect[] = [];

    this.allVehicles.forEach((vehicle) => {
      if (makeHash[vehicle.make]) return;

      makeHash[vehicle.make] = vehicle.make;
      makes.push({ value: vehicle.make, viewValue: vehicle.make });
    });
    return makes;
  }

  private watchForMakeChanges(): void {
    const modelControl = this.myForm?.get('model');
    this.myForm?.get('make')?.valueChanges.subscribe((value) => {
      value ? modelControl?.enable() : modelControl?.disable();
      modelControl?.setValue('');
      this.calculateSelectedVehicleModels();
    });
  }

  private calculateSelectedVehicleModels(): void {
    const selectedVehicleModels = this.allVehicles.filter(
      (vehicle) => vehicle.make === this.myForm?.get('make')?.value
    );
    this.models = this.getUniqueModels(selectedVehicleModels);
  }

  private getUniqueModels(vehicles: Vehicle[]): IFormSelect[] {
    const modelHash: Record<string, string> = {};
    const models: IFormSelect[] = [];
    vehicles.forEach((vehicle) => {
      if (modelHash[vehicle.model]) return;
      modelHash[vehicle.model] = vehicle.model;
      models.push({ value: vehicle.model, viewValue: vehicle.model });
    });
    return models;
  }

  onSubmit(): void {
    if (this.myForm?.invalid) return;
    console.log(this.parsedFormValue);
    this.availableVehicles = this.allVehicles;
  }

  private get parsedFormValue(): IFormValue {
    const formValue: IFormValue = { ...this.myForm?.value };
    // delete all the empty values
    Object.keys(formValue).forEach(
      (key) =>
        formValue[key as keyof IFormValue] === '' &&
        delete formValue[key as keyof IFormValue]
    );
    return {
      ...formValue,
      startDate: dayjs(this.myForm?.value.startDate).format('DD/MM/YYYY'),
      endDate: dayjs(this.myForm?.value.endDate).format('DD/MM/YYYY'),
    };
  }
}
