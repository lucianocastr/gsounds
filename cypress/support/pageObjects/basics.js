/// <reference types="cypress" />


class Basics{
    login(){

      cy.get('button[type="submit"]').contains('Iniciar sesión').click();
      // Completar el campo de email
      cy.get('input[name="email"]', { timeout: 2000 }).type('matias@wellet.fun')

      // Click en el botón Continuar
      cy.get('button[type="submit"]').contains('Continuar').click()
      //cy.wait(200)

      // Completar el campo de contraseña
      cy.get('input[name="password"]', { timeout: 2000 }).type('Mati1234', { log: false })

      // Pulsar el botón Sign in
      cy.get('button[type="submit"]').contains('Ingresar').click()

      









 /*      //Selecciona tickets
      cy.contains('button', 'Tickets', { timeout: 5000 }) // espera hasta 5s
      .should('be.visible')
      .click()

      //Click en + para agregar 
      cy.get('button.ticketCard_add__\\+v85g').click()
      //Esperar a que sea visible continuar y click
      cy.contains('button', 'Continuar', { timeout: 5000 }).should('be.visible').click()
      
 */



    }

    buyTickets(){
      //Selecciona evento
      cy.contains('.gallery-image', 'Sofi Tukker', { timeout: 7000 }) // espera hasta 5s
      .should('be.visible')
      .click()



      //Selecciona tickets
      cy.contains('button', 'Tickets', { timeout: 5000 }) // espera hasta 5s
      .should('be.visible')
      .click()


      
      const qty = 5;
const unitPrice = 10; // €10

// ubicar la fila del ticket
cy.contains('.ticketCard_container__F09Az', 'Ingreso Anticipado')
  .parents('.row')
  .as('row');

// sumar 5
cy.get('@row').contains('button', '+', { timeout: 5000 }).should('be.visible');
Cypress._.times(qty, () => {
  cy.get('@row').contains('button', '+').click();
});

// validar total (solo el integer del botón Continuar)
cy.contains('button', 'Continuar', { timeout: 5000 })
  .scrollIntoView()
  .should('be.visible')
  .within(() => {
    cy.get('.font-normal .money .integer')
      .invoke('text')
      .then(t => {
        const intOnly = parseInt(t.replace(/\D/g, ''), 10); // "50"
        expect(intOnly).to.eq(unitPrice * qty); // 50
      });
  });

  //Esperar a que sea visible continuar y click
      cy.contains('button', 'Continuar', { timeout: 5000 }).should('be.visible').click()
    }

}
export const basics = new Basics()