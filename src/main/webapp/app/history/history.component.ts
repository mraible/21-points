import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { endOfDay, endOfMonth, format, getDaysInMonth, isSameDay, isSameMonth, startOfDay, startOfMonth } from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay, CalendarView } from 'angular-calendar';
import { Router } from '@angular/router';
import { filter, Subject } from 'rxjs';
import { PointsService } from '../entities/points/service/points.service';
import { BloodPressureService } from '../entities/blood-pressure/service/blood-pressure.service';
import { WeightService } from '../entities/weight/service/weight.service';
import { PreferencesService } from '../entities/preferences/service/preferences.service';
import { IPoints, IPointsPerWeek } from '../entities/points/points.model';
import { IBloodPressure } from '../entities/blood-pressure/blood-pressure.model';
import { IWeight } from '../entities/weight/weight.model';
import { EventColor } from 'calendar-utils';
import dayjs from 'dayjs/esm';
import { PointsDeleteDialogComponent } from '../entities/points/delete/points-delete-dialog.component';
import { ITEM_DELETED_EVENT } from '../config/navigation.constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BloodPressureDeleteDialogComponent } from '../entities/blood-pressure/delete/blood-pressure-delete-dialog.component';
import { WeightDeleteDialogComponent } from '../entities/weight/delete/weight-delete-dialog.component';

const colors: Record<string, EventColor> = {
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
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  isCollapsed = true;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];

  activeDayIsOpen = true;

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

  constructor(
    private pointsService: PointsService,
    private bloodPressureService: BloodPressureService,
    private weightService: WeightService,
    private preferencesService: PreferencesService,
    private router: Router,
    protected modalService: NgbModal
  ) {}

  setView(view: CalendarView): void {
    this.view = view;
  }

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
    const month = format(monthEnd, 'YYYY-MM');

    this.pointsService.byMonth(month).subscribe((response: any) => {
      response.body.points.forEach((item: IPoints) => {
        const exercise = item.exercise ? item.exercise : 0;
        const meals = item.meals ? item.meals : 0;
        const alcohol = item.alcohol ? item.alcohol : 0;
        const value = exercise + meals + alcohol;
        const date = item.date ? dayjs(item.date) : null;
        this.events.push({
          start: date ? startOfDay(date.toISOString()) : new Date(),
          end: date ? endOfDay(date.toISOString()) : new Date(),
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
      this.refresh.next();
    });

    this.bloodPressureService.byMonth(month).subscribe((response: any) => {
      response.body.readings.forEach((item: IBloodPressure) => {
        if (item.timestamp && item.systolic && item.diastolic) {
          this.events.push({
            start: dayjs(item.timestamp).toDate(),
            title: `${item.systolic}/${item.diastolic}`,
            color: colors.blue,
            actions: this.actions,
            draggable: false,
            meta: {
              id: item.id,
              entity: 'blood-pressure',
            },
          });
        }
      });
      this.refresh.next();
    });

    this.preferencesService.user().subscribe((preferences: any) => {
      const weightUnits: string = preferences.body.weightUnits === null ? 'lbs' : preferences.body.weightUnits;
      this.weightService.byMonth(month).subscribe((weightResponse: any) => {
        weightResponse.body.weighIns.forEach((item: IWeight) => {
          if (item.timestamp && item.weight) {
            this.events.push({
              start: dayjs(item.timestamp).toDate(),
              title: `${item.weight} ${weightUnits}`,
              color: colors.yellow,
              actions: this.actions,
              draggable: false,
              meta: {
                id: item.id,
                entity: 'weight',
              },
            });
          }
        });
        this.refresh.next();
      });

      const weeklyGoal: number = preferences.body.weeklyGoal;
      const monthStart = startOfMonth(this.viewDate);
      const daysInMonth: number = getDaysInMonth(this.viewDate);

      const sundays = [];
      for (let i = 0; i <= daysInMonth; i++) {
        const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), i);

        if (date.getDay() === 0) {
          sundays.push(date);
        }
      }

      sundays.forEach(sunday => {
        this.pointsService.byWeek(format(sunday, 'YYYY-MM-DD')).subscribe(data => {
          const { points }: IPointsPerWeek = data.body;
          this.events.push({
            start: startOfDay(sunday),
            end: endOfDay(sunday),
            title: `${points}/${weeklyGoal} Points`,
            color: points >= 10 ? colors.green : colors.red,
            cssClass: 'd-none', // hide as an event dot
            draggable: false,
            meta: {
              entity: 'totalPoints',
              value: points,
              goal: weeklyGoal || 10,
            },
          });
          this.refresh.next();
        });
      });
    });
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach((cell: any) => {
      cell['dayPoints'] = cell.events.filter((e: CalendarEvent) => e.meta['entity'] === 'points');
      cell['weekPoints'] = cell.events.filter((e: CalendarEvent) => e.meta['entity'] === 'totalPoints');
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen) || events.length === 0) {
        this.activeDayIsOpen = false;
        // if no events, clicking on day brings up add points
        if (events.length === 0) {
          this.router.navigateByUrl('/points/new?date=' + format(date, 'YYYY-MM-DD'));
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
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    action = action === 'Clicked' ? 'edit' : action;
    this.modalData = { event, action };
    if (action === 'edit') {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const url = this.router.createUrlTree([`/${event.meta.entity}`, event.meta.id, action]);
      this.router.navigateByUrl(url);
    }
    if (action === 'delete') {
      this.delete(event);
    }
  }

  delete(event: CalendarEvent): void {
    let dialog: any = undefined;
    switch (event.meta.entity) {
      case 'points':
        dialog = PointsDeleteDialogComponent;
        break;
      case 'blood-pressure':
        dialog = BloodPressureDeleteDialogComponent;
        break;
      case 'weight':
        dialog = WeightDeleteDialogComponent;
        break;
      default:
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.error(`No dialog for entity: ${event.meta.entity}`);
        break;
    }

    const entityField = event.meta.entity.replace(/-([a-z])/g, (match: string, group: string) => group.toUpperCase());
    const modalRef = this.modalService.open(dialog, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance[entityField] = event.meta;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.pipe(filter((reason: string) => reason === ITEM_DELETED_EVENT)).subscribe({
      next: () => {
        this.events = this.events.filter(item => item !== event);
        this.refresh.next();
      },
    });
  }
}
