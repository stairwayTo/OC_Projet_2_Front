describe('Connexion', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it("connexion successfull", () => {
    cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: 'fake-token' } }).as('login');
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [] }).as('getStudents');

    cy.get('input[formControlName="login"]').type('jdupont');
    cy.get('input[formControlName="password"]').type('secret');
    cy.contains('button', 'Login').click();

    cy.wait('@login').its('request.body').should('deep.equal', { login: 'jdupont', password: 'secret' });
    cy.url().should('include', '/students');
    cy.window().its('localStorage.token').should('equal', 'fake-token');
    cy.wait('@getStudents').its('request.headers.authorization').should('equal', 'Bearer fake-token');
  });
});
