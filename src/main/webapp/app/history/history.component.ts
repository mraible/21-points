import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, addMinutes, format } from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';
import { PointsService } from '../entities/points/points.service';
import { BloodPressureService } from '../entities/blood-pressure/blood-pressure.service';
import { WeightService } from '../entities/weight/weight.service';
import { Principal } from '../shared';
import { PreferencesService } from '../entities/preferences/preferences.service';
import { JhiEventManager } from 'ng-jhipster';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

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

    view = 'month';

    viewDate: Date = new Date();

    modalData: {
        action: string;
        event: CalendarEvent;
    };

    eventSubscriber: Subscription;

    actions: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({event}: { event: CalendarEvent }): void => {
                this.handleEvent('edit', event);
            }
        },
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({event}: { event: CalendarEvent }): void => {
                this.handleEvent('delete', event);
            }
        }
    ];

    refresh: Subject<any> = new Subject();

    events: CalendarEvent[] = [];

    activeDayIsOpen = true;

    currentAccount: any;

    constructor(private pointsService: PointsService, private bloodPressureService: BloodPressureService,
                private weightService: WeightService, private principal: Principal,
                private preferencesService: PreferencesService, private router: Router,
                private eventManager: JhiEventManager) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.populateCalendar();
        this.registerForChanges();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerForChanges() {
        this.eventSubscriber = this.eventManager.subscribe('pointsListModification', (response) => this.reset());
        this.eventSubscriber = this.eventManager.subscribe('bloodPressureListModification', (response) => this.reset());
        this.eventSubscriber = this.eventManager.subscribe('weightListModification', (response) => this.reset());
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
        const month = format(monthEnd, 'YYYY-MM');
        // console.info('Fetching data for: ' + month);

        this.pointsService.byMonth(month).subscribe((response)  => {
            response.json.points.forEach((item) => {
                const value = item.exercise + item.meals + item.alcohol;
                this.events.push({
                    start: startOfDay(item.date),
                    end: endOfDay(item.date),
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

        this.bloodPressureService.byMonth(month).subscribe((response)  => {
            response.json.readings.forEach((item) => {
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

        this.preferencesService.user().subscribe((response) => {
            const weightUnits = response.weightUnits === null ? 'lbs' : response.weightUnits;
            this.weightService.byMonth(month).subscribe((weightResponse)  => {
                weightResponse.json.weighIns.forEach((item) => {
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
        });
    }

    beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
        body.forEach((cell) => {
            cell['dayPoints'] = cell.events.filter((e) => e.meta['entity'] === 'points');
        });
    }

    dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
    }

    eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.handleEvent('Dropped or resized', event);
        this.refresh.next();
    }

    handleEvent(action: string, event: CalendarEvent): void {
        action = (action === 'Clicked') ? 'edit' : action;
        this.modalData = {event, action};
        const url = this.router.createUrlTree(['/', { outlets: { popup: event.meta.entity + '/' + event.meta.id + '/' + action}}]);
        this.router.navigateByUrl(url.toString());
    }
}
