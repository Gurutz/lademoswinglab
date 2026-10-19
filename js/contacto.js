// Formulario de contacto
// El destino del formulario se define en el atributo "action" del <form> en contacto.html.
// Aquí se envía por AJAX para mostrar el mensaje de confirmación sin salir de la página.

(function () {
    const form = document.getElementById('contactoForm');
    if (!form) {
        return;
    }

    const status = document.getElementById('contactoStatus');
    const submitButton = form.querySelector('button[type="submit"]');
    const submitLabel = submitButton.innerHTML;

    // Preseleccionar el motivo si se llega desde otra página (ej. contacto.html?motivo=salas)
    const params = new URLSearchParams(window.location.search);
    const motivo = params.get('motivo');
    if (motivo) {
        const option = form.querySelector('input[name="motivo"][data-key="' + motivo + '"]');
        if (option) {
            option.checked = true;
        }
    }
    if (params.get('enviado') === '1') {
        showStatus('ok', '¡Gracias! Hemos recibido tu mensaje y te responderemos lo antes posible.');
    }

    function showStatus(type, message) {
        status.className = 'contacto-status ' + (type === 'ok' ? 'is-ok' : 'is-error');
        status.textContent = message;
    }

    form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
            return;
        }
        event.preventDefault();

        // FormSubmit ofrece un endpoint AJAX en /ajax/ que devuelve JSON
        const endpoint = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        fetch(endpoint, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: new FormData(form)
        })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Error ' + response.status);
                }
                return response.json();
            })
            .then(function (data) {
                if (data.success === false || data.success === 'false') {
                    throw new Error(data.message || 'Error');
                }
                form.reset();
                showStatus('ok', '¡Gracias! Hemos recibido tu mensaje y te responderemos lo antes posible.');
            })
            .catch(function () {
                showStatus('error', 'No hemos podido enviar el mensaje. Inténtalo de nuevo o escríbenos a hola@lademoswinglab.es');
            })
            .finally(function () {
                submitButton.disabled = false;
                submitButton.innerHTML = submitLabel;
            });
    });
})();
