document.addEventListener('DOMContentLoaded', function() {

// 1. Referencias a los elementos del DOM

    const audio = document.getElementById('audioControl');

// Usamos querySelector para encontrar el botón dentro del contenedor

    const playPauseButton = document.querySelector('.audio-player-container .control-button');

    const currentTimeSpan = document.querySelector('.audio-player-container .current-time');

    const totalTimeSpan = document.querySelector('.audio-player-container .hour');

// Referencia al contenedor que contiene el pseudo-elemento ::before

    const waveformContainer = document.querySelector('.waveform-container');



// 2. Función para formatear el tiempo (segundos a M:SS)

    function formatTime(seconds) {

        if (isNaN(seconds) || seconds < 0) return '0:00';

        const minutes = Math.floor(seconds / 60);

        const remainingSeconds = Math.floor(seconds % 60);

        const secondsString = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

        return `${minutes}:${secondsString}`;

    }



// 3. Inicializar el estado visual del botón

// El audio comienza pausado, por lo que el botón debe ser el ícono de PLAY (triángulo).

    playPauseButton.classList.remove('pause-icon');

    playPauseButton.classList.add('play-icon');

    playPauseButton.setAttribute('aria-label', 'Reproducir audio');



// Inicializar el tiempo actual a 0:00

    currentTimeSpan.textContent = '0:00';



// 4. Función principal para alternar la reproducción/pausa del audio

    function togglePlayPause() {

        if (audio.paused) {

// Audio detenido, reproducir

            audio.play()

                .then(() => {

// Éxito: Cambiar icono a PAUSE

                    playPauseButton.classList.remove('play-icon');

                    playPauseButton.classList.add('pause-icon');

                    playPauseButton.setAttribute('aria-label', 'Pausar audio');

                })

                .catch(error => {

                    console.error("Error al intentar reproducir el audio:", error);

// Manejo de errores de reproducción

                });

        } else {

// Audio reproduciéndose, pausar

            audio.pause();



// Cambiar icono a PLAY

            playPauseButton.classList.remove('pause-icon');

            playPauseButton.classList.add('play-icon');

            playPauseButton.setAttribute('aria-label', 'Reproducir audio');

        }

    }



// 5. Escuchar el evento de clic del botón

    playPauseButton.addEventListener('click', togglePlayPause);





// 6. Actualizar el tiempo total y el tiempo actual



// Cuando se cargan los metadatos (duración total)

    audio.addEventListener('loadedmetadata', function() {

        if (!isNaN(audio.duration)) {

// Actualiza el tiempo total

            totalTimeSpan.textContent = formatTime(audio.duration);

        }

    });



// Se dispara mientras el audio se reproduce (para actualizar el progreso)

    audio.addEventListener('timeupdate', function() {

// Actualizar el tiempo actual

        currentTimeSpan.textContent = formatTime(audio.currentTime);



// --- LÓGICA DE RELLENO DE LA FORMA DE ONDA ---

        if (!isNaN(audio.duration) && waveformContainer) {

// Calcular el porcentaje de progreso

            const progressPercent = (audio.currentTime / audio.duration) * 100;



// Actualizar la variable CSS en el contenedor para rellenar la forma de onda

            waveformContainer.style.setProperty('--progress-width', progressPercent + '%');

        }

    });



// 7. Reiniciar la visualización cuando el audio termina

    audio.addEventListener('ended', function() {

// Reiniciar el botón a PLAY

        playPauseButton.classList.remove('pause-icon');

        playPauseButton.classList.add('play-icon');



// Restablecer la barra de progreso a 0%

        waveformContainer.style.setProperty('--progress-width', '0%');



// Resetear el tiempo actual

        audio.currentTime = 0;

        currentTimeSpan.textContent = '0:00';

    });

});

