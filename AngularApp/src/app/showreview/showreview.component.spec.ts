import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowreviewComponent } from './showreview.component';

describe('ShowreviewComponent', () => {
  let component: ShowreviewComponent;
  let fixture: ComponentFixture<ShowreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
