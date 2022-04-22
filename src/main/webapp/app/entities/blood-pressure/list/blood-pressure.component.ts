import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBloodPressure } from '../blood-pressure.model';

import { ASC, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { BloodPressureService } from '../service/blood-pressure.service';
import { BloodPressureDeleteDialogComponent } from '../delete/blood-pressure-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-blood-pressure',
  templateUrl: './blood-pressure.component.html',
})
export class BloodPressureComponent implements OnInit {
  bloodPressures: IBloodPressure[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;
  currentSearch: string;

  constructor(
    protected bloodPressureService: BloodPressureService,
    protected modalService: NgbModal,
    protected parseLinks: ParseLinks,
    protected activatedRoute: ActivatedRoute
  ) {
    this.bloodPressures = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
    this.currentSearch = this.activatedRoute.snapshot.queryParams['search'] ?? '';
  }

  loadAll(): void {
    this.isLoading = true;
    if (this.currentSearch) {
      this.bloodPressureService
        .search({
          query: this.currentSearch,
          page: this.page,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<IBloodPressure[]>) => {
            this.isLoading = false;
            this.paginateBloodPressures(res.body, res.headers);
          },
          error: () => {
            this.isLoading = false;
          },
        });
      return;
    }

    this.bloodPressureService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IBloodPressure[]>) => {
          this.isLoading = false;
          this.paginateBloodPressures(res.body, res.headers);
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  reset(): void {
    this.page = 0;
    this.bloodPressures = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  search(query: string): void {
    this.bloodPressures = [];
    this.links = {
      last: 0,
    };
    this.page = 0;
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IBloodPressure): number {
    return item.id!;
  }

  delete(bloodPressure: IBloodPressure): void {
    const modalRef = this.modalService.open(BloodPressureDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.bloodPressure = bloodPressure;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateBloodPressures(data: IBloodPressure[] | null, headers: HttpHeaders): void {
    const linkHeader = headers.get('link');
    if (linkHeader) {
      this.links = this.parseLinks.parse(linkHeader);
    } else {
      this.links = {
        last: 0,
      };
    }
    if (data) {
      for (const d of data) {
        this.bloodPressures.push(d);
      }
    }
  }
}
