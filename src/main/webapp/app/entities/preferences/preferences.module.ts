import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PreferencesComponent } from './list/preferences.component';
import { PreferencesDetailComponent } from './detail/preferences-detail.component';
import { PreferencesUpdateComponent } from './update/preferences-update.component';
import { PreferencesDeleteDialogComponent } from './delete/preferences-delete-dialog.component';
import { PreferencesRoutingModule } from './route/preferences-routing.module';

@NgModule({
  imports: [SharedModule, PreferencesRoutingModule],
  declarations: [PreferencesComponent, PreferencesDetailComponent, PreferencesUpdateComponent, PreferencesDeleteDialogComponent],
})
export class PreferencesModule {}
