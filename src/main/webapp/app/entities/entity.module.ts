import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TwentyOnePointsPointsModule } from './points/points.module';
import { TwentyOnePointsBloodPressureModule } from './blood-pressure/blood-pressure.module';
import { TwentyOnePointsWeightModule } from './weight/weight.module';
import { TwentyOnePointsPreferencesModule } from './preferences/preferences.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        TwentyOnePointsPointsModule,
        TwentyOnePointsBloodPressureModule,
        TwentyOnePointsWeightModule,
        TwentyOnePointsPreferencesModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TwentyOnePointsEntityModule {}
