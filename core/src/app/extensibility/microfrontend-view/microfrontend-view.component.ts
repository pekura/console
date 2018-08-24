import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExtensionsService } from '../services/extensions.service';
import { CurrentEnvironmentService } from '../../content/environments/services/current-environment.service';
import { ExtAppViewRegistryService } from '../services/ext-app-view-registry.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { ExternalViewComponent } from '../external-view/external-view.component';

@Component({
  selector: 'app-external-view',
  templateUrl: './microfrontend-view.component.html',
  styleUrls: ['./microfrontend-view.component.scss'],
  host: { class: 'sf-main sf-content-external' }
})
export class MicrofrontendViewComponent extends ExternalViewComponent
  implements OnInit, OnDestroy {
  private externalViewId: string;

  constructor(
    router: Router,
    route: ActivatedRoute,
    extensionsService: ExtensionsService,
    currentEnvironmentService: CurrentEnvironmentService,
    oauthService: OAuthService,
    extAppViewRegistryService: ExtAppViewRegistryService
  ) {
    super(
      router,
      route,
      extensionsService,
      currentEnvironmentService,
      oauthService,
      extAppViewRegistryService
    );
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.externalViewId = params['id'];
      this.extensionsService
        .getExtensions(this.currentEnvironmentId)
        .map(res =>
          res.filter(ext => {
            return ext.getId() === this.externalViewId;
          })
        )
        .first()
        .catch(error => {
          this.externalViewLocation = '';
          throw error;
        })
        .subscribe(
          ext => {
            this.externalViewLocation = ext[0] ? ext[0].getLocation() : '';
            if (this.externalViewLocation === 'minio') {
              this.externalViewLocation = '';
            }
            this.renderExternalView();
          },
          error => {
            this.renderExternalView();
          }
        );
    });
  }
}
