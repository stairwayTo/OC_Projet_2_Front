describe('Gestion des étudiants existants', () => {
  const student = {
    id: 1, firstName: 'Jean', lastName: 'Dupont', email: 'jean@mail.com',
    created_at: '2026-11-11T10:00:00', updated_at: '2026-11-11T10:00:00',
  };

  beforeEach(() => {
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [student] }).as('getStudents');
    cy.intercept('GET', '/api/students/1', { statusCode: 200, body: student }).as('getStudent');
    cy.visit('/students', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-token');
      },
    });
    cy.wait('@getStudents');
  });

  it("détail d'un student", () => {
    cy.contains('a', 'Détail').click();

    cy.wait('@getStudent');
    cy.url().should('match', /\/students\/1$/);
    cy.contains('Jean').should('be.visible');
    cy.contains('jean@mail.com').should('be.visible');
  });

  it('modif student', () => {
    cy.intercept('PUT', '/api/students/1', { statusCode: 200, body: { ...student, firstName: 'Paul' } }).as('updateStudent');

    cy.contains('a', 'Modifier').click();
    cy.wait('@getStudent');
    cy.get('input[formControlName="firstName"]').should('have.value', 'Jean').clear().type('Paul');
    cy.contains('button', 'Enregistrer').click();

    cy.wait('@updateStudent').its('request.body').should('deep.equal', {
      firstName: 'Paul', lastName: 'Dupont', email: 'jean@mail.com',
    });
    cy.url().should('match', /\/students$/);
  });

  it('delete student', () => {
    cy.intercept('DELETE', '/api/students/1', { statusCode: 204 }).as('deleteStudent');
    cy.on('window:confirm', () => true);

    cy.contains('button', 'Supprimer').click();

    cy.wait('@deleteStudent');
    // la liste a été rechargée : 2 appels GET au total (arrivée + après suppression)
    cy.get('@getStudents.all').should('have.length', 2);
  });
});
