
/**
 * Interface: SelectableObject<T>
 */
export interface SelectableObject<T> {
  isSelected: T;
}

/**
 * Log level
 */
export enum LogLevel {
  Crash = 0,
  Error = 1,
  Warning = 2,
  Info = 3,
  Debug = 4,
}

/**
 * Application language
 */
export class AppLang {
  Value = '';
  DisplayString = '';
}

/**
 * UI Mode
 */
export enum UIMode {
  Create = 1,
  Change = 2,
  Display = 3,
}

/**
 * Enum for Common Label
 */
export enum UICommonLabelEnum {
  UploadedSuccess       = 0,
  Error                 = 1,
}

// Filter operator
export enum GeneralFilterOperatorEnum {
  Equal = 1,
  NotEqual = 2,
  Between = 3,
  LargerThan = 4,
  LargerEqual = 5,
  LessThan = 6,
  LessEqual = 7,
  Like = 8, // Like
}

/**
 * UI Display string Enum
 */
export type UIDisplayStringEnum = UICommonLabelEnum | GeneralFilterOperatorEnum;

/**
 * Value type for filter
 */
export enum GeneralFilterValueType {
  number = 1,
  string = 2,
  date = 3,
  boolean = 4,
}

/**
 * Filter item
 */
export class GeneralFilterItem {
  fieldName: string;
  operator: GeneralFilterOperatorEnum;
  lowValue: any;
  highValue: any;
  valueType: GeneralFilterValueType;
}

/**
 * UI Display string
 */
export class UIDisplayString {
  public value: UIDisplayStringEnum;
  public i18nterm: string;
  public displaystring: string;
}

/**
 * Utility class for UI display string
 */
export class UIDisplayStringUtil {
  public static getUICommonLabelStrings(): UIDisplayString[] {
    let arrst: UIDisplayString[] = [];

    for (let se in UICommonLabelEnum) {
      if (Number.isNaN(+se)) {
        // Allowed
      } else {
        arrst.push({
          value: +se,
          i18nterm: UIDisplayStringUtil.getUICommonLabelDisplayString(+se),
          displaystring: '',
        });
      }
    }

    return arrst;
  }

  public static getGeneralFilterOperatorDisplayStrings(): UIDisplayString[] {
    let arrst: UIDisplayString[] = [];

    for (let rfe in GeneralFilterOperatorEnum) {
      if (Number.isNaN(+rfe)) {
        // Do nothing
      } else {
        arrst.push({
          value: +rfe,
          i18nterm: UIDisplayStringUtil.getGeneralFilterOperatorDisplayString(<GeneralFilterOperatorEnum>+rfe),
          displaystring: '',
        });
      }
    }

    return arrst;
  }

  public static getUICommonLabelDisplayString(le: UICommonLabelEnum): string {
    switch (le) {
      case UICommonLabelEnum.UploadedSuccess:
        return 'Finance.DocumentPosted';

      case UICommonLabelEnum.Error:
        return 'Common.Error';

      default:
        return '';
    }
  }
  public static getGeneralFilterOperatorDisplayString(opte: GeneralFilterOperatorEnum): string {
    switch (opte) {
      case GeneralFilterOperatorEnum.Between: return 'Sys.Operator.Between';
      case GeneralFilterOperatorEnum.Equal: return 'Sys.Operator.Equal';
      case GeneralFilterOperatorEnum.LargerEqual: return 'Sys.Operator.LargerEqual';
      case GeneralFilterOperatorEnum.LargerThan: return 'Sys.Operator.LargerThan';
      case GeneralFilterOperatorEnum.LessEqual: return 'Sys.Operator.LessEqual';
      case GeneralFilterOperatorEnum.LessThan: return 'Sys.Operator.LessThan';
      case GeneralFilterOperatorEnum.NotEqual: return 'Sys.Operator.NotEqual';
      case GeneralFilterOperatorEnum.Like: return 'Sys.Operator.Like';
      default: return '';
    }
  }
}
