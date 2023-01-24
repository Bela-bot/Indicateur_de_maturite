import { Component, OnInit } from '@angular/core';
import { SpectralColor } from './SpectralColor';
import { map} from 'rxjs';
import { HttpClient } from '@angular/common/http';
//import * as model from '../../assets/model/model.json';
import * as tf from '@tensorflow/tfjs';
import { string } from '@tensorflow/tfjs';


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
  ripeness_class_names = tf.tensor1d(["Early Ripe", "Partially Ripe", "Ripe", "Decay"]).dataSync();
  public url = 'https://indicateur-de-maturite-2d30f-default-rtdb.europe-west1.firebasedatabase.app/'
  public model: any;

  constructor(private http : HttpClient) { }

  async ngOnInit() {
    this.model = await tf.loadLayersModel('../../assets/model/model.json');
    this.fetchTrain_SpectralColors();
    this.fetchMesured_SpectralColors();
  }

  private predict(input) {
    // Loading Model
    // Once model is loaded, let's try using it to make a prediction!
    // Print to developer console for now.
    const prediction = (this.model.predict(input)  as tf.Tensor).dataSync();
    // Get Index
    const index = tf.argMax(prediction).dataSync()[0];
    // return 
    console.log(this.ripeness_class_names[index]);
    const res = this.ripeness_class_names[index].toString();
    return res;
  }

  // Get Train Data
  private fetchTrain_SpectralColors(){
    this.http.get<{[key : string]:SpectralColor}>(this.url+'DataTrain.json')
    .pipe(map((res)=>{
      const spectralColors = []
      for (const key in res){
        if (res.hasOwnProperty(key)) {
          let ripeness = res[key].Ripeness
          res[key].Ripeness = this.ripeness_class_names[ripeness];
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
        if (res.hasOwnProperty(key)) {
          // Convert to tensor2d
          let keys = Object.keys(res[key]);
          let filteredKeys = keys.filter(k => k !== 'Date');
          let values = filteredKeys.map(k => +res[key][k]);
          let tensor = tf.tensor2d([values]);
          // Push To Table (Updated with new Ripeness Column)
          spectralColors.push({
            ...res[key], Id: key, Ripeness: this.predict(tensor)
          });

        }
      }
      return spectralColors;
    }))
    .subscribe((spectralColors) => {
      console.log(spectralColors);
      this.mesured_SpectralColors = spectralColors;
    })
  }

getColorClass(value: any, column: string): string {
  if(column !== "Ripeness") return "";
  if (value == 'Early Ripe') {
    return 'ui yellow label';
  } else if (value == 'Partially Ripe') {
    return 'ui olive label';
  } else if(value == 'Ripe') {
    return 'ui green label';
  } else
    return 'ui red label';
}
}
