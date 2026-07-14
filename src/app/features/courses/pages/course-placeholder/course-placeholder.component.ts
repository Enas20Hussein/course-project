import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-course-placeholder',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <section class="placeholder-page">
      <p class="eyebrow">Courses</p>
      <h1>{{ title }}</h1>
      <p>{{ message }}</p>

      <a mat-stroked-button routerLink="/courses">
        <mat-icon>arrow_back</mat-icon>
        Back to courses
      </a>
    </section>
  `,
  styles: [
    `
      .placeholder-page {
        min-height: 100vh;
        display: grid;
        align-content: center;
        gap: 16px;
        padding: 32px;
        background:
          radial-gradient(circle at top left, rgba(15, 118, 110, 0.14), transparent 30%),
          linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
      }

      .eyebrow {
        margin: 0;
        font-size: 0.85rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #0f766e;
      }

      h1 {
        margin: 0;
        font-size: clamp(2rem, 6vw, 3.5rem);
        color: #0f172a;
      }

      p {
        margin: 0;
        max-width: 640px;
        color: #475569;
        font-size: 1rem;
      }
    `
  ]
})
export class CoursePlaceholderComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly title =
    this.route.snapshot.data['title'] ?? 'Courses';

  protected readonly message =
    this.route.snapshot.data['message'] ?? '';
}
