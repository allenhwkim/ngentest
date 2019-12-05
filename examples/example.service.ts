import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  Injectable,
  ReflectiveInjector,
  ViewContainerRef
} from '@angular/core';
import { EncryptionService } from '@rogers/oneview-components';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class DynamicComponentService {
  rootViewContainer: ViewContainerRef;

  urlData$ = this.encryptionService.decrypt(
    decodeURIComponent(this.route.snapshot.params['cipherText']), this.keyMap
  );

  constructor(
    @Inject(ComponentFactoryResolver) private factoryResolver,
    private http: HttpClient,
    private route: ActivatedRoute,
    private encryptionService: EncryptionService
  ) { }

  createComponent(component: any, into?: ViewContainerRef): ComponentRef<any> {
    this.rootViewContainer = into || this.rootViewContainer;
    const factory = this.factoryResolver.resolveComponentFactory(component);

    return factory.create(this.rootViewContainer.parentInjector);
  }

  insertComponent(componentRef: ComponentRef<any>): Component {
    const compId = `ngui-dyn-${Math.floor(Math.random() * 10 ** 7) + 10 ** 6}`;
    componentRef.location.nativeElement.setAttribute('id', compId);
    componentRef.instance.id = compId;

    this.rootViewContainer.insert(componentRef.hostView);

    return componentRef.instance;
  }

  emptyFunction() {
    // empty function
  }
}
