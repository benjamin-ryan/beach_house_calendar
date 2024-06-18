import { Component, OnInit } from '@angular/core';
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
export class CalendarComponent implements OnInit {

  reservations: { [key: number]: Reservation } = {};
  currentMonth: number = new Date().getMonth() + 1;
  currentYear: number = new Date().getFullYear();

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getReservations(this.currentMonth, this.currentYear)
      .subscribe((data: Reservation[]) => {
        this.reservations = {};
        data.forEach(res => {
          this.reservations[res.day] = res;
        });
      });
  }

  getCurrentMonthAndYear(): string {
    const months = ['Zero Month', 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return months[this.currentMonth] + ' ' + this.currentYear;
  }

  goToPreviousMonth(): void {
    if (this.currentMonth === 1) {
      this.currentMonth = 12;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.loadReservations();
  }

  goToNextMonth(): void {
    if (this.currentMonth === 12) {
      this.currentMonth = 1;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.loadReservations();
  }

  weekDays(): string[] {
    return ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  }

  daysOfMonth(): ({ day: number | null, isEmpty: boolean })[] {
    const daysInMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
    const startDayOfWeek = new Date(this.currentYear, this.currentMonth - 1, 1).getDay();
    
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, isEmpty: false }));
    const leadingEmptyCells = Array(startDayOfWeek).fill({ day: null, isEmpty: true });
  
    return [...leadingEmptyCells, ...daysArray];
  }

  isAvailable(day: number): boolean {
    return !this.reservations[day];
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
    if (day === null) return;

    console.log(`toggleStatus called for day: ${day}`);
    
    const reservation = this.reservations[day];
    if (reservation) {
      console.log(`Reservation found for day ${day}: ${reservation.name}`);
      
      const confirmed = confirm('Are you sure you would like to remove this reservation?');
      if (confirmed) {
        console.log(`User confirmed to delete reservation for day ${day}`);
        
        this.reservationService.deleteReservation(reservation.id!)
          .subscribe({
            next: () => {
              console.log(`Deleted reservation for day ${day}`);
              delete this.reservations[day];
            },
            error: (err) => {
              console.error(`Failed to delete reservation: ${err.message}`);
            }
          });
      } else {
        console.log(`User cancelled the delete reservation action for day ${day}`);
      }
    } else {
      console.log(`No reservation found for day ${day}`);
      
      const name = prompt('Enter your name:');
      if (name) {
        console.log(`User entered name: ${name}`);
        
        const newReservation: Reservation = {
          day,
          month: this.currentMonth,
          year: this.currentYear,
          name
        };
        
        this.reservationService.createReservation(newReservation)
          .subscribe({
            next: (res) => {
              console.log(`Created reservation for day ${day}`);
              this.reservations[day] = res;
              this.loadReservations();
            },
            error: (err) => {
              console.error(`Failed to create reservation: ${err.message}`);
            }
          });
      } else {
        console.log(`User did not enter a name for the reservation on day ${day}`);
      }
    }
  }

}
