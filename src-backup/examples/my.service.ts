import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  Injectable,
  ReflectiveInjector,
  ViewContainerRef
} from '@angular/core';

@Injectable()
export class DynamicComponentService {
  rootViewContainer: ViewContainerRef;

  constructor(private @Inject(ComponentFactoryResolver) factoryResolver) {
    // empty constructor
  }

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
