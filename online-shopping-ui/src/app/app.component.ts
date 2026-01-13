import { CommonModule, Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoaderComponent } from './common/component/loader/loader.component';
import { MatBadgeModule} from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PopupService } from './common/services/popup/popup.service';
import { AuthService } from './common/services/auth/auth.service';
import { WebsocketService } from './common/services/websocket/websocket.service';
import { HasRolesDirective } from 'keycloak-angular';
import { HomeService } from './home/service/home.service';
import Keycloak from 'keycloak-js';
import { UserService } from './my-account/service/user.service';

@Component({
  selector: 'app-root',
  imports: [ CommonModule, HasRolesDirective, RouterLink, LoaderComponent, RouterOutlet, RouterLinkActive, MatTooltipModule, MatBadgeModule, MatIconModule, TranslatePipe ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AngularApp';
  routeName: string = "home";
  currentRoute: string = "";
  isLoggedUserIn: boolean = false;
  loginUserDetails: any= {};
  notifications: string[] = [];
  dropdownOpen = false;
  route: ActivatedRouteSnapshot | null = null;
  private readonly keycloak = inject(Keycloak);

  constructor(
    private router: Router, private location: Location, private popupService: PopupService,
    private translate: TranslateService, private webSocketService: WebsocketService,
    private authService: AuthService, private homeService: HomeService, private userService: UserService
  ) {
    this.currentRoute = "";
    this.currentRoute = this.location.path();
  }

  async ngOnInit(): Promise<void> {

    //  this.webSocketService.onMessage().subscribe((msg: string) => {
    //   this.notifications.unshift(msg); // Add new message on top
    // });
    // this.authService.authenticatedUser$.subscribe({
    //   next: (resp) => {
    //     this.loginUserDetails = resp;
    //   }
    // })

    if (this.keycloak?.authenticated) {
      this.userService.setProfile(await this.keycloak.loadUserProfile());
      this.homeService.getProFile()
      .subscribe({
        next: (data) => {
          this.userService.setProfile(data);
            console.log(data)
          }
      });
    }

  }

  ngDoCheck() {
    // this.loginUserDetails = this.commonService.loggedInUser;
  }

  navigatePage(e: any, routeName: any) {
    this.currentRoute = '/' + routeName;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  openAccountPopup(): void {
    const data = {
    }
    this.popupService.openDialog(data, '40rem', 'account-dialog-container');
  }

  logoutUser(): void {
    const data = {
      isLogoutDialog: true
    }
    this.popupService.openDialog(data, '30rem', 'custom-dialog-container', () => {
      // this.commonService.isLoggedIn = false;
      // this.commonService.loggedInUser = {};
      // this.router.navigate(['/login']);
      this.authService.logout();
    });
  }

  removeNotification(index: number): void {
    this.notifications.splice(index, 1);
  }
}
