import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css'
})
export class EmptyStateComponent {
  readonly icon = input('inbox');
  readonly title = input('Nothing here yet');
  readonly message = input('There is no data to display right now.');
  readonly minHeight = input('220px');
  readonly compact = input(false);
}
