import Swal from 'sweetalert2';

export const actualizarAvance = () => {
	//Seleccionar tareas existentes
	const tareas = document.querySelectorAll('li.tarea');
	//console.log('tareas:');
	//console.log(tareas);

	if (tareas.length) {
		//seleccionar tareas completadas
		const tareasCompletas = document.querySelectorAll('i.completo');
		//console.log('tareasCompletas');
		//console.log(tareasCompletas);
		//calcular el avance
		const avance = Math.round((tareasCompletas.length / tareas.length) * 100);
		//console.log('avance');
		//console.log(avance);
		//mostrar el avance
		const porcentaje = document.querySelector('#porcentaje');
		porcentaje.style.width = avance + '%';
		//console.log(porcentaje);

		if (avance === 100) {
			Swal.fire(
				'Proyecto Completado',
				'Felicidades , terminaste tus tareas',
				'success'
			);
		}
	}
};
