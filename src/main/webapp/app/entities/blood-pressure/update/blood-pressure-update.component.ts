import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IBloodPressure, BloodPressure } from '../blood-pressure.model';
import { BloodPressureService } from '../service/blood-pressure.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-blood-pressure-update',
  templateUrl: './blood-pressure-update.component.html',
})
export class BloodPressureUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    timestamp: [null, [Validators.required]],
    systolic: [null, [Validators.required]],
    diastolic: [null, [Validators.required]],
    user: [],
  });

  constructor(
    protected bloodPressureService: BloodPressureService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bloodPressure }) => {
      if (bloodPressure.id === undefined) {
        const today = dayjs().startOf('day');
        bloodPressure.timestamp = today;
      }

      this.updateForm(bloodPressure);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bloodPressure = this.createFromForm();
    if (bloodPressure.id !== undefined) {
      this.subscribeToSaveResponse(this.bloodPressureService.update(bloodPressure));
    } else {
      this.subscribeToSaveResponse(this.bloodPressureService.create(bloodPressure));
    }
  }

  trackUserById(_index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBloodPressure>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(bloodPressure: IBloodPressure): void {
    this.editForm.patchValue({
      id: bloodPressure.id,
      timestamp: bloodPressure.timestamp ? bloodPressure.timestamp.format(DATE_TIME_FORMAT) : null,
      systolic: bloodPressure.systolic,
      diastolic: bloodPressure.diastolic,
      user: bloodPressure.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, bloodPressure.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IBloodPressure {
    return {
      ...new BloodPressure(),
      id: this.editForm.get(['id'])!.value,
      timestamp: this.editForm.get(['timestamp'])!.value ? dayjs(this.editForm.get(['timestamp'])!.value, DATE_TIME_FORMAT) : undefined,
      systolic: this.editForm.get(['systolic'])!.value,
      diastolic: this.editForm.get(['diastolic'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
