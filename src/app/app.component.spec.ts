import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ChartsService } from './core/services/charts.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { ChartData } from './core/models/charts.model';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let chartsService: ChartsService;
  let messageService: MessageService;
  
  // Mock de données retournées par l'API
  const mockData: ChartData[] = [
    { timestamp: '2021-01-01T00:00:00Z', stock: 100 },
    { timestamp: '2021-01-02T00:00:00Z', stock: 200 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule],
      providers: [ChartsService, MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    chartsService = TestBed.inject(ChartsService);
    messageService = TestBed.inject(MessageService);
    
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getRandomData and create a chart with mock data', () => {
    const spy = jest.spyOn(chartsService, 'getRandomData').mockReturnValue(of(mockData));

    // Appeler getChartData
    component.getChartData();

    expect(spy).toHaveBeenCalledWith(20);
    expect(component.dataRetrieved).toBeTruthy();

    expect(component.chart).toBeDefined();
  });

  it('should handle errors and display a message', () => {
    const errorSpy = jest.spyOn(chartsService, 'getRandomData').mockReturnValue(of([]));  // Simuler une erreur (données vides)
    
    // Appeler getChartData
    component.getChartData();

    // Vérifier que la méthode a bien été appelée
    expect(errorSpy).toHaveBeenCalled();


    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: component.httpErrorMessage
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});