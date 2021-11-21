import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { first, map } from "rxjs/operators";
import { environment } from "../environments/environment";

export interface TVMazeShowInfoDto {
    image: {
        medium: string,
        original: string
    };
    name: string;
    genres: string[];
    network: {
        id: number,
        name: string,
        country: {
            name: string,
            code: string,
            timezone: string
        }
    };
    averageRuntime: number;
    rating: { average: number };
}

export interface TVMazeShowInfo {
    image: string;
    title: string;
    genres: string[];
    country: string;
    averageRuntime: number;
    rating: number;
}

@Injectable({ providedIn: "root" })
export class AppService {

    constructor(
        private httpClient: HttpClient,
    ) {
    }

    public getTVMazeShowListByPageIndexAsync(pageIndex: number, pageSize: number): Observable<TVMazeShowInfo[]> {
        return this.httpClient
            .get(`${environment.tvmazeWebApiUrl}${Math.floor(pageIndex / 5)}`)
            .pipe(
                map(result => {
                    return (<TVMazeShowInfoDto[]>result)
                        .slice(pageSize * pageIndex, pageSize * (pageIndex + 1))
                        .map(o => <TVMazeShowInfo>{
                            image: o.image?.medium,
                            title: o.name,
                            genres: o.genres,
                            country: o.network?.country?.name,
                            averageRuntime: o.averageRuntime,
                            rating: o.rating?.average
                        });
                }),
                first(),
            );
    }
}