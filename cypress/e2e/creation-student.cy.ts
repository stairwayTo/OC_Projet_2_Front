describe("Ajout d'un étudiant", () => {
  const newStudent = { firstName: 'Jean', lastName: 'Dupont', email: 'jean@mail.com' };

  beforeEach(() => {
    cy.visit('/students/new', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-token');
      },
    });
  });

  it("Ajouter un student", () => {
    cy.intercept('POST', '/api/students', { statusCode: 201 }).as('createStudent');
    cy.intercept('GET', '/api/students', {
      statusCode: 200,
      body: [{ id: 1, ...newStudent, created_at: '2026-11-11T10:00:00', updated_at: '2026-11-11T10:00:00' }],
    }).as('getStudents');

    cy.get('input[formControlName="firstName"]').type(newStudent.firstName);
    cy.get('input[formControlName="lastName"]').type(newStudent.lastName);
    cy.get('input[formControlName="email"]').type(newStudent.email);
    cy.contains('button', 'Enregistrer').click();

    cy.wait('@createStudent').then((interception) => {
      expect(interception.request.body).to.deep.equal(newStudent);
      expect(interception.request.headers['authorization']).to.equal('Bearer fake-token');
    });
    cy.url().should('match', /\/students$/);
    cy.wait('@getStudents');
    cy.contains('td', 'Jean').should('be.visible');
    cy.contains('td', 'jean@mail.com').should('be.visible');
  });
});
