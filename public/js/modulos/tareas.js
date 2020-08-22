import axios from 'axios';
import Swal from 'sweetalert2';
import { actualizarAvance } from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
	tareas.addEventListener('click', (e) => {
		//console.log(e.target.classList);
		if (e.target.classList.contains('fa-check-circle')) {
			//console.log('Actualizando');
			//obtengo el <i class="far fa-check-circle" ...
			const icono = e.target;
			//obtengo <li class="tarea" data-tarea="1"> ...
			//const idTarea = icono.parentElement.parentElement;
			//si quiero obtener data-tarea utilizo dataset.tarea haciendo referencia a data-tarea
			const idTarea = icono.parentElement.parentElement.dataset.tarea;
			//console.log('icono : ');
			//console.log(icono);
			//console.log('idTarea :');
			//console.log(idTarea);

			//request hacia /tareas/:id
			const url = `${location.origin}/tareas/${idTarea}`;
			//console.log(url);

			axios.patch(url, { idTarea }).then(function (respuesta) {
				console.log(respuesta);
				//responderia "Actualizado..." porque en el controller
				//pusimos 	res.send('Actualizado ...');
				if (respuesta.status === 200) {
					icono.classList.toggle('completo');

					actualizarAvance();
				}
			});
		}

		if (e.target.classList.contains('fa-trash')) {
			//console.log(e.target);
			//nos da respuesta : <i class="fas fa-trash" aria.hidden="true">
			//ocupamos subir dos niveles para extraer el html
			const tareaHTML = e.target.parentElement.parentElement,
				idTarea = tareaHTML.dataset.tarea;
			//console.log(tareaHTML);
			//tareaHTML nos da resultado <li class="tarea" data-tarea="1">
			//console.log(idTarea);
			//nos da resultado 1 por ejemplo que es el id de la tarea
			//console.log('Eliminando....');

			Swal.fire({
				title: 'Deseas borrar esta Tarea?',
				text: 'Ua tarea eliminada no la podras recuperar!',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Si, borrar!',
				cancelButtonText: 'No, cancelar',
			}).then((result) => {
				if (result.value) {
					//console.log('Eliminado .... desde tareas.js');
					const url = `${location.origin}/tareas/${idTarea}`;

					//enviar el delete por medio de Axios
					axios
						.delete(url, {
							params: {
								idTarea,
							},
						})
						.then(function (respuesta) {
							console.log('respuesta de axios:');
							console.log(respuesta);
							if (respuesta.status === 200) {
								//eliminar el nodo
								//para eliminar el nodo, siempre hay que ir
								//al elemento padre
								tareaHTML.parentElement.removeChild(tareaHTML);

								//opcional una alerta
								Swal.fire('Tarea Eliminada', respuesta.data, 'success');
								actualizarAvance();
							}
						});
				}
			});
		}
	});
}

export default tareas;
