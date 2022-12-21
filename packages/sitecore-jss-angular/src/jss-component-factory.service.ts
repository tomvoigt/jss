import {
  ComponentFactory,
  createNgModuleRef,
  Inject,
  Injectable,
  Injector,
  Type,
} from '@angular/core';
import { ComponentRendering, HtmlElementRendering } from '@sitecore-jss/sitecore-jss';
import {
  ComponentNameAndModule,
  ComponentNameAndType,
  DYNAMIC_COMPONENT,
  JssCanActivate,
  JssResolve,
  PLACEHOLDER_COMPONENTS,
  PLACEHOLDER_LAZY_COMPONENTS,
} from './components/placeholder.token';
import { RawComponent } from './components/raw.component';
import { isRawRendering } from './components/rendering';
export interface ComponentFactoryResult {
  componentImplementation?: Type<any>;
  componentDefinition: ComponentRendering | HtmlElementRendering;
  componentFactory?: ComponentFactory<any>;
  canActivate?:
    | JssCanActivate
    | Type<JssCanActivate>
    | Array<JssCanActivate | Type<JssCanActivate>>;
  resolve?: { [key: string]: JssResolve<any> | Type<JssResolve<any>> };
}

@Injectable()
export class JssComponentFactoryService {
  private componentMap: Map<string, ComponentNameAndType>;
  private lazyComponentMap: Map<string, ComponentNameAndModule>;

  constructor(
    private injector: Injector,
    @Inject(PLACEHOLDER_COMPONENTS) private components: ComponentNameAndType[],
    @Inject(PLACEHOLDER_LAZY_COMPONENTS) private lazyComponents: ComponentNameAndModule[]
  ) {
    this.componentMap = new Map();
    this.lazyComponentMap = new Map();

    this.components.forEach((c) => this.componentMap.set(c.name, c));

    if (this.lazyComponents) {
      this.lazyComponents.forEach((c) => this.lazyComponentMap.set(c.path, c));
    }
  }

  getComponent(component: ComponentRendering): Promise<ComponentFactoryResult> {
    const loadedComponent = this.componentMap.get(component.componentName);

    if (loadedComponent) {
      return Promise.resolve({
        componentDefinition: component,
        componentImplementation: loadedComponent.type,
        canActivate: loadedComponent.canActivate,
      });
    }

    const lazyComponent = this.lazyComponentMap.get(component.componentName);

    if (lazyComponent) {
      return lazyComponent.loadChildren().then((module) => {
        let componentType = null;
        const moduleRef = createNgModuleRef(module, this.injector);
        const dynamicComponentType = moduleRef.injector.get(DYNAMIC_COMPONENT);
        if (!dynamicComponentType) {
          throw new Error(
            `JssComponentFactoryService: Lazy load module for component "${lazyComponent.path}" missing DYNAMIC_COMPONENT provider. Missing JssModule.forChild()?`
          );
        }

        if (component.componentName in dynamicComponentType) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          componentType = (dynamicComponentType as { [s: string]: any })[component.componentName];
        } else {
          if (typeof dynamicComponentType === 'function') {
            componentType = dynamicComponentType;
          } else {
            throw new Error(
              `JssComponentFactoryService: Lazy load module for component "${lazyComponent.path}" missing DYNAMIC_COMPONENT provider. Missing JssModule.forChild()?`
            );
          }
        }

        return {
          componentDefinition: component,
          componentImplementation: componentType,
          componentFactory: moduleRef.componentFactoryResolver.resolveComponentFactory(
            componentType
          ),
          canActivate: lazyComponent.canActivate,
        };
      });
    }

    return Promise.resolve({
      componentDefinition: component,
    });
  }

  getComponents(
    components: Array<ComponentRendering | HtmlElementRendering>
  ): Promise<ComponentFactoryResult[]> {
    // acquire all components and keep them in order while handling their potential async-ness
    return Promise.all(
      components.map((component) =>
        isRawRendering(component) ? this.getRawComponent(component) : this.getComponent(component)
      )
    );
  }

  private getRawComponent(component: HtmlElementRendering): Promise<ComponentFactoryResult> {
    return Promise.resolve({
      componentImplementation: RawComponent,
      componentDefinition: component,
    });
  }
}
