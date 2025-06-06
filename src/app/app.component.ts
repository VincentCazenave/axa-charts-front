import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID, OnDestroy, AfterViewInit } from '@angular/core';
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
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-root',
  providers: [
    MessageService, 
  ],
  imports: [RouterOutlet, HttpClientModule, CommonModule, CardModule,ToastModule, MessagesModule, ButtonModule, ChartModule, TableModule, InputTextModule, DatePipe, FormsModule, ],
  
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit{
  title = 'axa-charts';
  public chart: any;
  platformId = inject(PLATFORM_ID);
  labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
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
  }

  ngAfterViewInit(): void {
    this.getChartData();
  }

  ngOnDestroy(): void {
    this.stop$.next(null);
    this.stop$.complete();  
  }

  // Get the data to create the chart
  getChartData(): void {
    this.chartService.getRandomData(20)
    .pipe(takeUntil(this.stop$))
    .subscribe({
      next: (data: any) => {
        this.dataRetrieved = true;
        this.chartData = data;
        const labels = this.chartData.map((item: any) => new Date(item.timestamp));
        const stockData = this.chartData.map((item: any) => item.stock);
        this.createChart(labels, stockData);
        this.cd.detectChanges();
      },
      error: (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.httpErrorMessage});
      }    
    });
  }

  // Function to create the chart from the data and the canva
  createChart(labels: Date[], stockData: number[]): void {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    console.log(canvas, "mon canva")
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
          borderWidth: 2, 
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          pointBackgroundColor: 'rgb(75, 192, 192)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(75, 192, 192)'
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
            grid: {
              display: false,
            }
          },
          y: {
            title: {
              display: true,
              text: 'Stock Value',
            },
            grid: {
              display: false,
            }
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

  // Update edit from the data that has been updated
  updateChartFromTable() {
    const labels = this.chartData.map((item: any) => new Date(item.timestamp));
    const data = this.chartData.map((item: any) => item.stock);
  
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.update();
  }

  // Start the edit
  startEdit(rowData: any, dt: any) {
    this.editingRow = rowData;
    dt.initRowEdit(rowData);
  }
  
  // Save the edit
  saveEdit(rowData: any) {
    this.editingRow = null;
    this.updateChartFromTable();
  }
  
  // Cancel the pending edit
  cancelEdit(dt: any) {
    this.editingRow = null;
    dt.cancelRowEdit(this.editingRow);
  }

  // Allow to edit with the enter button
  onEnterEdit(rowData: any, rowIndex: number) {
    this.chartData[rowIndex].stock = rowData.stock;
    this.updateChartFromTable();
  }
}
