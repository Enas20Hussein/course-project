import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-course-placeholder',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './course-placeholder.component.html',
  styleUrl: './course-placeholder.component.css'
})
export class CoursePlaceholderComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly title =
    this.route.snapshot.data['title'] ?? 'Courses';

  protected readonly message =
    this.route.snapshot.data['message'] ?? '';
}
