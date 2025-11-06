describe('Simple MERN App', () => {
  it('should load the application', () => {
    cy.visit('/');
    cy.contains('Simple MERN Testing App').should('be.visible');
  });

  it('should login successfully', () => {
    cy.visit('/');
    
    cy.get('[data-testid="name-input"]').type('Test User');
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    
    cy.get('[data-testid="login-btn"]').click();
    
    cy.contains('Welcome, Test User!').should('be.visible');
    cy.get('[data-testid="user-card"]').should('have.length.at.least', 2);
  });

  it('should show validation errors', () => {
    cy.visit('/');
    
    cy.get('[data-testid="login-btn"]').click();
    
    cy.get('[data-testid="name-error"]').should('be.visible');
    cy.get('[data-testid="email-error"]').should('be.visible');
    cy.get('[data-testid="password-error"]').should('be.visible');
  });
});