import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-questions-section',
  templateUrl: './questions-section.component.html',
  styleUrls: ['./questions-section.component.css'],
})
export class QuestionsSectionComponent {
  constructor(private elRef: ElementRef) {}

  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
