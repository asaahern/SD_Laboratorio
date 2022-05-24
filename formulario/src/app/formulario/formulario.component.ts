import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from './../models/usuario.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})

export class FormularioComponent implements OnInit {

  usuario  : UsuarioModel;
  usuarios : Array<object> = []
  accion   : string = 'insertar'
  
  constructor( private http: HttpClient ) {
    this.usuario = new UsuarioModel()
   }

  ngOnInit(): void {
    this.http.get(`http://localhost:5000/users`).subscribe(( data: Array<UsuarioModel>)=>{
      this.usuarios = data 
    })
  }
  anadirUsuario( form: NgForm ){
    let _that = this
    this.http.post(`http://localhost:5000/user`, this.usuario ).subscribe(( res )=>{
      this.http.get(`http://localhost:5000/users`).subscribe(( data: Array<UsuarioModel>)=>{
        _that.usuarios = data 
      })
    })
  }
  eliminarUsuario(id:string){
    let _that = this
    this.http.delete(`http://localhost:5000/user/${id}`).subscribe(( res )=>{
      this.http.get(`http://localhost:5000/users`).subscribe(( data: Array<UsuarioModel>)=>{
        _that.usuarios = data 
      })
    })  
  }

  editarUsuario(id:string){
    this.accion = 'actualizar'
    this.http.get(`http://localhost:5000/user/${id}`).subscribe( (res : UsuarioModel) => {
      this.usuario = res 
    })
  }

  actualizarUsuario(id:string){
    let _that = this
    this.accion = 'insertar'
    this.http.put(`http://localhost:5000/user/${this.usuario._id}`, this.usuario).subscribe(( res )=>{
      this.http.get(`http://localhost:5000/users`).subscribe(( data: Array<UsuarioModel>)=>{
        _that.usuarios = data 
      })
    })
    this.usuario = new UsuarioModel()
  }

}
