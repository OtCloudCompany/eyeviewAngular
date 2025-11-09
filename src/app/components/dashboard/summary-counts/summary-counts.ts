import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary-counts',
  imports: [],
  templateUrl: './summary-counts.html',
  styleUrl: './summary-counts.css',
})
export class SummaryCounts implements OnInit{
  @Input() summaries: any = {};

  ngOnInit(): void {
    // console.log(this.summaries.countries)
  }

}
