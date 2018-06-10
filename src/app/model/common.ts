
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
};
