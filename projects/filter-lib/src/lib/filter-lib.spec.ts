import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterLib } from './filter-lib';

describe('FilterLib', () => {
  let component: FilterLib;
  let fixture: ComponentFixture<FilterLib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterLib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterLib);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
