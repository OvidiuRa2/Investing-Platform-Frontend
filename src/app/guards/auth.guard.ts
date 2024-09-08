import { CanActivateFn, Router } from '@angular/router';
import { User } from '../common/user';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const loggedInUser: User = JSON.parse(localStorage.getItem('userdetails')!);
  if (loggedInUser != null && loggedInUser.authStatus === 'AUTH') {
    return true;
  } else {
    const router = inject(Router);

    router.navigate(['/login']);
    return false;
  }
};
