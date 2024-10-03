import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/shared/loading/loading.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  isLoading$: Observable<boolean>;

  constructor(private loaderService: LoadingService) {
    this.isLoading$ = this.loaderService.isLoading$;
  }
}

