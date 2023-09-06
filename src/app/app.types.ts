export interface IFormSelect {
  value: string;
  viewValue: string;
}

export interface IFormValue {
  make?: string;
  model?: string;
  minPrice?: string;
  maxPrice?: string;
  startDate: string;
  endDate: string;
}

export interface Vehicle {
  vin: string;
  make: string;
  model: string;
  price: string;
}
