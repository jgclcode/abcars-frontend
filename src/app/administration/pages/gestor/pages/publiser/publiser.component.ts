import { Component } from '@angular/core';

@Component({
  selector: 'app-publiser',
  templateUrl: './publiser.component.html',
  styleUrls: ['./publiser.component.css']
})
export class PubliserComponent {

  pages:any = [
    {
      title: 'Mercado Libre',
      icon: 'fi fi-rr-id-badge',
      src: './../../../../../../assets/images/publishers/mercadolibre.png'      
    },
    {
      title: 'Facebook',
      icon: 'fi fi-brands-facebook',
      src: './../../../../../../assets/images/publishers/facebook.png'     
    }    
  ]

}
