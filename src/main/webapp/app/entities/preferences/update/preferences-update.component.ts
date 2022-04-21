import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPreferences, Preferences } from '../preferences.model';
import { PreferencesService } from '../service/preferences.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { Units } from 'app/entities/enumerations/units.model';

@Component({
  selector: 'jhi-preferences-update',
  templateUrl: './preferences-update.component.html',
})
export class PreferencesUpdateComponent implements OnInit {
  isSaving = false;
  unitsValues = Object.keys(Units);

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    weeklyGoal: [null, [Validators.required, Validators.min(10), Validators.max(21)]],
    weightUnits: [null, [Validators.required]],
    user: [],
  });

  constructor(
    protected preferencesService: PreferencesService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ preferences }) => {
      this.updateForm(preferences);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const preferences = this.createFromForm();
    if (preferences.id !== undefined) {
      this.subscribeToSaveResponse(this.preferencesService.update(preferences));
    } else {
      this.subscribeToSaveResponse(this.preferencesService.create(preferences));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPreferences>>): void {
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

  protected updateForm(preferences: IPreferences): void {
    this.editForm.patchValue({
      id: preferences.id,
      weeklyGoal: preferences.weeklyGoal,
      weightUnits: preferences.weightUnits,
      user: preferences.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, preferences.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IPreferences {
    return {
      ...new Preferences(),
      id: this.editForm.get(['id'])!.value,
      weeklyGoal: this.editForm.get(['weeklyGoal'])!.value,
      weightUnits: this.editForm.get(['weightUnits'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
