import { Injector, Type } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss';
import { of, throwError } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ComponentFactoryResult } from '../jss-component-factory.service';
import { wrapIntoObservable } from '../utils';
import { JssCanActivate } from './placeholder.token';

/**
 * @param value
 */
function isRedirectValue(
  value: boolean | string | string[] | UrlTree
): value is string | string[] | UrlTree {
  return value instanceof UrlTree || typeof value === 'string' || Array.isArray(value);
}

/**
 * @param injector
 * @param activatedRoute
 * @param router
 */
export function guardResolverFactory(
  injector: Injector,
  activatedRoute: ActivatedRoute,
  router: Router
) {
  /**
   * @param guard
   */
  function _getGuardInstance(guard: JssCanActivate | Type<JssCanActivate>) {
    return 'canActivate' in guard ? guard : injector.get(guard);
  }

  /**
   * @param factory
   */
  function _collectGuardInstances(factory: ComponentFactoryResult): JssCanActivate[] {
    // eslint-disable-next-line eqeqeq
    if (factory.canActivate != null) {
      return Array.isArray(factory.canActivate)
        ? factory.canActivate.map(_getGuardInstance)
        : [_getGuardInstance(factory.canActivate)];
    }

    return [];
  }

  /**
   * @param guard
   * @param factory
   */
  function _resolveGuard(guard: JssCanActivate, factory: ComponentFactoryResult) {
    const guardValue = guard.canActivate({
      activatedRoute: activatedRoute.snapshot,
      routerState: router.routerState.snapshot,
      rendering: factory.componentDefinition as ComponentRendering,
    });

    const canActivate$ = wrapIntoObservable(guardValue);

    return canActivate$
      .pipe(
        take(1),
        mergeMap((value) => {
          if (isRedirectValue(value)) {
            return throwError(value);
          } else {
            return of(value);
          }
        })
      )
      .toPromise();
  }

  return function resolveGuards(factories: ComponentFactoryResult[]) {
    const resolved = factories.map((factory) => {
      const guards = _collectGuardInstances(factory);
      const pending = guards.map((guard) => _resolveGuard(guard, factory));
      return Promise.all(pending)
        .then((canActive) => canActive.every((v) => v))
        .then((canActivate) => ({
          factory,
          canActivate,
        }));
    });

    return Promise.all(resolved).then((mapped) =>
      mapped.filter((m) => m.canActivate).map((m) => m.factory)
    );
  };
}
