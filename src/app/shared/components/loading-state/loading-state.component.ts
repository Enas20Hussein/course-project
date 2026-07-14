import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-state.component.html',
  styleUrl: './loading-state.component.css'
})
export class LoadingStateComponent {
  readonly message = input('Loading...');
  readonly diameter = input(36);
  readonly minHeight = input('220px');
  readonly inline = input(false);
}
