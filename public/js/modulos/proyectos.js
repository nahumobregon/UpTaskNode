import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar) {
	btnEliminar.addEventListener('click', (e) => {
		// en el boton hay un atributo --> data-proyecto-url
		//el cuál se creo en la vista tareas.pug y se le asigna un
		//valor de manera dinámica
		//queremos accesar ese atributo y se hace de la siguiente manera y
		//obtener su valor              v        v
		const urlProyecto = e.target.dataset.proyectoUrl;
		//comprobacion :
		console.log(urlProyecto);
		//return;
		//console.log('Diste click en eliminar');

		Swal.fire({
			title: 'Deseas borrar este proyecto?',
			text: 'Un proyecto eliminado no lo podras recuperar!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, borrar!',
			cancelButtonText: 'No, cancelar',
		}).then((result) => {
			if (result.value) {
				//enviar peticion axios
				const url = `${location.origin}/proyectos/${urlProyecto}`;
				//console.log(url)  ==> http://localhost:3000/proyectos/proyecto-up-task-bgB-beweM

				axios
					.delete(url, { params: { urlProyecto } })
					.then(function (respuesta) {
						console.log(respuesta);

						return;

						Swal.fire('Eliminado!', respuesta.data, 'success');
						//redireccionar al usuario
						setTimeout(() => {
							window.location.href = '/';
						}, 3000);
					})
					.catch(() => {
						Swal.fire({
							type: 'error',
							title: 'Hubo un error',
							text: 'No se pudo eliminar el proyecto',
						});
					});
			}
		});
	});
}

export default btnEliminar;
