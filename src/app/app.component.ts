import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";
import { AppService, TVMazeShowInfo } from "./app.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly subscriptions = new Subscription();

    public readonly columns: string[] = ["show-title"];

    public tvShowList: TVMazeShowInfo[] = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private readonly appService: AppService,
    ) {
    }

    public ngOnInit(): void {
    }

    public ngAfterViewInit() {
        this.subscriptions.add(
            this.paginator.page
                .pipe(
                    startWith({}),
                    switchMap(() => this.appService.getTVMazeShowListByPageIndexAsync(this.paginator.pageIndex, 50)), //TODO move to fields
                )
                .subscribe(data => this.tvShowList = data));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
