// import {
//   registerDecorator,
//   type ValidationArguments,
//   type ValidationOptions,
// } from 'class-validator';

// export function StartsWith(
//   prefix: string,
//   valodationOptions?: ValidationOptions,
// ) {
//   return (object: object, propertyName: string) => {
//     registerDecorator({
//       name: 'starstWith',
//       target: object.constructor,
//       propertyName,
//       options: valodationOptions,
//       validator: {
//         validate(value: any, args: ValidationArguments) {
//           return typeof value === 'string' && value.startsWith(prefix);
//         },
//         defaultMessage(args: ValidationArguments) {
//           return `Название должно начинаться с "${prefix}"`;
//         },
//       },
//     });
//   };
// }
