import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrIdFormPage } from './qr-id-form.page';

describe('QrIdFormPage', () => {
  let component: QrIdFormPage;
  let fixture: ComponentFixture<QrIdFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrIdFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrIdFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
