import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, AbstractControl, Validators } from '@angular/forms';

export function ValidateUrl(control: AbstractControl) {
    if (!control.value.startsWith('https') || !control.value.includes('.io')) {
        return { validUrl: true };
    }
    return null;
}

export function dateIsEndOfMonth(control: AbstractControl): { [key: string]: any } {
    if (isPresent(Validators.required(control)))
        return null;

    const isISOdate = /\d{4}-\d{2}-\d{2}/.test(control.value);
    if (!isISOdate)
        return { 'dateIsEndOfMonth': true };

    const isValidDate = isDate(control.value);
    if (!isValidDate)
        return { 'dateIsEndOfMonth': true };

    const date = new Date(control.value.replace(/-/g, '\/'));

    return !isEndOfMonth(date) ? { 'dateIsEndOfMonth': true } : null;
}

function isPresent(obj: any): boolean {
    return obj !== undefined && obj !== null;
}

function isDate(obj: any): boolean {
    return !/Invalid|NaN/.test(new Date(obj).toString());
}

function isEndOfMonth(date: Date) {
    const d = new Date(date.getTime());
    d.setDate(d.getDate() + 1);
    return d.getDate() === 1;
}

export function isOddWithEvenAllowed(allowedEvenNumbers: number[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (isPresent(Validators.required(control)))
            return null;

        const val = +control.value;

        if (isNaN(val))
            return { 'isOddWithEvenAllowed': true };

        for (let i = 0; i < allowedEvenNumbers.length; i++) {
            if (allowedEvenNumbers[i] % 2 !== 0)
                throw new Error(allowedEvenNumbers[i] + ' is not even!');
        }

        return allowedEvenNumbers.indexOf(val) !== -1 || val % 2 !== 0 ? null : { 'isOddWithEvenAllowed': true };
    };
}

@Directive({
    selector: 'input[type=text][dateIsEndOfMonth][formControlName],input[type=text][dateIsEndOfMonth][formControl],input[type=text][dateIsEndOfMonth][ngModel]',
    providers: [{ provide: NG_VALIDATORS, useExisting: DateIsEndOfMonthDirective, multi: true }],
})
export class DateIsEndOfMonthDirective implements Validator {
    validate(control: AbstractControl): { [key: string]: any } {
        return dateIsEndOfMonth(control);
    }
}

@Directive({
    selector: 'input[type=text][isOddWithEvenAllowed][formControlName],input[type=text][isOddWithEvenAllowed][formControl],input[type=text][isOddWithEvenAllowed][ngModel]',
    providers: [{ provide: NG_VALIDATORS, useExisting: IsOddWithEvenAllowedDirective, multi: true }],
})
export class IsOddWithEvenAllowedDirective implements Validator {
    @Input() isOddWithEvenAllowed: string;

    validate(control: AbstractControl): { [key: string]: any } {
        return isOddWithEvenAllowed(this.isOddWithEvenAllowed.split(',').map(Number))(control);
    }
}