import { AppConfig } from './../app.config';
import { CustomExternalAppComponent } from './../extensibility/components/custom-external-app/custom-external-app.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApisComponent } from '../content/environments/configuration/apis/apis.component';

import { AuthGuard } from '../auth/auth-guard.service';
import { LoginComponent } from '../auth/login.component';

import { CatalogContainerComponent } from '../content/environments/catalog-container/catalog-container.component';
import { EnvironmentCreateComponent } from '../content/environments/environment-create/environment-create.component';
import { EnvironmentDetailsComponent } from '../content/environments/environment-details/environment-details.component';
import { EnvironmentsContainerComponent } from '../content/environments/environments-container/environments-container.component';
import { DeploymentsComponent } from '../content/environments/operation/deployments/deployments.component';
import { PodsComponent } from '../content/environments/operation/pods/pods.component';
import { ReplicaSetsComponent } from '../content/environments/operation/replica-sets/replica-sets.component';
import { SecretDetailComponent } from '../content/environments/operation/secrets/secret-detail/secret-detail.component';
import { SecretsComponent } from '../content/environments/operation/secrets/secrets.component';
import { ServiceDetailsComponent } from '../content/environments/operation/services/service-details/service-details.component';
import { ServicesComponent } from '../content/environments/operation/services/services.component';
import { OrganisationComponent } from '../content/settings/organisation/organisation.component';
import { RemoteEnvironmentDetailsComponent } from '../content/settings/remote-environments/remote-environment-details/remote-environment-details.component';
import { RemoteEnvironmentsComponent } from '../content/settings/remote-environments/remote-environments.component';
import { ServiceBrokersComponent } from '../content/settings/service-brokers/service-brokers.component';
import { WorkspaceOverviewComponent } from '../content/workspace-overview/workspace-overview/workspace-overview.component';
import { ExposeApiComponent } from '../content/environments/operation/services/service-details/expose-api/expose-api.component';

import { ExternalViewComponent } from '../extensibility/external-view/external-view.component';

import { LambdasComponent } from '../content/environments/development/lambdas/lambdas.component';
import { PermissionsComponent } from '../shared/components/permissions/permissions.component';
import { RoleDetailsComponent } from '../shared/components/permissions/role-details/role-details.component';
import { InstancesContainerComponent } from '../content/environments/instances-container/instances-container.component';
import { LogoutComponent } from '../content/logout/logout.component';
import { IdpPresetsComponent } from '../content/settings/idp-presets/idp-presets.component';
import { ResourcesComponent } from '../content/environments/configuration/resources/resources.component';
import { LoginErrorComponent } from '../content/login-error/login-error.component';
import { MicrofrontendViewComponent } from '../extensibility/microfrontend-view/microfrontend-view.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'home',
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'environments',
        component: EnvironmentsContainerComponent,
        data: { navCtx: 'env' },
        children: [
          { path: 'yVirtual', component: WorkspaceOverviewComponent },
          { path: 'workspace', component: WorkspaceOverviewComponent },
          { path: '_create_', component: EnvironmentCreateComponent },
          { path: '', redirectTo: 'workspace', pathMatch: 'full' }
        ]
      },
      {
        path: 'environments/:environmentId',
        component: EnvironmentsContainerComponent,
        data: { navCtx: 'env' },
        children: [
          { path: 'yVirtual', component: EnvironmentDetailsComponent },
          { path: 'details', component: EnvironmentDetailsComponent },
          { path: 'workspace', component: WorkspaceOverviewComponent },
          {
            path: 'instances',
            component: ExternalViewComponent,
            data: {
              basePath: 'http://localhost:8001',
            },
          },
          {
            path: 'instances/details/:state',
            component: ExternalViewComponent,
            data: {
              basePath: 'http://localhost:8001/details',
            },
          },
          { path: 'lambdas', component: LambdasComponent },
          { path: 'lambdas/create', component: LambdasComponent },
          { path: 'lambdas/details/:name', component: LambdasComponent },
          { path: 'deployments', component: DeploymentsComponent },
          { path: 'replicaSets', component: ReplicaSetsComponent },
          { path: 'pods', component: PodsComponent },
          { path: 'services', component: ServicesComponent },
          { path: 'services/:name', component: ServiceDetailsComponent },
          {
            path: 'services/:name/apis/details/:apiName',
            component: ExposeApiComponent
          },
          { path: 'services/:name/apis/create', component: ExposeApiComponent },
          { path: 'apis', component: ApisComponent },
          { path: 'apis/details/:apiName', component: ExposeApiComponent },
          { path: 'apis/create', component: ExposeApiComponent },
          { path: 'secrets', component: SecretsComponent },
          { path: 'secrets/:name', component: SecretDetailComponent },
          { path: 'extensions/:id', component: MicrofrontendViewComponent },
          { path: 'resources', component: ResourcesComponent },
          {
            path: 'permissions',
            component: PermissionsComponent,
            data: { global: false }
          },
          {
            path: 'permissions/roles/:name',
            component: RoleDetailsComponent,
            data: { global: false }
          },
          {
            path: 'permissions/clusterRoles/:name',
            component: RoleDetailsComponent,
            data: { global: true }
          },
          {
            path: 'service-catalog',
            component: ExternalViewComponent,
            data: {
              basePath: 'http://localhost:8000',
              leftNavCollapsed: true,
              executionAsync: false,
            },
          },
          {
            path: 'service-catalog/details/:state',
            component: ExternalViewComponent,
            data: {
              basePath: 'http://localhost:8000/details',
              leftNavCollapsed: true,
              executionAsync: false,
            },
          },
          { path: '', redirectTo: 'details', pathMatch: 'full' },
          { path: '**', redirectTo: 'details', pathMatch: 'full' }
        ]
      },
      {
        path: 'docs',
        redirectTo: 'docs/root/kyma',
        pathMatch: 'full',
      },
      {
        path: 'docs/:type/:id',
        component: ExternalViewComponent,
        data: {
          basePath: 'http://localhost:8002',
          leftNavCollapsed: true,
          executionAsync: false,
          mountingPath: '/home/',
        },
      },
      {
        path: 'settings',
        component: EnvironmentsContainerComponent,
        data: { navCtx: 'settings' },
        children: [
          { path: 'yVirtual', component: OrganisationComponent },
          { path: 'organisation', component: OrganisationComponent },
          { path: 'remoteEnvs', component: RemoteEnvironmentsComponent },
          {
            path: 'remoteEnvs/:id',
            component: RemoteEnvironmentDetailsComponent
          },
          { path: 'idpPresets', component: IdpPresetsComponent },
          { path: 'serviceBrokers', component: ServiceBrokersComponent },
          {
            path: 'globalPermissions',
            component: PermissionsComponent,
            data: { global: true }
          },
          {
            path: 'globalPermissions/roles/:name',
            component: RoleDetailsComponent,
            data: { global: true }
          },
          { path: '', redirectTo: 'organisation', pathMatch: 'full' },
          { path: '**', redirectTo: 'organisation', pathMatch: 'full' }
        ]
      },
      { path: '', pathMatch: 'full', redirectTo: 'environments/workspace' },
      { path: '**', pathMatch: 'full', redirectTo: 'environments/workspace' }
    ]
  },
  {
    path: 'loginError',
    component: LoginErrorComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      enableTracing: false,
      initialNavigation: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
