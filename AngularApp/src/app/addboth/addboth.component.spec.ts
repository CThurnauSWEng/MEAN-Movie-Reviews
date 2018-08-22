import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbothComponent } from './addboth.component';

describe('AddbothComponent', () => {
  let component: AddbothComponent;
  let fixture: ComponentFixture<AddbothComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddbothComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbothComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
