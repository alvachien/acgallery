import { AppLang, UIDisplayString, UIDisplayStringUtil } from './common';

describe('AppLang', () => {
  let tbcObject: AppLang;

  beforeEach(() => {
    tbcObject = new AppLang();
  });

  it('create success', () => {
    expect(tbcObject).toBeTruthy();
  });
});

describe('UIDisplayString', () => {
  let tbcObject: UIDisplayString;

  beforeEach(() => {
    tbcObject = new UIDisplayString();
  });

  it('create success', () => {
    expect(tbcObject).toBeTruthy();
  });
});

describe('UIDisplayStringUtil', () => {
  let tbcObject: UIDisplayStringUtil;

  beforeEach(() => {
    tbcObject = new UIDisplayStringUtil();
  });

  it('create success', () => {
    expect(tbcObject).toBeTruthy();
  });

  it('getUICommonLabelStrings', () => {
    const arrst = UIDisplayStringUtil.getUICommonLabelStrings();
    expect(arrst.length).toBeGreaterThan(0);
  });

  it('getUserOperationAuthDisplayStrings', () => {
    const arrst = UIDisplayStringUtil.getUserOperationAuthDisplayStrings();
    expect(arrst.length).toBeGreaterThan(0);
  });
});
