document.addEventListener('DOMContentLoaded', function() {
    loadInventory();
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validación simple de usuario y contraseña (puedes cambiar estos valores)
    const validUsername = 'admin';
    const validPassword = '1234';

    if (username === validUsername && password === validPassword) {
        // Esconder el formulario de login y mostrar el botón de inventario
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('inventoryButtonContainer').style.display = 'block';
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
});

document.getElementById('inventoryButton').addEventListener('click', function() {
    // Mostrar el sistema de inventario
    document.getElementById('inventoryButtonContainer').style.display = 'none';
    document.getElementById('inventoryContainer').style.display = 'block';
});

document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener valores del formulario
    const rowNumber = document.getElementById('rowNumber').value;
    const productName = document.getElementById('productName').value;
    const expiryDate = document.getElementById('expiryDate').value;

    // Añadir producto a la tabla
    addProductToTable(rowNumber, productName, expiryDate);

    // Guardar inventario en localStorage
    saveInventory();

    // Limpiar formulario
    document.getElementById('productForm').reset();
});

// Función para añadir un producto a la tabla
function addProductToTable(rowNumber, productName, expiryDate) {
    const table = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    // Calcular el estado según la fecha de expiración
    const currentDate = new Date();
    const expirationDate = new Date(expiryDate);
    const timeDiff = expirationDate - currentDate;
    const daysToExpire = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    let status = '';
    let statusColor = '';

    if (daysToExpire < 0) {
        status = 'Expirado';
        statusColor = 'red';
    } else if (daysToExpire <= 7) {
        status = 'Pronto';
        statusColor = 'blue';
    } else {
        status = 'Vigente';
        statusColor = 'green';
    }

    // Insertar datos en la fila
    const cellRowNumber = newRow.insertCell(0);
    const cellName = newRow.insertCell(1);
    const cellExpiry = newRow.insertCell(2);
    const cellStatus = newRow.insertCell(3);
    const cellActions = newRow.insertCell(4);

    cellRowNumber.textContent = rowNumber;
    cellName.textContent = productName;
    cellExpiry.textContent = expiryDate;
    cellStatus.textContent = status;
    cellStatus.style.color = statusColor;

    // Crear botón de eliminación
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.style.backgroundColor = '#ff4d4d';
    deleteButton.style.color = 'white';
    deleteButton.style.border = 'none';
    deleteButton.style.padding = '5px 10px';
    deleteButton.style.borderRadius = '3px';
    deleteButton.style.cursor = 'pointer';

    // Eliminar producto al presionar el botón
    deleteButton.addEventListener('click', function() {
        table.deleteRow(newRow.rowIndex - 1);
        saveInventory();
        updateRowNumbers();
    });

    cellActions.appendChild(deleteButton);

    // Ordenar la tabla después de agregar el producto
    sortTableByExpiryDate();
}

// Guardar inventario en localStorage
function saveInventory() {
    const table = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
    const inventory = [];

    for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        const product = {
            rowNumber: row.cells[0].textContent,
            name: row.cells[1].textContent,
            expiryDate: row.cells[2].textContent,
            status: row.cells[3].textContent,
        };
        inventory.push(product);
    }

    localStorage.setItem('inventory', JSON.stringify(inventory));
}

// Cargar inventario desde localStorage
function loadInventory() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];

    inventory.forEach(product => {
        addProductToTable(product.rowNumber, product.name, product.expiryDate);
    });

    sortTableByExpiryDate();
}

// Función para ordenar la tabla según la fecha de expiración más próxima
function sortTableByExpiryDate() {
    const table = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
    const rows = Array.from(table.rows);

    rows.sort((a, b) => {
        const dateA = new Date(a.cells[2].textContent);
        const dateB = new Date(b.cells[2].textContent);
        return dateA - dateB;
    });

    // Reordenar las filas en la tabla según la fecha de expiración
    rows.forEach(row => table.appendChild(row));
}

// Función para actualizar los números de fila después de eliminar un producto
function updateRowNumbers() {
    const table = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];

    for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        row.cells[0].textContent = i + 1;
    }
}