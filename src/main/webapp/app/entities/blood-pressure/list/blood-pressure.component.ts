import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { IBloodPressure } from '../blood-pressure.model';

import { EntityArrayResponseType, BloodPressureService } from '../service/blood-pressure.service';
import { BloodPressureDeleteDialogComponent } from '../delete/blood-pressure-delete-dialog.component';

@Component({
  selector: 'jhi-blood-pressure',
  templateUrl: './blood-pressure.component.html',
})
export class BloodPressureComponent implements OnInit {
  bloodPressures?: IBloodPressure[];
  isLoading = false;

  predicate = 'id';
  ascending = true;
  currentSearch = '';

  itemsPerPage = ITEMS_PER_PAGE;
  links: { [key: string]: number } = {
    last: 0,
  };
  page = 1;

  constructor(
    protected bloodPressureService: BloodPressureService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected parseLinks: ParseLinks,
    protected modalService: NgbModal,
  ) {}

  reset(): void {
    this.page = 1;
    this.bloodPressures = [];
    this.load();
  }

  loadPage(page: number): void {
    this.page = page;
    this.load();
  }

  trackId = (_index: number, item: IBloodPressure): number => this.bloodPressureService.getBloodPressureIdentifier(item);

  search(query: string): void {
    this.page = 1;
    this.currentSearch = query;
    this.navigateToWithComponentValues();
  }

  ngOnInit(): void {
    this.load();
  }

  delete(bloodPressure: IBloodPressure): void {
    const modalRef = this.modalService.open(BloodPressureDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.bloodPressure = bloodPressure;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations()),
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.page, this.predicate, this.ascending, this.currentSearch);
  }

  navigateToPage(page = this.page): void {
    this.handleNavigation(page, this.predicate, this.ascending, this.currentSearch);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending, this.currentSearch)),
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
    if (params.has('search') && params.get('search') !== '') {
      this.currentSearch = params.get('search') as string;
    }
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.bloodPressures = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: IBloodPressure[] | null): IBloodPressure[] {
    const bloodPressuresNew = this.bloodPressures ?? [];
    if (data) {
      for (const d of data) {
        if (bloodPressuresNew.map(op => op.id).indexOf(d.id) === -1) {
          bloodPressuresNew.push(d);
        }
      }
    }
    return bloodPressuresNew;
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    const linkHeader = headers.get('link');
    if (linkHeader) {
      this.links = this.parseLinks.parse(linkHeader);
    } else {
      this.links = {
        last: 0,
      };
    }
  }

  protected queryBackend(
    page?: number,
    predicate?: string,
    ascending?: boolean,
    currentSearch?: string,
  ): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    const queryObject: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      eagerload: true,
      query: currentSearch,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    if (this.currentSearch && this.currentSearch !== '') {
      return this.bloodPressureService.search(queryObject).pipe(tap(() => (this.isLoading = false)));
    } else {
      return this.bloodPressureService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
    }
  }

  protected handleNavigation(page = this.page, predicate?: string, ascending?: boolean, currentSearch?: string): void {
    const queryParamsObj = {
      search: currentSearch,
      page,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
