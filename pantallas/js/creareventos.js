    $(document).ready(function () {
        let filaEditando = null;
        $('#formulario').on('submit', function(e) {
            e.preventDefault(); 

            const nombre = $('#nombre').val();
            const diah = $('#diah').val();
            const lugar = $('#lugar').val();
            const cat = $('#cat').val();

            if (filaEditando) {
            filaEditando.find('td:eq(0)').text(nombre);
            filaEditando.find('td:eq(1)').text(diah);
            filaEditando.find('td:eq(2)').text(lugar);
            filaEditando.find('td:eq(3)').text(cat);
            filaEditando = null;
            } else {
            const nuevaFila = `
                <tr>
                <td>${nombre}</td>
                <td>${diah}</td>
                <td>${lugar}</td>
                <td>${cat}</td>
                <td>
                    <button class="editar">Editar</button>
                    <button class="eliminar">Eliminar</button>
                </td>
                </tr>
            `;
            $('#tabla tbody').append(nuevaFila);
            }

            $('#formulario')[0].reset();
        });

        $('#tabla').on('click', '.eliminar', function () {
            $(this).closest('tr').remove();
        });

        $('#tabla').on('click', '.editar', function () {
            filaEditando = $(this).closest('tr');
            const nombre = filaEditando.find('td:eq(0)').text();
            const diah = filaEditando.find('td:eq(1)').text();
            const lugar = filaEditando.find('td:eq(2)').text();
            const cat = filaEditando.find('td:eq(3)').text();
            $('#nombre').val(nombre);
            $('#diah').val(diah);
            $('#lugar').val(lugar);
            $('#cat').val(cat);
        });
    });
