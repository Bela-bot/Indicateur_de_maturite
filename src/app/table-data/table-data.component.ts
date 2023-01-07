import { Component, OnInit } from '@angular/core';
import { SpectralColor } from './SpectralColor';


@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.css']
})
export class TableDataComponent implements OnInit {

  Data: SpectralColor[] = [{
    "Id": 1,
    "Date": "06/11",
    "F1": 21,
    "F2": 19,
    "F3": 21,
    "F4": 76,
    "F5": 205,
    "F6": 98,
    "F7": 39,
    "F8": 71,
    "NIR_1": 68,
    "NIR_2": 54,
    "Ripeness": 0
  },
  {
    "Id": 2,
    "Date" : "06/12",
    "F1": 18,
    "F2": 17,
    "F3": 18,
    "F4": 69,
    "F5": 191,
    "F6": 93,
    "F7": 39,
    "F8": 71,
    "NIR_1": 62,
    "NIR_2": 58,
    "Ripeness": 0
  }
  ];

  displayedColumns: string[] = ["Id", "Date", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "NIR_1", "NIR_2", "Ripeness"];

  constructor() { }

  ngOnInit(): void {
  }

}
