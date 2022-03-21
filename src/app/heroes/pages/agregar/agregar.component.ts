import { Component, OnInit } from '@angular/core';
import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
    img {
      width: 100%;
      border-radius: 7px;
    }
    button {
      margin: 10px;
    }
  `
  ]
})
export class AgregarComponent implements OnInit {

  editoriales = [
    {
      id: 'DC COMICS',
      desc: 'DC- COMICS'
    },
    {
      id: 'MARVEL COMICS',
      desc: 'MARVEL - COMICS'
    }
  ]

  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: ''
  }

  constructor(private heroesService: HeroesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    if (!this.router.url.includes('editar')) {
      return
    }

    this.activatedRoute.params
      .pipe(
        switchMap(({id}) => this.heroesService.getHeroePorId(id))
      )
      .subscribe(heroe => {
        this.heroe = heroe
      })
  }

  guardar(){
    if (this.heroe.superhero.trim().length ===  0) {
      return
    }
    if (this.heroe.id) {
      // Actualizar
      this.heroesService.actualizarHeroe(this.heroe)
        .subscribe(heroe => this.mostrarSnackBar('Registro actualizado'))
    }else{
      //Crear
      this.heroesService.agregarHeroe(this.heroe)
        .subscribe(heroe=> {
          this.router.navigate(['/heroes/editar',heroe.id]);
          this.mostrarSnackBar('Registro creado')
      })
    }

  }

  borrarHeroe(){

    const dialog = this.dialog.open(ConfirmarComponent,{
      width: '250px',
      data: this.heroe
    });

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.heroesService.borrarHeroe(this.heroe.id!)
            .subscribe(resp => {
              this.router.navigate(['/heroes']);
            })
        }
      }
    )
  }

  mostrarSnackBar( mensaje: string):void {
    this._snackBar.open(mensaje, 'OK!', {
      duration: 2500
    })
  }

}
