import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PreferencesFormService, PreferencesFormGroup } from './preferences-form.service';
import { IPreferences } from '../preferences.model';
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
  preferences: IPreferences | null = null;
  unitsValues = Object.keys(Units);

  usersSharedCollection: IUser[] = [];

  editForm: PreferencesFormGroup = this.preferencesFormService.createPreferencesFormGroup();

  constructor(
    protected preferencesService: PreferencesService,
    protected preferencesFormService: PreferencesFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ preferences }) => {
      this.preferences = preferences;
      if (preferences) {
        this.updateForm(preferences);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const preferences = this.preferencesFormService.getPreferences(this.editForm);
    if (preferences.id !== null) {
      this.subscribeToSaveResponse(this.preferencesService.update(preferences));
    } else {
      this.subscribeToSaveResponse(this.preferencesService.create(preferences));
    }
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
    this.preferences = preferences;
    this.preferencesFormService.resetForm(this.editForm, preferences);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, preferences.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.preferences?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
