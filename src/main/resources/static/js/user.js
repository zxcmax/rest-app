async function fetchUserData() {
    try {
        const response = await fetch('/api/v1/user', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const user = await response.json();
        const userInfoTable = document.getElementById('usersTableBody');
        userInfoTable.innerHTML = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(role => role.name.replace('ROLE_', '')).join(' ')}</td>
                </tr>
            `;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchUserData);
