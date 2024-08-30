document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
    fetchRoles();

    document.getElementById('addUserForm').addEventListener('submit', handleAddUser);
    document.getElementById('editUserForm').addEventListener('submit', handleEditUser);
    document.getElementById('deleteUserForm').addEventListener('submit', handleDeleteUser);
});

function getCsrfToken() {
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');
    return {csrfToken, csrfHeader};
}

function fetchUsers() {
    fetch('/api/v1/admin/users')
        .then(response => response.json())
        .then(users => {
            const tableBody = document.getElementById('usersTableBody');
            tableBody.innerHTML = '';
            users.forEach(user => {
                tableBody.innerHTML += `
                            <tr>
                                <td>${user.id}</td>
                                <td>${user.firstName}</td>
                                <td>${user.lastName}</td>
                                <td>${user.age}</td>
                                <td>${user.email}</td>
                                <td>${user.roles.map(role => role.name.replace('ROLE_', '')).join(' ')}</td>
                                <td><button class="btn btn-primary btn-sm" onclick="showEditUserModal(${user.id})">Edit</button></td>
                                <td><button class="btn btn-danger btn-sm" onclick="showDeleteUserModal(${user.id})">Delete</button></td>
                            </tr>`;
            });
        })
        .catch(error => console.error('Error fetching users:', error));
}

function fetchRoles() {
    fetch('/api/v1/admin/roles')
        .then(response => response.json())
        .then(roles => {
            const rolesSelect = document.getElementById('roles');
            const editRoleSelect = document.getElementById('editRole');
            const deleteRoleSelect = document.getElementById('deleteRole');
            rolesSelect.innerHTML = '';
            editRoleSelect.innerHTML = '';
            deleteRoleSelect.innerHTML = '';
            roles.forEach(role => {
                rolesSelect.innerHTML += `<option value="${role.id}">${role.name.replace('ROLE_', '')}</option>`;
                editRoleSelect.innerHTML += `<option value="${role.id}">${role.name.replace('ROLE_', '')}</option>`;
                deleteRoleSelect.innerHTML += `<option value="${role.id}">${role.name.replace('ROLE_', '')}</option>`;
            });
        })
        .catch(error => console.error('Error fetching roles:', error));
}

function handleAddUser(event) {
    event.preventDefault();
    const {csrfToken, csrfHeader} = getCsrfToken();

    const data = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        age: document.getElementById('age').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        roles: Array.from(document.getElementById('roles').selectedOptions).map(option => ({
            id: option.value
        }))
    };

    fetch('/api/v1/admin/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            [csrfHeader]: csrfToken
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                fetchUsers();
                document.getElementById('addUserForm').reset();
                const usersTableTab = new bootstrap.Tab(document.querySelector('#users-table-tab'));
                usersTableTab.show();
            } else {
                alert('Failed to add user');
            }
        })
        .catch(error => console.error('Error adding user:', error));
}

function showEditUserModal(userId) {
    fetch(`/api/v1/admin/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('editId').value = user.id;
            document.getElementById('editShownId').value = user.id;
            document.getElementById('editFirstName').value = user.firstName;
            document.getElementById('editLastName').value = user.lastName;
            document.getElementById('editAge').value = user.age;
            document.getElementById('editEmail').value = user.email;
            document.getElementById('editPassword').value = null;
            // Set roles
            const roleIds = user.roles.map(role => role.id);
            Array.from(document.getElementById('editRole').options).forEach(option => {
                option.selected = roleIds.includes(parseInt(option.value));
            });
            new bootstrap.Modal(document.getElementById('editUserModal')).show();
        })
        .catch(error => console.error('Error fetching user:', error));
}

function handleEditUser(event) {
    event.preventDefault();
    const {csrfToken, csrfHeader} = getCsrfToken();

    const data = {
        id: document.getElementById('editId').value,
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        age: document.getElementById('editAge').value,
        email: document.getElementById('editEmail').value,
        password: document.getElementById('editPassword').value,
        roles: Array.from(document.getElementById('editRole').selectedOptions).map(option => ({
            id: option.value
        }))
    };

    fetch(`/api/v1/admin/users`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            [csrfHeader]: csrfToken
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                fetchUsers();
                const editModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
                editModal.hide();
            } else {
                alert('Failed to edit user');
            }
        })
        .catch(error => console.error('Error editing user:', error));
}

function showDeleteUserModal(userId) {
    fetch(`/api/v1/admin/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('deleteId').value = user.id;
            document.getElementById('deleteShownId').value = user.id;
            document.getElementById('deleteFirstName').value = user.firstName;
            document.getElementById('deleteLastName').value = user.lastName;
            document.getElementById('deleteAge').value = user.age;
            document.getElementById('deleteEmail').value = user.email;
            const roleIds = user.roles.map(role => role.id);
            Array.from(document.getElementById('deleteRole').options).forEach(option => {
                option.selected = roleIds.includes(parseInt(option.value));
            });
            new bootstrap.Modal(document.getElementById('deleteUserModal')).show();
        })
        .catch(error => console.error('Error fetching user:', error));
}

function handleDeleteUser(event) {
    event.preventDefault();
    const {csrfToken, csrfHeader} = getCsrfToken();

    const data = {
        id: document.getElementById('deleteId').value,
        firstName: document.getElementById('deleteFirstName').value,
        lastName: document.getElementById('deleteLastName').value,
        age: document.getElementById('deleteAge').value,
        email: document.getElementById('deleteEmail').value,
        roles: Array.from(document.getElementById('deleteRole').selectedOptions).map(option => ({
            id: option.value
        }))
    };

    fetch(`/api/v1/admin/users`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            [csrfHeader]: csrfToken
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                fetchUsers();
                const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteUserModal'));
                deleteModal.hide();
            } else {
                alert('Failed to delete user');
            }
        })
        .catch(error => console.error('Error deleting user:', error));
}