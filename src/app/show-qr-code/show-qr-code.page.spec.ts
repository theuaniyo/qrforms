import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowQrCodePage } from './show-qr-code.page';

describe('ShowQrCodePage', () => {
  let component: ShowQrCodePage;
  let fixture: ComponentFixture<ShowQrCodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowQrCodePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowQrCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
