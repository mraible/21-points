import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { endOfDay, endOfMonth, format, getDaysInMonth, isSameDay, isSameMonth, parseISO, startOfDay, startOfMonth } from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PointsService } from '../entities/points/service/points.service';
import { BloodPressureService } from '../entities/blood-pressure/service/blood-pressure.service';
import { WeightService } from '../entities/weight/service/weight.service';
import { PreferencesService } from '../entities/preferences/service/preferences.service';
import { IPoints } from '../entities/points/points.model';
import { IBloodPressure } from '../entities/blood-pressure/blood-pressure.model';
import { IWeight } from '../entities/weight/weight.model';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#008000',
    secondary: '#C3FDB8',
  },
};

@Component({
  selector: 'jhi-history',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'history.component.html',
  styleUrls: ['history.component.css'],
})
export class HistoryComponent implements OnInit {
  isCollapsed = true;

  view = 'month';

  viewDate: Date = new Date();

  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '✏️',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('edit', event);
      },
    },
    {
      label: '❌',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('delete', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen = true;

  constructor(
    private pointsService: PointsService,
    private bloodPressureService: BloodPressureService,
    private weightService: WeightService,
    private preferencesService: PreferencesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.populateCalendar();
  }

  reset(): void {
    this.events = [];
    this.populateCalendar();
  }

  viewDateChanged(): void {
    this.reset();
  }

  populateCalendar(): void {
    const monthEnd = endOfMonth(this.viewDate);
    const month = format(monthEnd, 'yyyy-MM');

    this.pointsService.byMonth(month).subscribe((response: any) => {
      response.body.points.forEach((item: IPoints) => {
        const exercise = item.exercise ? item.exercise : 0;
        const meals = item.meals ? item.meals : 0;
        const alcohol = item.alcohol ? item.alcohol : 0;
        const value = exercise + meals + alcohol;
        const date = item.date ? item.date : new Date();
        this.events.push({
          // @ts-ignore
          start: startOfDay(parseISO(date)),
          // @ts-ignore
          end: endOfDay(parseISO(date)),
          title: `${value} Points`,
          color: colors.green,
          draggable: false,
          actions: this.actions,
          meta: {
            id: item.id,
            entity: 'points',
            value,
            notes: item.notes ? item.notes : '',
          },
        });
      });
      //this.refresh.next();
    });

    this.bloodPressureService.byMonth(month).subscribe((response: any) => {
      response.body.readings.forEach((item: IBloodPressure) => {
        this.events.push({
          start: new Date(item?.timestamp),
          title: `${item.systolic}/${item.diastolic}`,
          color: colors.blue,
          actions: this.actions,
          draggable: false,
          meta: {
            id: item.id,
            entity: 'blood-pressure',
          },
        });
      });
      //this.refresh.next();
    });

    this.preferencesService.user().subscribe((preferences: any) => {
      const weightUnits = preferences.body.weightUnits === null ? 'lbs' : preferences.body.weightUnits;
      this.weightService.byMonth(month).subscribe((weightResponse: any) => {
        weightResponse.body.weighIns.forEach((item: IWeight) => {
          this.events.push({
            start: new Date(item?.timestamp),
            title: `${item?.weight} ${weightUnits}`,
            color: colors.yellow,
            actions: this.actions,
            draggable: false,
            meta: {
              id: item.id,
              entity: 'weight',
            },
          });
        });
        // this.refresh.next();
      });

      const weeklyGoal = preferences.body.weeklyGoal;
      const monthStart = startOfMonth(this.viewDate);
      const daysInMonth = getDaysInMonth(this.viewDate);

      const sundays = [];
      for (let i = 0; i <= daysInMonth; i++) {
        const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), i);

        if (date.getDay() === 0) {
          sundays.push(date);
        }
      }

      sundays.forEach(sunday => {
        this.pointsService.byWeek(format(sunday, 'yyyy-MM-dd')).subscribe(data => {
          const pointsByWeek: any = data.body;
          this.events.push({
            start: startOfDay(sunday),
            end: endOfDay(sunday),
            title: `${pointsByWeek.points}/${weeklyGoal} Points`,
            color: pointsByWeek.points >= 10 ? colors.green : colors.red,
            cssClass: 'd-none', // hide as an event dot
            draggable: false,
            meta: {
              entity: 'totalPoints',
              value: pointsByWeek.points,
              goal: weeklyGoal || 10,
            },
          });
          //this.refresh.next();
        });
      });
    });
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach((cell: CalendarMonthViewDay) => {
      cell['dayPoints'] = cell.events.filter(e => e.meta['entity'] === 'points');
      cell['weekPoints'] = cell.events.filter(e => e.meta['entity'] === 'totalPoints');
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen) || events.length === 0) {
        this.activeDayIsOpen = false;
        // if no events, clicking on day brings up add points
        if (events.length === 0) {
          this.router.navigateByUrl('/points/new?date=' + format(date, 'yyyy-MM-dd'));
        }
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    //this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    action = action === 'Clicked' ? 'edit' : action;
    this.modalData = { event, action };
    let url = this.router.createUrlTree(['/', { outlets: { popup: `${event.meta.entity}/${event.meta.id}/${action}` } }]);
    if (action === 'edit') {
      url = this.router.createUrlTree([`/${event.meta.entity}`, event.meta.id, 'edit']);
    }
    this.router.navigateByUrl(url.toString());
  }
}
