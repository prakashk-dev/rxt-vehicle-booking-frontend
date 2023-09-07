import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { IFormValue } from './app.types';
describe('AppComponent', () => {
  let app: AppComponent;
  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule],
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should delete empty objects', () => {
    const outputExpected: IFormValue = {
      make: 'Toyota',
      model: 'Camry',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };
    const formValue: IFormValue = {
      ...outputExpected,
      minPrice: '',
      maxPrice: '',
    };
    expect(app['parsedFormValue'](formValue)).toEqual(outputExpected);
  });
});
