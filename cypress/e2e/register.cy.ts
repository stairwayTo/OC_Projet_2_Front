describe('Inscription', () => {
  // Avant chaque test : on ouvre la page dans le vrai navigateur
  beforeEach(() => {
    cy.visit('/register'); // baseUrl + '/register' = http://localhost:4200/register
  });

  it('crée un compte et redirige vers la page de connexion', () => {
    // GIVEN : on intercepte l'appel au back et on répond 201 à sa place
    //         .as('register') donne un surnom à cette requête pour l'attendre plus tard
    cy.intercept('POST', '/api/register', { statusCode: 201 }).as('register');

    // WHEN : l'utilisateur remplit le formulaire et clique, comme un humain
    cy.get('input[formControlName="firstName"]').type('Jean');
    cy.get('input[formControlName="lastName"]').type('Dupont');
    cy.get('input[formControlName="login"]').type('jdupont');
    cy.get('input[formControlName="password"]').type('secret');
    cy.contains('button', 'Register').click();

    // THEN 1 : la requête est bien partie, avec le bon corps
    cy.wait('@register').its('request.body').should('deep.equal', {
      firstName: 'Jean',
      lastName: 'Dupont',
      login: 'jdupont',
      password: 'secret',
    });
    // THEN 2 : l'utilisateur a été envoyé sur la page de connexion
    cy.url().should('include', '/login');
  });

  it("affiche les erreurs et n'appelle pas l'API si le formulaire est vide", () => {
    // GIVEN : un espion à la place du back, pour vérifier qu'il n'est JAMAIS appelé
    cy.intercept('POST', '/api/register', cy.spy().as('registerCall'));

    // WHEN : clic sans rien remplir
    cy.contains('button', 'Register').click();

    // THEN
    cy.contains('First Name is required').should('be.visible');
    cy.contains('Login is required').should('be.visible');
    cy.get('@registerCall').should('not.have.been.called');
    cy.url().should('include', '/register'); // on n'a pas bougé
  });
});
