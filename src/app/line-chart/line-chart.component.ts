import {
  Component,
  OnChanges,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ViewEncapsulation
 } from '@angular/core';

import * as D3 from 'd3';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LineChartComponent implements OnChanges, AfterViewInit {

  @ViewChild('container') element: ElementRef;

  private host;
  private svg;
  private margin;
  private width;
  private height;
  private xScale;
  private yScale;
  private xAxis;
  private yAxis;
  private htmlElement: HTMLElement;

  curveArray = [
    {'curve': D3.curveLinear, 'curveTitle': 'curveLinear'},
    {'curve': D3.curveStep, 'curveTitle': 'curveStep'},
    {'curve': D3.curveStepBefore, 'curveTitle': 'curveStepBefore'},
    {'curve': D3.curveStepAfter, 'curveTitle': 'curveStepAfter'},
    {'curve': D3.curveBasis, 'curveTitle': 'curveBasis'},
    {'curve': D3.curveCardinal, 'curveTitle': 'curveCardinal'},
    {'curve': D3.curveMonotoneX, 'curveTitle': 'curveMonotoneX'},
    {'curve': D3.curveCatmullRom, 'curveTitle': 'curveCatmullRom'}
  ];

  selectedCurve = 'curveLinear';

  constructor() { }

  ngAfterViewInit() {
    this.htmlElement = this.element.nativeElement;
    this.host = D3.select(this.htmlElement);
    this.setup();
  }

  ngOnChanges(): void {
    this.setup();
  }

  onCurveChange(curve: string) {
    this.selectedCurve = curve;
    this.setup();
  }

  private setup(): void {
    this.margin = {top: 20, right: 20, bottom: 30, left: 50};
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.xScale = D3.scaleTime().range([0, this.width]);
    this.yScale = D3.scaleLinear().range([this.height, 0]);
    this.buildChart();
  }

  private buildChart() {
    this.xAxis = D3.axisBottom(this.xScale);
    this.yAxis = D3.axisLeft(this.yScale);

    this.host.html('');

    let self = this;

    let line = D3.line()
      .curve(this.curveArray.find((item) => item.curveTitle === this.selectedCurve).curve || D3.curveLinear)
      .x(function(d: any) { return self.xScale(d.date); })
      .y(function(d: any) { return self.yScale(d.close); });

    this.svg = this.host.append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    D3.tsv('assets/testdata.tsv', this.type, function(error, data) {
      if (error) {
        throw error;
      }

      self.xScale.domain(D3.extent(data, function(d: any) { return d.date; }));
      self.yScale.domain(D3.extent(data, function(d: any) { return d.close; }));

      self.svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + self.height + ')')
          .call(self.xAxis);

      self.svg.append('g')
          .attr('class', 'y axis')
          .call(self.yAxis)
          .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')
          .text('Price ($)');

      self.svg.append('path')
          .datum(data)
          .attr('class', 'line')
          .attr('d', line);
    });
  }

  private type(d: any) {
    const formatDate = D3.timeParse('%d-%b-%y');

    d.date = formatDate(d.date);
    d.close = +d.close;

    return d;
  }
}
