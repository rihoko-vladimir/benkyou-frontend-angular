import { Component, Input, OnInit } from '@angular/core';
import Answer from '../../../../Models/Answer';

@Component({
  selector: 'result',
  templateUrl: 'result.component.html',
  styleUrls: ['result.component.css']
})
export class ResultComponent implements OnInit {
  @Input() answer!: Answer;
  isCorrect: boolean = false;
  correctKunyomi: string[] = [];
  userKunyomi: string[] = [];
  correctOnyomi: string[] = [];
  userOnyomi: string[] = [];
  matchedOnyomi: string[] = [];
  unmatchedOnyomi: string[] = [];
  incorrectOnyomi: string[] = [];
  matchedKunyomi: string[] = [];
  unmatchedKunyomi: string[] = [];
  incorrectKunyomi: string[] = [];

  ngOnInit(): void {
    this.correctKunyomi = [...this.answer.kanji.kunyomi].sort();
    this.userKunyomi = [...this.answer.selectedKunyomi].sort();
    this.correctOnyomi = [...this.answer.kanji.onyomi].sort();
    this.userOnyomi = [...this.answer.selectedOnyomi].sort();
    this.matchedOnyomi = this.correctOnyomi.filter(x => this.userOnyomi.includes(x));
    this.unmatchedOnyomi = this.correctOnyomi.filter(x => !this.userOnyomi.includes(x));
    this.incorrectOnyomi = this.userOnyomi.filter(x => !this.correctOnyomi.includes(x));
    this.matchedKunyomi = this.correctKunyomi.filter(x => this.userKunyomi.includes(x));
    this.unmatchedKunyomi = this.correctKunyomi.filter(x => !this.userKunyomi.includes(x));
    this.incorrectKunyomi = this.userOnyomi.filter(x => !this.correctOnyomi.includes(x));
    this.isCorrect =
      this.unmatchedKunyomi.length === 0 &&
      this.incorrectKunyomi.length === 0 &&
      this.unmatchedOnyomi.length === 0 &&
      this.incorrectOnyomi.length === 0;
  }
}
