import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoaderComponent } from './common/component/loader/loader.component';
import { MatBadgeModule} from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PopupService } from './common/services/popup/popup.service';
import { AuthService } from './common/services/auth/auth.service';
import { WebsocketService } from './common/services/websocket/websocket.service';

@Component({
  selector: 'app-root',
  imports: [ CommonModule, RouterLink, LoaderComponent, RouterOutlet, RouterLinkActive, MatTooltipModule, MatBadgeModule, MatIconModule, TranslatePipe ],
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

  constructor(
    private router: Router, private location: Location, private popupService: PopupService,
    private translate: TranslateService, private webSocketService: WebsocketService,
    private authService: AuthService
  ) {
    this.currentRoute = "";
    this.currentRoute = this.location.path();
  }

  ngOnInit(): void {
     this.webSocketService.onMessage().subscribe((msg: string) => {
      this.notifications.unshift(msg); // Add new message on top
    });
    this.authService.authenticatedUser$.subscribe({
      next: (resp) => {
        this.loginUserDetails = resp;
      }
    })
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
