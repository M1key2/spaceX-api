const apiUrl = 'https://api.spacexdata.com/v4/launches';

function fetchAndFilterData() {
    const dateInput = document.getElementById('dateInput').value;
    const filterDate = new Date(dateInput);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(launch => 
                launch.success === false && new Date(launch.date_utc) > filterDate
            );

            // Mostrar los datos filtrados en la consola
            console.log('Lanzamientos filtrados:', filteredData);

            const launchesContainer = document.getElementById('launchesContainer');
            launchesContainer.innerHTML = '';

            if (filteredData.length === 0) {
                launchesContainer.innerHTML = '<p>No hay lanzamientos fallidos después de esta fecha.</p>';
                return;
            }

            filteredData.forEach(launch => {
                const launchItem = document.createElement('div');
                const patchImage = launch.links.patch.small ? launch.links.patch.small : 'https://via.placeholder.com/100'; // Imagen por defecto si no hay parche

                const rocket = launch.rocket ? launch.rocket : 'No disponible';
                const launchSite = launch.launchpad ? launch.launchpad : 'No disponible';
                const flightNumber = launch.flight_number ? launch.flight_number : 'Desconocido';
                const failureReason = launch.failures.length > 0 ? launch.failures[0].reason : 'No especificado';

                launchItem.innerHTML = `
                    <img src="${patchImage}" alt="Imagen del parche de ${launch.name}">
                    <div>
                        <h3>${launch.name}</h3>
                        <p><strong>Fecha:</strong> ${new Date(launch.date_utc).toLocaleDateString()}</p>
                        <p><strong>Detalles:</strong> ${launch.details ? launch.details : 'No disponible'}</p>
                        <p><strong>Cohete:</strong> ${rocket}</p>
                        <p><strong>Sitio de lanzamiento:</strong> ${launchSite}</p>
                        <p><strong>Número de vuelo:</strong> ${flightNumber}</p>
                        <p><strong>Motivo del fallo:</strong> ${failureReason}</p>
                    </div>
                `;
                launchesContainer.appendChild(launchItem);
            });
        })
        .catch(error => {
            console.error('Error al consumir la API:', error);
        });
}

document.getElementById('loadDataBtn').addEventListener('click', fetchAndFilterData);
