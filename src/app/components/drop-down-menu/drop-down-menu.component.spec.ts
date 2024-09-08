import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDownMenuComponent } from './drop-down-menu.component';

describe('DropDownMenuComponent', () => {
  let component: DropDownMenuComponent;
  let fixture: ComponentFixture<DropDownMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DropDownMenuComponent]
    });
    fixture = TestBed.createComponent(DropDownMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
