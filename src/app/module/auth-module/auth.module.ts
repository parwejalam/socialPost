import { NgModule } from "@angular/core";
import { LoginComponent } from "../../auth/login/login.component";
import { SingupComponent } from "../../auth/singnup/signup.component";
import { LoaderComponent } from "../../loader/loader.component";
import { MaterialModule } from "../material/material.module";
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
    declarations: [
        LoginComponent,
        SingupComponent
    ],

    imports: [
        LoaderComponent,
        MaterialModule,
        AuthRoutingModule
    ]

})

export class AuthModule { }