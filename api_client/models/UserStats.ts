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

import { exists, mapValues } from '../runtime';
import type { LastGameStateEnum } from './LastGameStateEnum';
import {
    LastGameStateEnumFromJSON,
    LastGameStateEnumFromJSONTyped,
    LastGameStateEnumToJSON,
} from './LastGameStateEnum';

/**
 * 
 * @export
 * @interface UserStats
 */
export interface UserStats {
    /**
     * 
     * @type {number}
     * @memberof UserStats
     */
    score?: number;
    /**
     * 
     * @type {Date}
     * @memberof UserStats
     */
    readonly lastPlayed: Date;
    /**
     * 
     * @type {LastGameStateEnum}
     * @memberof UserStats
     */
    lastGameState?: LastGameStateEnum;
    /**
     * 
     * @type {number}
     * @memberof UserStats
     */
    lastNumberTries?: number;
}

/**
 * Check if a given object implements the UserStats interface.
 */
export function instanceOfUserStats(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "lastPlayed" in value;

    return isInstance;
}

export function UserStatsFromJSON(json: any): UserStats {
    return UserStatsFromJSONTyped(json, false);
}

export function UserStatsFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserStats {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'score': !exists(json, 'score') ? undefined : json['score'],
        'lastPlayed': (new Date(json['last_played'])),
        'lastGameState': !exists(json, 'last_game_state') ? undefined : LastGameStateEnumFromJSON(json['last_game_state']),
        'lastNumberTries': !exists(json, 'last_number_tries') ? undefined : json['last_number_tries'],
    };
}

export function UserStatsToJSON(value?: UserStats | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'score': value.score,
        'last_game_state': LastGameStateEnumToJSON(value.lastGameState),
        'last_number_tries': value.lastNumberTries,
    };
}
