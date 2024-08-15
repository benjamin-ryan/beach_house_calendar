import { Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
    { path: '', component: LoginComponent }
];
