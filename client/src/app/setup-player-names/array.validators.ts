import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from "@angular/forms";

function isNil(value: any): value is (null | undefined) {
  return value === null || typeof (value) === 'undefined';
};

function isObject(value: any): boolean {
  return value && value.constructor === Object;
};

function isBlank(value: any): boolean {
  return isNil(value) ||
    (isObject(value) && Object.keys(value).length === 0) ||
    value.toString().trim() === '';
};

export const uniqueErrorName = 'unique';

function addUniquenessError(control: AbstractControl, otherIndex: number): void {
  let errors: ValidationErrors = control.errors ?? {};
  let conflicts: number[] | undefined = errors[uniqueErrorName]?.conflicts;
  if (!conflicts) {
    conflicts = [otherIndex];
    errors[uniqueErrorName] = { conflicts };
  }
  else if (!conflicts.includes(otherIndex)) {
    conflicts.push(otherIndex);
  }
  control.setErrors(errors);
}

function setUniquenessErrors(control: AbstractControl, conflictingIndeces: number[]): void {
  let errors: ValidationErrors = control.errors ?? {};
  errors[uniqueErrorName] = {
    conflicts: conflictingIndeces
  };
  control.setErrors(errors);
}

function clearUniquenessError(control: AbstractControl): void {
  if (control.errors) {
    delete control.errors[uniqueErrorName];
    if (isBlank(control.errors)) {
      control.setErrors(null);
    }
  }
}

export class ArrayValidators {
  public static unique: ValidatorFn = formArray => {
    if (!(formArray instanceof FormArray)) {
      throw new Error('Control is not a FormArray');
    }
    const controls = formArray.controls;

    const occurrences = controls.reduce<ValidationErrors>((acc, current, i) => {
      if (!current.value) {
        return acc;
      }
      if (!acc[current.value]) {
        acc[current.value] = [];
      }
      acc[current.value].push(i);
      return acc;
    }, {});

    const controlsWithErrors: number[] = [];
    for (const value in occurrences) {
      const conflicts = occurrences[value];
      if (conflicts.length > 1) {
        for (let i = 0; i < conflicts.length; ++i) {
          const conflictsWithoutI = conflicts.slice();
          conflictsWithoutI.splice(i, 1);
          setUniquenessErrors(controls[conflicts[i]], conflictsWithoutI);
          controlsWithErrors.push(conflicts[i]);
        }
      }
      else {
        delete occurrences[value];
      }
    }

    for (let i = 0; i < controls.length; ++i) {
      if (!controlsWithErrors.includes(i)) {
        clearUniquenessError(controls[i]);
      }
    }

    if (isBlank(occurrences)) {
      return null;
    }
    return {
      [uniqueErrorName]: occurrences
    }
  }
}