import { Component, OnInit } from '@angular/core';
import { SpectralColor } from './SpectralColor';
import { map} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.css']
})
export class TableDataComponent implements OnInit {

  public train_SpectralColors : SpectralColor[] = [];
  public mesured_SpectralColors : SpectralColor[] = [];
  uid = "eVPkzQu216dVMZCZG38fH7virxh1";

  displayedColumns: string[] = ["Id", "Date", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "NIR_1", "NIR_2", "Ripeness"];
  public url = 'https://indicateur-de-maturite-2d30f-default-rtdb.europe-west1.firebasedatabase.app/'

  constructor(private http : HttpClient) { }

  ngOnInit(){
    this.fetchTrain_SpectralColors();
    this.fetchMesured_SpectralColors();
  }

  // Get Train Data
  private fetchTrain_SpectralColors(){
    this.http.get<{[key : string]:SpectralColor}>(this.url+'DataTrain.json')
    .pipe(map((res)=>{
      const spectralColors = []
      for (const key in res){
        if (res.hasOwnProperty(key)){
          spectralColors.push({...res[key], Id : key})
        }
      }
      return spectralColors;
    }))
    .subscribe((spectralColors) => {
      console.log(spectralColors);
      this.train_SpectralColors = spectralColors;
    })
  }

  // Get Mesured Data
  private fetchMesured_SpectralColors(){
    this.http.get<{[key : string]:SpectralColor}>(this.url+'/UsersData/'+ this.uid +'/DataMesured.json')
    .pipe(map((res)=>{
      const spectralColors = []
      for (const key in res){
        if (res.hasOwnProperty(key)){
          spectralColors.push({...res[key], Id : key})
        }
      }
      return spectralColors;
    }))
    .subscribe((spectralColors) => {
      console.log(spectralColors);
      this.mesured_SpectralColors = spectralColors;
    })
  }
}
