# RTX Vehicle Booking Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.1.

## Development server

To connect the API locally, please download the backend project from [Rtx Vehicle Booking Backend](https://github.com/prakashk-dev/rxt-vehicle-booking-backend) and run the project. By default it runs on port 3000, if not you have to change the `apiUrl` variable from https://github.com/prakashk-dev/rxt-vehicle-booking-frontend/blob/main/src/app/service/app.service.ts#L5.

If you want to use serverless backend, please change [this](https://github.com/prakashk-dev/rxt-vehicle-booking-frontend/blob/main/src/app/service/app.service.ts#L12) variable to use `SERVERLESS_API_URL` instead of `DEV_API_URL`;

After you run the backend project or decided to use serverless and made the necessary changes, run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
