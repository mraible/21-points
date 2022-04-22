import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPoints, Points } from '../points.model';
import { PointsService } from '../service/points.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-points-update',
  templateUrl: './points-update.component.html',
})
export class PointsUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    exercise: [],
    meals: [],
    alcohol: [],
    notes: [null, [Validators.maxLength(140)]],
    user: [],
  });

  constructor(
    protected pointsService: PointsService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ points }) => {
      this.updateForm(points);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const points = this.createFromForm();
    if (points.id !== undefined) {
      this.subscribeToSaveResponse(this.pointsService.update(points));
    } else {
      this.subscribeToSaveResponse(this.pointsService.create(points));
    }
  }

  trackUserById(_index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPoints>>): void {
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

  protected updateForm(points: IPoints): void {
    this.editForm.patchValue({
      id: points.id,
      date: points.date,
      exercise: points.exercise,
      meals: points.meals,
      alcohol: points.alcohol,
      notes: points.notes,
      user: points.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, points.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IPoints {
    return {
      ...new Points(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value,
      exercise: this.editForm.get(['exercise'])!.value,
      meals: this.editForm.get(['meals'])!.value,
      alcohol: this.editForm.get(['alcohol'])!.value,
      notes: this.editForm.get(['notes'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
