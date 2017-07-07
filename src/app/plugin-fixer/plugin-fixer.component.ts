
import { Component, OnInit } from '@angular/core';
import { Http } from "@angular/http";
import {PluginTemplateComponent} from '../plugin-template/plugin-template.component'


@Component({
  selector: 'plugin-fixer',
  templateUrl: './plugin-fixer.component.html',
  styleUrls: ['./plugin-fixer.component.css']
})


export class PluginFixerComponent extends PluginTemplateComponent  {

  private base: string = "EUR";
  private symbol: string = "USD";
  private rate : string  = "x.xx";
  private write: string = "Try '/fixer list' or '/fixer ui' ";
  private symbols : string[];
  private isUi : boolean = false;
  private uinput : number = 1;

  constructor(private http: Http)  {
    super();
   }

  process(command: string, value: string, author: string) {
    if (command != "fixer") {
      return;
    }

    this.isUi = false;

    if(value == "list") {
      this.list();

    } else if(value == "ui") {
      this.list();
      this.isUi = true;
    } else if(value) {
      let symbol = value;
      this.symbol = symbol;
      this.latest(symbol);
    }

    this.intercept();
  }

  update() {
      this.latest(this.symbol);
  }

  list() {
     this.http.get("http://api.fixer.io/latest").
       subscribe(response => {
         let json: Fixer = response.json();
         this.symbols = []
         for(let key in json.rates) {
            this.symbols.push(key);
         }
         
         if(! this.isUi) {
            this.write = "List of symbols:"
              for(var i in this.symbols) {
                this.write = this.write +  " " + this.symbols[i];
              }
         } else {
           this.write = "";
         }

       });
   
  }
 
  latest(symbol : string) {
     this.http.get("http://api.fixer.io/latest").
       subscribe(response => {
         let json: Fixer = response.json();
         let date = json.date;
         this.base  = json.base ;
         this.rate = json.rates[symbol];

         let value = +this.rate * this.uinput;

         if(this.isUi) {
this.write = `${value}`;
         } else {
          this.write = `Latest rate (${date}): ${symbol}/${this.base} = ${this.rate}  => ${value}`;
         }

       });
   
  }
}

 class Fixer {
    base : string;
    date : string;
    rates: any;
  } 
