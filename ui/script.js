$(document).ready(function () {
    let Notify = 0;

    // Se carga la configuración guardada del Local Storage al iniciar el script
    const savedPosition = localStorage.getItem('DP-Notify-position');
    const savedNotifications = localStorage.getItem('DP-Notify-notifications');
    const savedSound = localStorage.getItem('DP-Notify-sound');
    const savedVolume = localStorage.getItem('DP-Notify-volume');

    // Aplicar la configuración guardada si existe
    if (savedPosition) {
        $('#position-select').val(savedPosition);
        $('.container').removeClass().addClass(`container ${savedPosition}`);
    } else {
        // Si no hay configuración guardada, se establece la por defecto
        $('#position-select').val('top-right');
        $('.container').removeClass().addClass('container top-right');
    }

    if (savedNotifications !== null) {
        $('#toggle-notifications').prop('checked', savedNotifications === 'true');
    }

    if (savedSound !== null) {
        $('#toggle-sound').prop('checked', savedSound === 'true');
    }

    if (savedVolume) {
        $('#volume-slider').val(savedVolume);
    }

    // Se crea un objeto de audio para el sonido de notificación
    // ¡IMPORTANTE! Se ha actualizado el nombre del archivo de sonido a "notification.ogg"
    const notificationSound = new Audio('notification.ogg');
    // Se ajusta el volumen inicial
    notificationSound.volume = savedVolume ? savedVolume / 100 : 0.5;

    window.addEventListener('message', function (event) {
        var data = event.data;

        if (data.action === 'ShowNotify') {
            // Verificar si las notificaciones están activadas
            if ($('#toggle-notifications').is(':checked')) {
                var CustomId = ++Notify;
                var secs = Math.floor(((data.timeout - 200) / 1000) % 60) + 's';

                let info;
                // Determinar el icono de la notificación basado en el tipo
                if (data.type === 'success') {
                    info = '<i class="fa-solid fa-circle-check info"></i>';
                } else if (data.type === 'error') {
                    info = '<i class="fa-solid fa-circle-exclamation info"></i>';
                } else {
                    info = '<i class="fa-solid fa-circle-info info"></i>';
                }

                // Determinar el estilo de la notificación
                const notifyClass = `notify-${data.type || 'info'}`;

                const notificationHtml = `
                    <div class="notify ${notifyClass}" id="noti-${CustomId}">
                        ${info}
                        <div class="content" id="content-${CustomId}">${data.text}</div>
                        <div class="bar" id="bar-${CustomId}"></div>
                    </div>
                `;

                // Agregar la notificación al contenedor
                $('.container').append(notificationHtml);

                // Reproducir el sonido si está activado
                if ($('#toggle-sound').is(':checked')) {
                    notificationSound.play().catch(e => console.error("Error al reproducir el sonido:", e));
                }

                $(`#noti-${CustomId}`).fadeIn(500);
                setTimeout(function () {
                    $(`#noti-${CustomId}`).css('transition', 'ease .5s')
                }, 501);
                $(`#bar-${CustomId}`).css({ 'animation': `progressbar ${secs} ease` });

                setTimeout(function () {
                    $(`#noti-${CustomId}`).fadeOut(300, function () {
                        $(this).remove();
                    });
                }, data.timeout);
            }
        }

        if (data.action == 'ShowSettings') {
            $('.settings-menu').fadeIn(300);
        }

        if (data.action == 'CloseSettings') {
            $('.settings-menu').fadeOut(300);
        }
    });

    $('#close-settings').on('click', function () {
        $('.settings-menu').fadeOut(300);
        $.post('https://DP-Notify/CloseSettings', JSON.stringify({}));
    });

    // Nuevo manejador de clic para el botón de prueba
    $('#show-notifications').on('click', function () {
        // Enviar un evento al servidor para que dispare una notificación de prueba
        $.post('https://DP-Notify/TriggerTestNotify', JSON.stringify({}));
    });

    document.onkeyup = function (data) {
        if (data.which == 27) {
            $('.settings-menu').fadeOut(300);
            $.post('https://DP-Notify/CloseSettings', JSON.stringify({}));
        }
    };

    $('#save-settings').on('click', function () {
        const settings = {
            notifications: $('#toggle-notifications').is(':checked'),
            sound: $('#toggle-sound').is(':checked'),
            volume: $('#volume-slider').val(),
            position: $('#position-select').val()
        };

        console.log('Configuración guardada:', JSON.stringify(settings));

        // Guardar la configuración en el Local Storage
        localStorage.setItem('DP-Notify-notifications', settings.notifications);
        localStorage.setItem('DP-Notify-sound', settings.sound);
        localStorage.setItem('DP-Notify-volume', settings.volume);
        localStorage.setItem('DP-Notify-position', settings.position);

        // Enviar la configuración guardada al servidor para que el CSS se ajuste
        const position = settings.position;
        $('.container').removeClass().addClass(`container ${position}`);
        notificationSound.volume = settings.volume / 100;

        $('.settings-menu').fadeOut(300);
        $.post('https://DP-Notify/CloseSettings', JSON.stringify(settings));
    });

    $('#restore-settings').on('click', function () {
        $('#toggle-notifications').prop('checked', true);
        $('#toggle-sound').prop('checked', true);
        $('#volume-slider').val(50);

        // Se restablece la posición a la por defecto
        const defaultPosition = 'top-right';
        $('#position-select').val(defaultPosition);
        $('.container').removeClass().addClass(`container ${defaultPosition}`);

        // Restaurar el volumen del audio a 50
        notificationSound.volume = 0.5;

        // Se elimina la configuración guardada del Local Storage al restaurar
        localStorage.removeItem('DP-Notify-notifications');
        localStorage.removeItem('DP-Notify-sound');
        localStorage.removeItem('DP-Notify-volume');
        localStorage.removeItem('DP-Notify-position');
    });

    // Añadir un listener para cambiar la posición del contenedor cuando el select cambia
    $('#position-select').on('change', function () {
        const newPosition = $(this).val();
        $('.container').removeClass().addClass(`container ${newPosition}`);
    });
});
