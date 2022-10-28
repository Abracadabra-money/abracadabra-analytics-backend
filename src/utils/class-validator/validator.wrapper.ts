import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export type ValidateFn = (value: any, args: ValidationArguments) => boolean | Promise<boolean>;
export type ValidatorType = (object: unknown, propertyName: string) => void;

export function wrapValidator(name: string, validate: ValidateFn, validationOptions?: ValidationOptions): ValidatorType {
    return (object: unknown, propertyName: string) => {
        registerDecorator({
            name,
            target: object.constructor,
            propertyName,
            constraints: [propertyName],
            options: validationOptions,
            validator: { validate },
        });
    };
}
