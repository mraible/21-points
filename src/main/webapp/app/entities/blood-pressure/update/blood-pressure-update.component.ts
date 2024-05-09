import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IBloodPressure } from '../blood-pressure.model';
import { BloodPressureService } from '../service/blood-pressure.service';
import { BloodPressureFormService, BloodPressureFormGroup } from './blood-pressure-form.service';

@Component({
  standalone: true,
  selector: 'jhi-blood-pressure-update',
  templateUrl: './blood-pressure-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, HasAnyAuthorityDirective],
})
export class BloodPressureUpdateComponent implements OnInit {
  isSaving = false;
  bloodPressure: IBloodPressure | null = null;

  usersSharedCollection: IUser[] = [];

  protected bloodPressureService = inject(BloodPressureService);
  protected bloodPressureFormService = inject(BloodPressureFormService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: BloodPressureFormGroup = this.bloodPressureFormService.createBloodPressureFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bloodPressure }) => {
      this.bloodPressure = bloodPressure;
      if (bloodPressure) {
        this.updateForm(bloodPressure);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bloodPressure = this.bloodPressureFormService.getBloodPressure(this.editForm);
    if (bloodPressure.id !== null) {
      this.subscribeToSaveResponse(this.bloodPressureService.update(bloodPressure));
    } else {
      this.subscribeToSaveResponse(this.bloodPressureService.create(bloodPressure));
    }
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
    this.bloodPressure = bloodPressure;
    this.bloodPressureFormService.resetForm(this.editForm, bloodPressure);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, bloodPressure.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.bloodPressure?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
