import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { first, map } from "rxjs/operators";
import { environment } from "../environments/environment";

export interface TVMazeShowInfoDto {
    name: string;
}

export interface TVMazeShowInfo {
    title: string;
}

@Injectable({ providedIn: "root" })
export class AppService {

    constructor(
        private httpClient: HttpClient,
    ) {
    }

    public getTVMazeShowListByPageIndexAsync(pageIndex: number, pageSize: number): Observable<TVMazeShowInfo[]> {
        return this.httpClient
            .get(`${environment.tvmazeWebApiUrl}${pageIndex}`)
            .pipe(
                map(result => {
                    return (<TVMazeShowInfoDto[]>result)
                        .slice(pageSize * pageIndex, pageSize * (pageIndex + 1))
                        .map(o => <TVMazeShowInfo>{ 
                            title: o.name
                        });
                }),
                first(),
            );
    }
}