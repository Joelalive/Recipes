import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable< boolean | UrlTree > {
    return this.authService.user.pipe(
      map(
        (user) => {
          const isAuth = !!user;
          if (isAuth){
            return true;
          }
          return this.router.createUrlTree(['/auth']);
        }
      )
    );
  }

}
