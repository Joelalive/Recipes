import { PlaceHolderDirective } from './../shared/placeholder.directive';
import { AlertComponent } from './../shared/alert/alert.component';
import { AuthService, AuthResponseData } from './auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})

export class AuthComponent implements OnInit, OnDestroy {


  isLoginMode = true;

  isLoading = false;

  error: string = null;

  @ViewChild(PlaceHolderDirective, {static: false}) alertRef: PlaceHolderDirective;

  private closeSub: Subscription;

  constructor(private auth: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObs = this.auth.login(email, password);
    } else {
      authObs = this.auth.signUp(email, password);
    }

    authObs.subscribe(
      (response) => {
        console.log(response);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      }
    );

    form.reset();
  }


  private showErrorAlert(message: string) {
    const alrtCompFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertRef.viewContainerRef;
    hostViewContainerRef.clear();
    const compRef = hostViewContainerRef.createComponent(alrtCompFactory);
    compRef.instance.message = message;
    this.closeSub = compRef.instance.closeAlert.subscribe(
      () => {
        this.closeSub.unsubscribe();
        hostViewContainerRef.clear();
      }
    );
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy() {

    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }

  }

}
