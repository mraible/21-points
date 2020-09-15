import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { endOfDay, endOfMonth, format, getDaysInMonth, isSameDay, isSameMonth, parseISO, startOfDay, startOfMonth } from 'date-fns';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';
import { PointsService } from 'app/entities/points';
import { BloodPressureService } from 'app/entities/blood-pressure';
import { WeightService } from 'app/entities/weight';
import { PreferencesService } from 'app/entities/preferences';
import { JhiEventManager } from 'ng-jhipster';
import { Router } from '@angular/router';
import { Principal } from 'app/core';
import { Subject, Subscription } from 'rxjs';

const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    },
    green: {
        primary: '#008000',
        secondary: '#C3FDB8'
    }
};

@Component({
    selector: 'jhi-history',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'history.component.html',
    styleUrls: ['history.component.css']
})
export class HistoryComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    isCollapsed = true;

    view = 'month';

    viewDate: Date = new Date();

    modalData: {
        action: string;
        event: CalendarEvent;
    };

    eventSubscriber: Subscription;

    actions: CalendarEventAction[] = [
        {
            label: '✏️',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('edit', event);
            }
        },
        {
            label: '❌',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('delete', event);
            }
        }
    ];

    refresh: Subject<any> = new Subject();

    events: CalendarEvent[] = [];

    activeDayIsOpen = true;

    currentAccount: any;

    constructor(
        private pointsService: PointsService,
        private bloodPressureService: BloodPressureService,
        private weightService: WeightService,
        private principal: Principal,
        private preferencesService: PreferencesService,
        private router: Router,
        private eventManager: JhiEventManager
    ) {}

    ngOnInit() {
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.populateCalendar();
        this.registerForChanges();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerForChanges() {
        this.eventSubscriber = this.eventManager.subscribe('pointsListModification', () => this.reset());
        this.eventSubscriber = this.eventManager.subscribe('bloodPressureListModification', () => this.reset());
        this.eventSubscriber = this.eventManager.subscribe('weightListModification', () => this.reset());
    }

    reset() {
        this.events = [];
        this.populateCalendar();
    }

    viewDateChanged() {
        this.reset();
    }

    populateCalendar() {
        const monthEnd = endOfMonth(this.viewDate);
        const month = format(monthEnd, 'yyyy-MM');

        this.pointsService.byMonth(month).subscribe((response: any) => {
            response.body.points.forEach(item => {
                const value = item.exercise + item.meals + item.alcohol;
                this.events.push({
                    start: startOfDay(parseISO(item.date)),
                    end: endOfDay(parseISO(item.date)),
                    title: value + ' Points',
                    color: colors.green,
                    draggable: false,
                    actions: this.actions,
                    meta: {
                        id: item.id,
                        entity: 'points',
                        value,
                        notes: item.notes ? item.notes : ''
                    }
                });
            });
            this.refresh.next();
        });

        this.bloodPressureService.byMonth(month).subscribe((response: any) => {
            response.body.readings.forEach(item => {
                this.events.push({
                    start: new Date(item.timestamp),
                    title: item.systolic + '/' + item.diastolic,
                    color: colors.blue,
                    actions: this.actions,
                    draggable: false,
                    meta: {
                        id: item.id,
                        entity: 'blood-pressure'
                    }
                });
            });
            this.refresh.next();
        });

        this.preferencesService.user().subscribe((preferences: any) => {
            const weightUnits = preferences.body.weightUnits === null ? 'lbs' : preferences.body.weightUnits;
            this.weightService.byMonth(month).subscribe((weightResponse: any) => {
                weightResponse.body.weighIns.forEach(item => {
                    this.events.push({
                        start: new Date(item.timestamp),
                        title: '' + item.weight + ' ' + weightUnits,
                        color: colors.yellow,
                        actions: this.actions,
                        draggable: false,
                        meta: {
                            id: item.id,
                            entity: 'weight'
                        }
                    });
                });
                this.refresh.next();
            });

            const weeklyGoal = preferences.body.weeklyGoal;
            const monthStart = startOfMonth(+month);
            const daysInMonth = getDaysInMonth(+month);

            const sundays = [];
            for (let i = 0; i <= daysInMonth; i++) {
                const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), i);

                if (date.getDay() === 0) {
                    sundays.push(date);
                }
            }

            sundays.forEach(sunday => {
                this.pointsService.byWeek(format(sunday, 'yyyy-MM-DD')).subscribe(data => {
                    const pointsByWeek: any = data.body;
                    this.events.push({
                        start: startOfDay(sunday),
                        end: endOfDay(sunday),
                        title: pointsByWeek.points + '/' + weeklyGoal + ' Points',
                        color: pointsByWeek.points >= 10 ? colors.green : colors.red,
                        cssClass: 'd-none', // hide as an event dot
                        draggable: false,
                        meta: {
                            entity: 'totalPoints',
                            value: pointsByWeek.points,
                            goal: weeklyGoal || 10
                        }
                    });
                    this.refresh.next();
                });
            });
        });
    }

    beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
        body.forEach(cell => {
            cell['dayPoints'] = cell.events.filter(e => e.meta['entity'] === 'points');
            cell['weekPoints'] = cell.events.filter(e => e.meta['entity'] === 'totalPoints');
        });
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
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
        this.refresh.next();
    }

    handleEvent(action: string, event: CalendarEvent): void {
        action = action === 'Clicked' ? 'edit' : action;
        this.modalData = { event, action };
        let url = this.router.createUrlTree(['/', { outlets: { popup: event.meta.entity + '/' + event.meta.id + '/' + action } }]);
        if (action === 'edit') {
            url = this.router.createUrlTree(['/' + event.meta.entity, event.meta.id, 'edit']);
        }
        this.router.navigateByUrl(url.toString());
    }
}
