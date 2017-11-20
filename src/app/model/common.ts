
export interface SelectableObject<T> {    
    isSelected: T;
}

export enum LogLevel {
    Crash = 0,
    Error = 1,
    Warning = 2,
    Info = 3,
    Debug = 4
}

export class AppLang {
    Value: string = "";
    DisplayString: string = "";
}

export enum UIMode {
    Create = 1,
    Change = 2,
    Display = 3
};
