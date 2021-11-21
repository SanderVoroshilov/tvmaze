import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
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

    public readonly columns: string[] = ['show-image', 'show-title', 'show-genres', 'show-country', 'show-averageRuntime', 'show-rating'];

    public tvShowList: TVMazeShowInfo[] = [];

    @ViewChild(MatPaginator) public paginator: MatPaginator;
    @ViewChild('tvmazeShowTableContainer') public tvmazeShowTableContainer: ElementRef<HTMLElement>;

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
                    switchMap(() => this.appService.getTVMazeShowListByPageIndexAsync(this.paginator.pageIndex, 50)),
                )
                .subscribe(data => {
                    this.tvShowList = data;
                    this.tvmazeShowTableContainer.nativeElement.scrollTo(0, 0);
                }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public formatGenres(g: string[]): string {
        return g?.join(', ');
    }

    public formatAverageRuntime(r: number): string {
        return r != null ? `${r}min` : "";
    }
}
