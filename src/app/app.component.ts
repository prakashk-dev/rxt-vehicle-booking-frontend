import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EMPTY, Observable, catchError } from 'rxjs';
import { IFormSelect, IFormValue, Vehicle } from './app.types';
import { AppService } from './service/app.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
@UntilDestroy()
export class AppComponent implements OnInit {
  minDate = new Date();
  formGroup?: FormGroup;
  vehicleMakes: IFormSelect[] = [];
  vehicleModels: IFormSelect[] = [];
  vehicleMakeToModels: Record<string, string[]> = {};
  availableVehicles: Vehicle[] = [];
  displayedColumns: string[] = ['make', 'model', 'vin', 'price'];
  serverError: string = '';

  constructor(private fb: FormBuilder, private appService: AppService) {}

  ngOnInit(): void {
    this.fetchVehicleMakeAndModels();
    this.createForm();
    this.watchForMakeChanges();
  }

  private fetchVehicleMakeAndModels(): void {
    this.appService
      .getMakeAndModels()
      .pipe(
        untilDestroyed(this),
        catchError((err) => this.handleError(err))
      )
      .subscribe((data) => {
        this.serverError = '';
        this.vehicleMakeToModels = data;
        this.vehicleMakes = this.createVehicleMakeData(data);
      });
  }

  private createVehicleMakeData(
    vehicleMakeToModels: Record<string, string[]>
  ): IFormSelect[] {
    const vehicleMakesSelectData: IFormSelect[] = Object.keys(
      vehicleMakeToModels
    ).map((make) => ({
      value: make,
      viewValue: make,
    }));
    // sort the makes alphabetically
    vehicleMakesSelectData.sort((a, b) =>
      a.viewValue.localeCompare(b.viewValue)
    );
    return vehicleMakesSelectData;
  }

  private createForm(): void {
    this.formGroup = this.fb.group({
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

  private watchForMakeChanges(): void {
    const modelControl = this.formGroup?.get('model');
    const makeControl = this.formGroup?.get('make');
    makeControl?.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      // enable model selection only if make is selected
      value ? modelControl?.enable() : modelControl?.disable();
      // reset model selection if make is changed
      modelControl?.setValue('');
      this.vehicleModels = this.createVehicleModelData(
        this.vehicleMakeToModels[makeControl?.value]
      );
    });
  }

  private createVehicleModelData(vehicleModels: string[]): IFormSelect[] {
    const vehicleModelsSelectData = vehicleModels.map((model) => ({
      value: model,
      viewValue: model,
    }));

    vehicleModelsSelectData.sort((a, b) =>
      a.viewValue.localeCompare(b.viewValue)
    );
    return vehicleModelsSelectData;
  }

  onSubmit(): void {
    if (this.formGroup?.invalid) return;
    this.appService
      .getAvailableCars(this.parsedFormValue(this.formGroup?.value))
      .pipe(
        untilDestroyed(this),
        catchError((err) => this.handleError(err))
      )
      .subscribe((data) => this.handleSuccess(data));
  }

  private handleSuccess(data: Vehicle[]): void {
    this.serverError = '';
    this.availableVehicles = data.sort((a, b) => {
      if (a.make === b.make) {
        return a.model.localeCompare(b.model);
      }
      return a.make.localeCompare(b.make);
    });
  }

  private parsedFormValue(formValue: IFormValue): IFormValue {
    const formValueCopy: IFormValue = { ...formValue };
    // delete all the empty values
    Object.keys(formValueCopy).forEach(
      (key) =>
        formValueCopy[key as keyof IFormValue] === '' &&
        delete formValueCopy[key as keyof IFormValue]
    );
    return formValueCopy;
  }

  private handleError(err: any): Observable<never> {
    this.serverError = err.message || 'Something went wrong';
    return EMPTY;
  }
}
