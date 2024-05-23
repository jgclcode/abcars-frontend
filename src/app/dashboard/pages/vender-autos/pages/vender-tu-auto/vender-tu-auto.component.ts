import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-vender-tu-auto',
  templateUrl: './vender-tu-auto.component.html',
  styles: [`
    .info-text {
      font-weight: 700;
      font-size: 24px;
    }

    .benefits-text {
      font-weight: 500;
      font-size:22px;
    }

    .info-text span {
      color:var(--abcars-color);
    }

    .image_box {            
      width: 100%;
      padding: 1rem;      
      position:relative; 
      height: 400px;          
      backface-visibility: hidden;      
    }

    .principal_image_car {
      position: absolute;
      top: 70%;
      left: 35%;
      transform: translate(-50%, -50%);
      width: 125%;
      z-index:1;   
                  
      animation: moveInBottom 2s ease-out .75;
      animation-fill-mode: backwards;
    }

    .image_car {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 70%;
      z-index:1;   
                  
      animation: moveInBottom 2s ease-out .75;
      animation-fill-mode: backwards;
    }

    .aaa {
      line-height: 1.2;
    }

    @keyframes moveInBottom {      
      0% {
        opacity: 0;
        transform: translate(-50%, -45%);
      }
      100% {
        opacity: 1;
        transform: translate(-50%, -50%);
      } 
    }

    @media only screen and (max-width: 1200px) and (min-width: 992px)  {      
      .principal_image_car {        
        top: 60%;
        left: 40%;        
        width: 125%;                                    
      }
    }

    @media only screen and (max-width: 991px)  {
      .image_box { height:300px; }
      .principal_image_car {        
        top: 50%;
        left: 50%;        
        width: 100%;                                    
      }
    }
    @media only screen and (max-width: 750px)  {
      .image_box { height:200px; }
    }
    @media only screen and (max-width: 450px)  {
      .image_box { height:100px; }
    }
  `]
})

export class VenderTuAutoComponent {

  constructor(private titleService: Title, private metaService: Meta) { 
    // Set Title View
    this.titleService.setTitle('Quiero vender mi auto');
    this.metaService.updateTag({ name: 'description', content: 'Nosotros te damos más por tu auto, cotizalo ¡Ahora!' });
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

}