import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ChartsService } from './core/services/charts.service';
import { Subject, takeUntil } from 'rxjs';
import {  HttpClientModule } from '@angular/common/http';
import { ChartModule } from 'primeng/chart';
import { Chart } from 'chart.js';
import 'chartjs-adapter-moment';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule, DatePipe } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  providers: [
    MessageService, 
  ],
  imports: [RouterOutlet, HttpClientModule, CommonModule, ToastModule, MessagesModule, ButtonModule, ChartModule, TableModule, InputTextModule, DatePipe, FormsModule, ],
  
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'axa-charts';
  public chart: any;
  chartConfig: any;
  basicOptions: any;
  platformId = inject(PLATFORM_ID);
  labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  data: any = {
  labels: this.labels,
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80, 81, 56, 55, 40],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
    }]
  };
  dataRetrieved = false;
  editingRow: any = null;
  public chartLabels: string[] = [];
  public chartData: any = {
    labels: this.chartLabels,
    datasets: [
      {
        label: 'Stock',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        fill: false,
      },
    ],
  };
  config: any = {
    type: 'line',
    data: this.chartData,
  };
  private stop$ = new Subject();
  httpErrorMessage = "Le service est momentanément indisponible";

  constructor(
    private chartService: ChartsService,
    private cd: ChangeDetectorRef,
    private messageService: MessageService
  ){
    
  }

  ngOnInit(): void {
    this.getChartData();
  }


  ngOnDestroy(): void {
    this.stop$.next(null);
    this.stop$.complete();  
  }

  getChartData(): void {
    this.chartService.getRandomData(20)
    .pipe(takeUntil(this.stop$))
    .subscribe({
      next: (data: any) => {
        this.dataRetrieved = true;
        this.chartData = data;
        const labels = this.chartData.map((item: any) => new Date(item.timestamp));
        const stockData = this.chartData.map((item: any) => item.stock);
        console.log(labels, stockData);
        this.createChart(labels, stockData);
        this.cd.detectChanges();
      },
      error: (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.httpErrorMessage});
      }    
    });
  }

  createChart(labels: Date[], stockData: number[]): void {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    if (this.chart) this.chart.destroy();
  
    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Stock',
          data: stockData,
          borderColor: 'rgb(75, 192, 192)',
          fill: false,
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'second',
              tooltipFormat: 'll HH:mm:ss',
              displayFormats: { second: 'HH:mm:ss' },
            },
          },
          y: {
            title: {
              display: true,
              text: 'Stock Value',
            },
          },
        },
      },
    });
  }

  onRowEditSave(entry: any, index: number) {
    this.updateChartFromTable();
  }

  saveRowEdit(event: any) {
    const updatedRow = event.data;
    this.updateChartFromTable();
  }

  updateChartFromTable() {
    const labels = this.chartData.map((item: any) => new Date(item.timestamp));
    const data = this.chartData.map((item: any) => item.stock);
  
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.update();
  }

  startEdit(rowData: any, dt: any) {
    this.editingRow = rowData;
    dt.initRowEdit(rowData);
  }
  
  saveEdit(rowData: any) {
    this.editingRow = null;
    this.updateChartFromTable();
  }
  
  cancelEdit(dt: any) {
    this.editingRow = null;
    dt.cancelRowEdit(this.editingRow);
  }

  onEnterEdit(rowData: any, rowIndex: number) {
    this.chartData[rowIndex].stock = rowData.stock;
    this.updateChartFromTable();
  }
}
