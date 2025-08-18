
/// <reference types="cypress" />


class Input{

    
    buyTickets(){
        //Selecciona evento
        cy.contains('.gallery-image', 'Sofi Tukker', { timeout: 7000 }) // espera hasta 7s
        .should('be.visible')
        .click()

        //Selecciona tickets
        cy.contains('button', 'Tickets', { timeout: 5000 }) // espera hasta 5s
        .should('be.visible')
        .click()

        const qty = 5;
        const unitPrice = 10;

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

        //Validar datos de la compra


        // 1) Nombre del evento
cy.contains('.fw-bold.font-normal', 'Sofi Tukker').should('be.visible');

// 2) Cantidad (tabla: "5 pax")
cy.get('table').within(() => {
  cy.contains('td', '5 pax').should('be.visible');
});

// 2bis) Cantidad en Resumen: "Cant. adultos: 5"
cy.contains('.row', 'Cant. adultos:')
  .find('.col-auto')
  .should('have.text', '5');

// 3) Total (Euro): €50
cy.contains('.row', 'Total (Euro):')
  .within(() => {
    cy.get('.money .integer')
      .invoke('text')
      .then(t => {
        const totalInt = parseInt(t.replace(/\D/g, ''), 10);
        expect(totalInt).to.eq(50); // €50
      });
  });

// (Opcional) también podés validar Sub total = €50
cy.contains('.row', 'Sub total:')
  .within(() => {
    cy.get('.money .integer')
      .invoke('text')
      .then(t => expect(parseInt(t.replace(/\D/g, ''), 10)).to.eq(50));
  });


    }

}
export const input = new Input()