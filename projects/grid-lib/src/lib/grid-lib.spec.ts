import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridLib } from './grid-lib';

describe('GridLib', () => {
  let component: GridLib;
  let fixture: ComponentFixture<GridLib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridLib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridLib);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
