import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../reservation.service';

interface Reservation {
  id?: number;
  day: number;
  month: number;
  year: number;
  name: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {

  reservations: { [key: number]: {reserved: boolean, name?: string } } = {};
  currentMonth: number = new Date().getMonth() + 1;
  currentYear: number = new Date().getFullYear();

  constructor(private reservationService: ReservationService) {}

  goToPreviousMonth(): void {}

  goToNextMonth(): void {}

  weekDays(): string[] {
    return ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  }

  daysOfMonth(): number[] {
    const numbers: number[] = [];
    for (let i = 1; i <= 30; i++) {
      numbers.push(i);
    }
    return numbers;
  }

  isAvailable(day: number): boolean {
    return !this.reservations[day]?.reserved;
  }

  reservedStatus(day: number): string {
    const reservation = this.reservations[day];
    if (reservation) {
      return 'Reserved by ' + reservation.name;
    }
    else {
      return 'Available';
    }
  }

  toggleStatus(day: number): void {
    const reservation = this.reservations[day];
    if (reservation && reservation.reserved) {
      const confirmed = confirm('Are you sure you would like to remove this reservation?');
      if (confirmed) {
        delete this.reservations[day];
      }
    } else {
      const name = prompt('Enter your name:');
      if (name) {
        this.reservations[day] = { reserved: true, name };
      }
    }
  }

}
