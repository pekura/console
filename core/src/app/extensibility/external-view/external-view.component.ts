import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExtensionsService } from '../services/extensions.service';
import { CurrentEnvironmentService } from '../../content/environments/services/current-environment.service';
import { ExtAppViewRegistryService } from '../services/ext-app-view-registry.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { Subscription } from 'rxjs/Subscription';

const contextVarPrefix = 'context.';

@Component({
  selector: 'app-external-view',
  templateUrl: './external-view.component.html',
  styleUrls: ['./external-view.component.scss'],
  host: { class: 'sf-main sf-content-external' }
})
export class ExternalViewComponent implements OnInit, OnDestroy {
  private basePath: string;
  private externalViewState: string;
  public externalViewLocation: string;
  private currentEnvironmentService: CurrentEnvironmentService;
  private currentEnvironmentSubscription: Subscription;
  protected currentEnvironmentId: string;
  private confirmationCheckTimeout: number = null;

  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    protected extensionsService: ExtensionsService,
    currentEnvironmentService: CurrentEnvironmentService,
    private oauthService: OAuthService,
    private extAppViewRegistryService: ExtAppViewRegistryService
  ) {
    this.currentEnvironmentService = currentEnvironmentService;

    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;
      });
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.basePath = data.basePath;

      this.route.params.subscribe(params => {
        this.externalViewState = params['state'];
        this.externalViewLocation = this.basePath + this.externalViewState;
        this.renderExternalView();
      });
    });
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  replaceVars(viewUrl, params, prefix) {
    let processedUrl = viewUrl;
    if (params) {
      Object.entries(params).forEach(entry => {
        processedUrl = processedUrl.replace(
          '{' + prefix + entry[0] + '}',
          encodeURIComponent(entry[1])
        );
      });
    }
    processedUrl = processedUrl.replace(
      new RegExp('\\{' + this.escapeRegExp(prefix) + '[^\\}]+\\}', 'g'),
      ''
    );
    return processedUrl;
  }

  getUrlWithoutHash(url) {
    if (!url) {
      return false;
    }
    const urlWithoutHash = url.split('#')[0];

    // We assume that any URL not starting with
    // http is on the current page's domain
    if (!urlWithoutHash.startsWith('http')) {
      return (
        window.location.origin +
        (urlWithoutHash.startsWith('/') ? '' : '/') +
        urlWithoutHash
      );
    }

    return urlWithoutHash;
  }

  isNotSameDomain(viewUrl, iframe) {
    if (iframe) {
      const previousUrl = this.getUrlWithoutHash(iframe.src);
      const nextUrl = this.getUrlWithoutHash(viewUrl);
      return previousUrl !== nextUrl;
    }
    return true;
  }

  renderExternalView() {
    const element = document.getElementById(
      'externalViewFrame'
    ) as HTMLIFrameElement;

    if (
      !this.extensionsService.isUsingSecureProtocol(this.externalViewLocation)
    ) {
      return;
    }

    if (this.confirmationCheckTimeout !== null) {
      window.clearTimeout(this.confirmationCheckTimeout);
      this.confirmationCheckTimeout = null;
    }

    const context = {
      currentEnvironmentId: this.currentEnvironmentId,
      idToken: this.oauthService.getIdToken()
    };

    const viewUrl = this.replaceVars(
      this.externalViewLocation,
      context,
      contextVarPrefix
    );

    if (viewUrl) {
      if (this.isNotSameDomain(viewUrl, element)) {
        element.src = viewUrl;
        const sessionId = this.extAppViewRegistryService.registerView(
          element.contentWindow
        );
      } else {
        this.extAppViewRegistryService.resetNavigationConfirmation(
          element.contentWindow
        );

        element.contentWindow.postMessage(
          {
            msg: 'luigi.navigate',
            viewUrl,
            context: JSON.stringify({
              ...context,
              parentNavigationContexts: ['environment']
            }),
            nodeParams: JSON.stringify({}),
            internal: JSON.stringify({})
          },
          '*'
        );

        /**
         * check if luigi responded
         * if not, callback again to replace the iframe
         */
        this.confirmationCheckTimeout = window.setTimeout(() => {
          if (
            this.extAppViewRegistryService.isNavigationConfirmed(
              element.contentWindow
            )
          ) {
            this.extAppViewRegistryService.resetNavigationConfirmation(
              element.contentWindow
            );
          } else {
            element.src = '';
            console.info(
              'navigate: luigi-client did not respond, using fallback by replacing iframe'
            );
            this.renderExternalView();
          }
        }, 2000);
      }
    } else {
      element.src = '';
      this.extAppViewRegistryService.deregisterView(element.contentWindow);
    }
  }

  ngOnDestroy() {
    if (this.confirmationCheckTimeout !== null) {
      window.clearTimeout(this.confirmationCheckTimeout);
      this.confirmationCheckTimeout = null;
    }
    const element = document.getElementById(
      'externalViewFrame'
    ) as HTMLIFrameElement;
    if (this.externalViewLocation) {
      this.extAppViewRegistryService.deregisterView(element.contentWindow);
    }

    this.currentEnvironmentSubscription.unsubscribe();
  }
}
