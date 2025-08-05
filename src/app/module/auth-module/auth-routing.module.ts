import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "../../auth/login/login.component";
import { SingupComponent } from "../../auth/singnup/signup.component";

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SingupComponent }
]
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class AuthRoutingModule { }