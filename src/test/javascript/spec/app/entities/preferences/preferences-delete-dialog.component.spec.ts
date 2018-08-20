/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { PreferencesDeleteDialogComponent } from 'app/entities/preferences/preferences-delete-dialog.component';
import { PreferencesService } from 'app/entities/preferences/preferences.service';

describe('Component Tests', () => {
    describe('Preferences Management Delete Component', () => {
        let comp: PreferencesDeleteDialogComponent;
        let fixture: ComponentFixture<PreferencesDeleteDialogComponent>;
        let service: PreferencesService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [PreferencesDeleteDialogComponent]
            })
                .overrideTemplate(PreferencesDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PreferencesDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PreferencesService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
