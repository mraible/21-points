import { Component, OnInit } from '@angular/core';
import { Principal } from 'app/core';

@Component({
    selector: 'jhi-about',
    templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
    currentAccount: any;

    constructor(private principal: Principal) {}

    ngOnInit() {
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
    }
}
