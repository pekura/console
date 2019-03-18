import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { CurrentEnvironmentService } from 'environments/services/current-environment.service';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { GraphQLClientService } from 'shared/services/graphql-client-service';
import { AbstractGraphqlElementListComponent } from '../abstract-graphql-element-list.component';
import { PodsEntryRendererComponent } from './pods-entry-renderer/pods-entry-renderer.component';
import { PodsHeaderRendererComponent } from './pods-header-renderer/pods-header-renderer.component';

import * as luigiClient from '@kyma-project/luigi-client';

@Component({
  templateUrl: '../kubernetes-element-list.component.html'
})
export class PodsComponent extends AbstractGraphqlElementListComponent
  implements OnDestroy {
  public title = 'Pods';
  public emptyListText =
    'It looks like you don’t have any pods in your namespace yet.';
  public resourceKind = 'Pod';

  public entryRenderer = PodsEntryRendererComponent;
  public headerRenderer = PodsHeaderRendererComponent;

  constructor(
    currentEnvironmentService: CurrentEnvironmentService,
    commService: ComponentCommunicationService,
    graphQLClientService: GraphQLClientService,
    changeDetector: ChangeDetectorRef
  ) {
    super(
      currentEnvironmentService, 
      commService, 
      graphQLClientService, 
      changeDetector
    );
  }

  getGraphglQueryForList() {
    return `query Pod($namespace: String!) {
      pods(namespace: $namespace) {
        name
        nodeName
        restartCount
        creationTimestamp
        labels
        status
        containerStates {
          state
          reason
          message
        }
      }
    }`;
  }

  getEntryEventHandler(): any {
    const handler = super.getEntryEventHandler();
    handler.showLogs = (entry: any) => {
      luigiClient.linkManager().withParams({pod: entry.name, namespace: this.currentEnvironmentId}).navigate('/home/cmf-logs');
    };
    return handler;
  }
}
