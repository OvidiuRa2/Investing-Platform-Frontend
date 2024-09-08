import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DropDownMenuComponent } from './components/drop-down-menu/drop-down-menu.component';
import { InvestmentSectionComponent } from './components/investment-section/investment-section.component';
import { PromotingSectionComponent } from './components/promoting-section/promoting-section.component';
import { GetStartedComponent } from './components/get-started/get-started.component';
import { QuestionsSectionComponent } from './components/questions-section/questions-section.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { InvestmentOportunitiesComponent } from './components/investment-oportunities/investment-oportunities.component';
import { SafePipe } from './common/safe-pipe';
import { DetailedCampaignComponent } from './components/detailed-campaign/detailed-campaign.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContactComponent } from './components/contact/contact.component';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { InvestComponent } from './components/invest/invest.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { CreateCampaignComponent } from './components/create-campaign/create-campaign.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddInvestmentComponent } from './components/add-investment/add-investment.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component'; // Import FormsModule
import { ErrorInterceptor } from './interceptors/error-interceptor.interceptor';
import { authGuard } from './guards/auth.guard';
import { investGuard } from './guards/invest.guard';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'opportunities', component: InvestmentOportunitiesComponent },
  { path: 'detailedCampaign', component: DetailedCampaignComponent },
  { path: 'campaign', component: CreateCampaignComponent },
  { path: 'help', component: ContactComponent },
  { path: 'invest', component: InvestComponent, canActivate: [authGuard] },
  { path: 'aboutUs', component: AboutUsComponent },
  {
    path: 'add-investment',
    component: AddInvestmentComponent,
    canActivate: [investGuard],
  },
  {
    path: 'portfolio',
    component: PortfolioComponent,
    canActivate: [authGuard],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  declarations: [
    AppComponent,
    DropDownMenuComponent,
    InvestmentSectionComponent,
    PromotingSectionComponent,
    GetStartedComponent,
    QuestionsSectionComponent,
    HomeComponent,
    LoginComponent,
    InvestmentOportunitiesComponent,
    SafePipe,
    DetailedCampaignComponent,
    CreateCampaignComponent,
    ContactComponent,
    InvestComponent,
    AboutUsComponent,
    AddInvestmentComponent,
    ProfileComponent,
    PortfolioComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    FeatherModule.pick(allIcons),
    FormsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
