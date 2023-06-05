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


import * as runtime from '../runtime';
import type {
  Country,
  CountryExists,
  GameSate,
  PaginatedCountryList,
  PatchedCountry,
} from '../models';
import {
    CountryFromJSON,
    CountryToJSON,
    CountryExistsFromJSON,
    CountryExistsToJSON,
    GameSateFromJSON,
    GameSateToJSON,
    PaginatedCountryListFromJSON,
    PaginatedCountryListToJSON,
    PatchedCountryFromJSON,
    PatchedCountryToJSON,
} from '../models';

export interface GameCountryCheckCreateRequest {
    countryExists: CountryExists;
}

export interface GameCountryCreateRequest {
    country: Country;
}

export interface GameCountryDestroyRequest {
    slug: string;
}

export interface GameCountryListRequest {
    name?: string;
    ordering?: string;
    page?: number;
    pageSize?: number;
    region?: GameCountryListRegionEnum;
}

export interface GameCountryPartialUpdateRequest {
    slug: string;
    patchedCountry?: PatchedCountry;
}

export interface GameCountryRetrieveRequest {
    slug: string;
}

export interface GameCountryUpdateRequest {
    slug: string;
    country: Country;
}

export interface GameStateCreateRequest {
    gameSate: GameSate;
}

/**
 * 
 */
export class GameApi extends runtime.BaseAPI {

    /**
     */
    async gameCountryCheckCreateRaw(requestParameters: GameCountryCheckCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CountryExists>> {
        if (requestParameters.countryExists === null || requestParameters.countryExists === undefined) {
            throw new runtime.RequiredError('countryExists','Required parameter requestParameters.countryExists was null or undefined when calling gameCountryCheckCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // tokenAuth authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("jwtAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/game/country/check/`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CountryExistsToJSON(requestParameters.countryExists),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CountryExistsFromJSON(jsonValue));
    }

    /**
     */
    async gameCountryCheckCreate(requestParameters: GameCountryCheckCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CountryExists> {
        const response = await this.gameCountryCheckCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async gameCountryCreateRaw(requestParameters: GameCountryCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Country>> {
        if (requestParameters.country === null || requestParameters.country === undefined) {
            throw new runtime.RequiredError('country','Required parameter requestParameters.country was null or undefined when calling gameCountryCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // tokenAuth authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("jwtAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/game/country/`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CountryToJSON(requestParameters.country),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CountryFromJSON(jsonValue));
    }

    /**
     */
    async gameCountryCreate(requestParameters: GameCountryCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Country> {
        const response = await this.gameCountryCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async gameCountryDestroyRaw(requestParameters: GameCountryDestroyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.slug === null || requestParameters.slug === undefined) {
            throw new runtime.RequiredError('slug','Required parameter requestParameters.slug was null or undefined when calling gameCountryDestroy.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // tokenAuth authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("jwtAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/game/country/{slug}/`.replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters.slug))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async gameCountryDestroy(requestParameters: GameCountryDestroyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.gameCountryDestroyRaw(requestParameters, initOverrides);
    }

    /**
     */
    async gameCountryListRaw(requestParameters: GameCountryListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PaginatedCountryList>> {
        const queryParameters: any = {};

        if (requestParameters.name !== undefined) {
            queryParameters['name'] = requestParameters.name;
        }

        if (requestParameters.ordering !== undefined) {
            queryParameters['ordering'] = requestParameters.ordering;
        }

        if (requestParameters.page !== undefined) {
            queryParameters['page'] = requestParameters.page;
        }

        if (requestParameters.pageSize !== undefined) {
            queryParameters['page_size'] = requestParameters.pageSize;
        }

        if (requestParameters.region !== undefined) {
            queryParameters['region'] = requestParameters.region;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // tokenAuth authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("jwtAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/game/country/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PaginatedCountryListFromJSON(jsonValue));
    }

    /**
     */
    async gameCountryList(requestParameters: GameCountryListRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PaginatedCountryList> {
        const response = await this.gameCountryListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async gameCountryPartialUpdateRaw(requestParameters: GameCountryPartialUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Country>> {
        if (requestParameters.slug === null || requestParameters.slug === undefined) {
            throw new runtime.RequiredError('slug','Required parameter requestParameters.slug was null or undefined when calling gameCountryPartialUpdate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // tokenAuth authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("jwtAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/game/country/{slug}/`.replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters.slug))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: PatchedCountryToJSON(requestParameters.patchedCountry),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CountryFromJSON(jsonValue));
    }

    /**
     */
    async gameCountryPartialUpdate(requestParameters: GameCountryPartialUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Country> {
        const response = await this.gameCountryPartialUpdateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async gameCountryRetrieveRaw(requestParameters: GameCountryRetrieveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Country>> {
        if (requestParameters.slug === null || requestParameters.slug === undefined) {
            throw new runtime.RequiredError('slug','Required parameter requestParameters.slug was null or undefined when calling gameCountryRetrieve.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // tokenAuth authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("jwtAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/game/country/{slug}/`.replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters.slug))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CountryFromJSON(jsonValue));
    }

    /**
     */
    async gameCountryRetrieve(requestParameters: GameCountryRetrieveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Country> {
        const response = await this.gameCountryRetrieveRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async gameCountryTodayRetrieveRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Country>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // tokenAuth authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("jwtAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/game/country/today/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CountryFromJSON(jsonValue));
    }

    /**
     */
    async gameCountryTodayRetrieve(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Country> {
        const response = await this.gameCountryTodayRetrieveRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async gameCountryUpdateRaw(requestParameters: GameCountryUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Country>> {
        if (requestParameters.slug === null || requestParameters.slug === undefined) {
            throw new runtime.RequiredError('slug','Required parameter requestParameters.slug was null or undefined when calling gameCountryUpdate.');
        }

        if (requestParameters.country === null || requestParameters.country === undefined) {
            throw new runtime.RequiredError('country','Required parameter requestParameters.country was null or undefined when calling gameCountryUpdate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // tokenAuth authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("jwtAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/game/country/{slug}/`.replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters.slug))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: CountryToJSON(requestParameters.country),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CountryFromJSON(jsonValue));
    }

    /**
     */
    async gameCountryUpdate(requestParameters: GameCountryUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Country> {
        const response = await this.gameCountryUpdateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async gameStateCreateRaw(requestParameters: GameStateCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GameSate>> {
        if (requestParameters.gameSate === null || requestParameters.gameSate === undefined) {
            throw new runtime.RequiredError('gameSate','Required parameter requestParameters.gameSate was null or undefined when calling gameStateCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // tokenAuth authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("jwtAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/game/state/`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: GameSateToJSON(requestParameters.gameSate),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GameSateFromJSON(jsonValue));
    }

    /**
     */
    async gameStateCreate(requestParameters: GameStateCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GameSate> {
        const response = await this.gameStateCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async gameStateRetrieveRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GameSate>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // tokenAuth authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("jwtAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/game/state/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GameSateFromJSON(jsonValue));
    }

    /**
     */
    async gameStateRetrieve(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GameSate> {
        const response = await this.gameStateRetrieveRaw(initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const GameCountryListRegionEnum = {
    Af: 'AF',
    Am: 'AM',
    Aq: 'AQ',
    As: 'AS',
    Eu: 'EU',
    Oc: 'OC'
} as const;
export type GameCountryListRegionEnum = typeof GameCountryListRegionEnum[keyof typeof GameCountryListRegionEnum];
