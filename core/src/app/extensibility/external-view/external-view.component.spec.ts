/* tslint:disable:max-classes-per-file */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import { ExternalViewComponent } from './external-view.component';
import { ExtensionsService } from '../services/extensions.service';
import { CurrentEnvironmentService } from '../../content/environments/services/current-environment.service';
import { ExtAppViewRegistryService } from '../services/ext-app-view-registry.service';
import {
  IMicroFrontend,
  MicroFrontend
} from '../../shared/datamodel/k8s/microfrontend';

describe('ExternalViewComponent', () => {
  let component: ExternalViewComponent;
  let fixture: ComponentFixture<ExternalViewComponent>;
  let extensionsService: ExtensionsService;
  let currentEnvironmentService: CurrentEnvironmentService;
  let extAppViewRegistryService: ExtAppViewRegistryService;

  class RouterMock {
    navigateByUrl() {
      return Promise.resolve(true);
    }
  }

  class OAuthMock {
    getIdToken() {
      return 'token';
    }
  }

  const ActivatedRouteMock = {
    params: Observable.of({ state: 'testId' }),
    data: Observable.of({ basePath: 'https://my.test.view/#' })
  };

  const url1 = 'https://my.test.view/#testId';

  const ExtensionsServiceStub = {
    getExtensions() {
      return Observable.of([]);
    },
    isUsingSecureProtocol() {
      return true;
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule],
      declarations: [ExternalViewComponent],
      providers: [
        ExtensionsService,
        CurrentEnvironmentService,
        ExtAppViewRegistryService,
        { provide: ActivatedRoute, useValue: ActivatedRouteMock },
        { provide: Router, useValue: new RouterMock() },
        { provide: OAuthService, useValue: new OAuthMock() },
        { provide: ExtensionsService, useValue: ExtensionsServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalViewComponent);
    component = fixture.componentInstance;
    extensionsService = fixture.debugElement.injector.get(ExtensionsService);
    currentEnvironmentService = fixture.debugElement.injector.get(
      CurrentEnvironmentService
    );
    extAppViewRegistryService = fixture.debugElement.injector.get(
      ExtAppViewRegistryService
    );
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the iFrame src attribute to an url', () => {
      fixture.detectChanges();
      const iFrame = document.getElementById('externalViewFrame');
      expect(iFrame.getAttribute('src')).toEqual(url1);
    });
  });

  describe('renderExternalView', () => {
    it('should register external view and send a message', () => {
      spyOn(extAppViewRegistryService, 'registerView').and.returnValue(
        '10-10-10'
      );
      fixture.detectChanges();

      expect(extAppViewRegistryService.registerView).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should deregister external view', () => {
      spyOn(extAppViewRegistryService, 'deregisterView');
      fixture.detectChanges();
      component.ngOnDestroy();
      expect(extAppViewRegistryService.deregisterView).toHaveBeenCalled();
    });
  });
});
