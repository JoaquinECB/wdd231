const membersContainer = document.querySelector('.members');
const gridBtn = document.querySelector('#grid');
const listBtn = document.querySelector('#list');
const yearSpan = document.querySelector('#year');
const lastModifiedSpan = document.querySelector('#lastModified');

async function loadMembers() {
    try {
        const response = await fetch('data/members.json');
        const members = await response.json();
        displayMembers(members);
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

function displayMembers(members) {
    membersContainer.innerHTML = '';
    members.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('member-card');
        card.innerHTML = `
      <h3>${member.name}</h3>
      <p>${member.description}</p>
      <p><strong>Dirección:</strong> ${member.address}</p>
      <p><strong>Tel:</strong> ${member.phone}</p>
      <p><a href="${member.website}" target="_blank">Sitio Web</a></p>
      <img src="images/${member.image}" alt="${member.name}">
    `;
        membersContainer.appendChild(card);
    });
}

gridBtn.addEventListener('click', () => {
    membersContainer.classList.add('grid');
    membersContainer.classList.remove('list');
});

listBtn.addEventListener('click', () => {
    membersContainer.classList.add('list');
    membersContainer.classList.remove('grid');
});

yearSpan.textContent = new Date().getFullYear();
lastModifiedSpan.textContent = document.lastModified;

loadMembers();