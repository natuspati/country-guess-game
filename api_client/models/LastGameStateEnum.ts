/* tslint:disable */
/* eslint-disable */
/**
 * Country Guess API
 * Description placeholder2
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


/**
 * * `success` - succes
 * * `fail` - fail
 * * `wait` - wait
 * @export
 */
export const LastGameStateEnum = {
    Success: 'success',
    Fail: 'fail',
    Wait: 'wait'
} as const;
export type LastGameStateEnum = typeof LastGameStateEnum[keyof typeof LastGameStateEnum];


export function LastGameStateEnumFromJSON(json: any): LastGameStateEnum {
    return LastGameStateEnumFromJSONTyped(json, false);
}

export function LastGameStateEnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): LastGameStateEnum {
    return json as LastGameStateEnum;
}

export function LastGameStateEnumToJSON(value?: LastGameStateEnum | null): any {
    return value as any;
}

