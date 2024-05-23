import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/dialog';

// Interfaces
import { ServiceResponse, FeaturesByQuote } from '../../interfaces/quote-history.interface';

@Component({
  selector: 'app-features-quote',
  templateUrl: './features-quote.component.html'
})

export class FeaturesQuoteComponent implements OnInit {

  // References
  public features: ServiceResponse[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: FeaturesByQuote) { }

  ngOnInit(): void {
    // Set features
    this.features = this.data.Service_responses;
  }

}
