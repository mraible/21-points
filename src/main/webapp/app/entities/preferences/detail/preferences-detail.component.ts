import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPreferences } from '../preferences.model';

@Component({
  selector: 'jhi-preferences-detail',
  templateUrl: './preferences-detail.component.html',
})
export class PreferencesDetailComponent implements OnInit {
  preferences: IPreferences | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ preferences }) => {
      this.preferences = preferences;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
