import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const investGuard: CanActivateFn = (route, state) => {
  const investment: any = JSON.parse(localStorage.getItem('investment')!);
  if (investment != null) {
    return true;
  } else {
    const router = inject(Router);

    router.navigate(['/login']);
    return false;
  }
};
