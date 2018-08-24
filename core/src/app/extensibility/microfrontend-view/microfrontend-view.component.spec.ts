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

import { MicrofrontendViewComponent } from './microfrontend-view.component';
import { ExtensionsService } from '../services/extensions.service';
import { CurrentEnvironmentService } from '../../content/environments/services/current-environment.service';
import { ExtAppViewRegistryService } from '../services/ext-app-view-registry.service';
import {
  IMicroFrontend,
  MicroFrontend
} from '../../shared/datamodel/k8s/microfrontend';

describe('MicrofrontendViewComponent', () => {
  let component: MicrofrontendViewComponent;
  let fixture: ComponentFixture<MicrofrontendViewComponent>;
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

  const frontend: IMicroFrontend = {
    metadata: {
      name: 'testId',
      uid: 'uid'
    },
    status: {
      phase: 'ok'
    },
    data: {
      data1: 'data'
    },
    type: 'type',
    spec: {
      location:
        'https://pl.wikipedia.org/wiki/Wikipedia:Strona_g%C5%82%C3%B3wna'
    },
    isStatusOk() {
      return true;
    },
    getId() {
      return 'testId';
    },
    getUid() {
      return 'testUid';
    },
    getLabel() {
      return 'testLabel';
    },
    getLocation() {
      return 'testId';
    }
  };
  const frontendMinio: IMicroFrontend = {
    metadata: {
      name: 'testId',
      uid: 'uid'
    },
    status: {
      phase: 'ok'
    },
    data: {
      data1: 'data'
    },
    type: 'type',
    spec: {
      location: 'minio'
    },
    isStatusOk() {
      return true;
    },
    getId() {
      return 'testId';
    },
    getUid() {
      return 'testUid';
    },
    getLabel() {
      return 'testLabel';
    },
    getLocation() {
      return 'testId';
    }
  };

  const ActivatedRouteMock = {
    params: Observable.of({ id: 'testId' })
  };

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
      declarations: [MicrofrontendViewComponent],
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
    fixture = TestBed.createComponent(MicrofrontendViewComponent);
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
    spyOn(extensionsService, 'getExtensions').and.returnValue(
      Observable.of([new MicroFrontend(frontend)])
    );

    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(extensionsService.getExtensions).toHaveBeenCalled();
  });

  describe('ngOnInit', () => {
    it('should set the iFrame src attribute to an url', () => {
      spyOn(extensionsService, 'getExtensions').and.returnValue(
        Observable.of([new MicroFrontend(frontend)])
      );

      fixture.detectChanges();
      const iFrame = document.getElementById('externalViewFrame');
      expect(iFrame.getAttribute('src')).toEqual(frontend.spec.location);
      expect(extensionsService.getExtensions).toHaveBeenCalled();
    });

    it('should set the iFrame src attribute to an empty string if location is minio', () => {
      spyOn(extensionsService, 'getExtensions').and.returnValue(
        Observable.of([new MicroFrontend(frontendMinio)])
      );

      fixture.detectChanges();
      const iFrame = document.getElementById('externalViewFrame');
      expect(iFrame.getAttribute('src')).toEqual('');
      expect(extensionsService.getExtensions).toHaveBeenCalled();
    });

    it('should set the iFrame src to an empty string if there are no extensions', () => {
      spyOn(extensionsService, 'getExtensions').and.returnValue(
        Observable.of([])
      );

      fixture.detectChanges();
      const iFrame = document.getElementById('externalViewFrame');
      expect(iFrame.getAttribute('src')).toEqual('');
      expect(extensionsService.getExtensions).toHaveBeenCalled();
    });

    it('should handle an error and set the iFrame src attribute to an empty string', () => {
      spyOn(extensionsService, 'getExtensions').and.callFake(() => {
        return Observable.throw('error');
      });

      fixture.detectChanges();
      const iFrame = document.getElementById('externalViewFrame');
      expect(iFrame.getAttribute('src')).toEqual('');
      expect(extensionsService.getExtensions).toHaveBeenCalled();
    });
  });

  describe('renderExternalView', () => {
    it('should register external view and send a message', () => {
      spyOn(extensionsService, 'getExtensions').and.returnValue(
        Observable.of([new MicroFrontend(frontend)])
      );

      spyOn(extAppViewRegistryService, 'registerView').and.returnValue(
        '10-10-10'
      );
      fixture.detectChanges();
      expect(extensionsService.getExtensions).toHaveBeenCalled();

      expect(extAppViewRegistryService.registerView).toHaveBeenCalled();
    });

    it('should deregister external view', () => {
      spyOn(extensionsService, 'getExtensions').and.returnValue(
        Observable.of([])
      );

      spyOn(extAppViewRegistryService, 'deregisterView');
      fixture.detectChanges();
      expect(extensionsService.getExtensions).toHaveBeenCalled();

      expect(extAppViewRegistryService.deregisterView).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should deregister external view', () => {
      spyOn(extensionsService, 'getExtensions').and.returnValue(
        Observable.of([new MicroFrontend(frontend)])
      );
      spyOn(extAppViewRegistryService, 'deregisterView');
      fixture.detectChanges();
      component.ngOnDestroy();
      expect(extensionsService.getExtensions).toHaveBeenCalled();
      expect(extAppViewRegistryService.deregisterView).toHaveBeenCalled();
    });
  });
});
