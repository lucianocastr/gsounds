
/// <reference types="cypress" />


class Input{

  
    buyTickets(cantidad){
      
      cy.get('.event-list .swiper-wrapper .swiper-slide .gallery-image:visible', { timeout: 10000 })
      .should('be.visible')
      .eq(0)
      .scrollIntoView()
      .click();


        //Selecciona tickets
        cy.contains('button', 'Tickets', { timeout: 5000 }) // espera hasta 5s
        .should('be.visible')
        .click()

        const qty = cantidad;
        const unitPrice = 50; // Puede ser dinamico tomando el price del evento
        const expectedTotal = unitPrice * qty;   

        // ubicar la fila del ticket
        cy.contains('.ticketCard_container__F09Az', 'Ingreso Anticipado')
        .parents('.row')
        .as('row');

        // click de acuerdo al parametro
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
                const intOnly = parseInt(t.replace(/\D/g, ''), 10);
                expect(intOnly).to.eq(unitPrice * qty); 
            });
        });

        //Esperar a que sea visible continuar y click
        cy.contains('button', 'Continuar', { timeout: 5000 }).should('be.visible').click()

        //Validar datos de la compra

        // Nombre del evento - Puede tomar el nombre para hacerlo dinamico
        cy.contains('.fw-bold.font-normal', 'Fitz x Shimza').should('be.visible');

        // Cantidad (viene por parametro)
        cy.get('table').within(() => {
          cy.contains('td', `${cantidad} pax`).should('be.visible');
        });

        // Cantidad en Resumen: "Cant. adultos: parametro"
        cy.contains('.row', 'Cant. adultos:')
          .find('.col-auto')
          .should('have.text', cantidad);

        // Total (Euro): €50
        cy.contains('.row', 'Total (Euro):')
          .within(() => {
            cy.get('.money .integer')
              .invoke('text')
              .then(t => {
                const totalInt = parseInt(t.replace(/\D/g, ''), 10);
                expect(totalInt).to.eq(cantidad*unitPrice); // €50
              });
          });

        // Subtotal
        cy.contains('.row', 'Sub total:')
          .within(() => {
            cy.get('.money .integer')
              .invoke('text')
              .then(t => expect(parseInt(t.replace(/\D/g, ''), 10)).to.eq(cantidad*unitPrice));
          });

        cy.wrap(expectedTotal).as('expectedTotal');

    }

validarTarjetaYProcederDesdeAlias() {
  cy.get('@expectedTotal').then((expectedTotal) => {

    // 1) Asegurar que hay al menos una tarjeta y seleccionarla
    // Busca un tile que muestre **** #### y haz click para marcarlo
    const maskedCardRe = /(\*{2,}\s*){3}\d{4}/; // **** **** **** 4242
    cy.contains(maskedCardRe, { timeout: 8000 })
      .should('exist')                  // no exigimos visible por si está dentro de un tile complejo
      .then($tile => cy.wrap($tile).click({ force: true }));

    // 2) Validar monto en el botón "Pagar" y hacer click
    cy.contains('button', /^Pagar/, { timeout: 10000 })
      .should('exist')                  // evitamos flakiness del estado "processing"
      .then($btn => {
        // Opción A: tomar SOLO el primer integer dentro del botón
        const intInside = $btn.find('.money .integer').first().text();

        // Fallback por si no existe ese markup en algún build:
        const euros = intInside
          ? parseInt(intInside.replace(/\D/g, ''), 10)
          : (() => {
              const m = ($btn.text() || '').match(/€\s*([\d\.]+)/); // 1er número después de €
              return parseInt((m?.[1] || '0').replace(/\D/g, ''), 10);
            })();

        expect(euros, 'Total en botón Pagar (€)').to.eq(expectedTotal);

        cy.wrap($btn).scrollIntoView().click({ force: true });
      });
  });
}


confirmarPago() {
  // Click en Pagar
  cy.contains('button', /^Pagar/, { timeout: 10000 })
    .should('be.enabled')
    .click({ force: true });

  // Espera de hasta 25s a que aparezca el check OK
  cy.get('svg path[fill="#1D9BF0"]', { timeout: 25000 })
    .should('have.attr', 'd')
    // Valida parte identificatoria de 
    .and('include', '78.6321 38.9763');
}

addCreditCard() {
  cy.fixture('cards.json').then((cards) => {
    cy.wrap(cards).each((card) => {
      cy.log(`Probando: ${card.tipo}`);

      // Esperar que aparezca el iframe de Stripe
      cy.get('iframe[name^="__privateStripeFrame"]', { timeout: 20000 })
        .should('be.visible')
        .its('0.contentDocument.body').should('not.be.empty')
        .then(cy.wrap)
        .within(() => {
          cy.get('#Field-numberInput', { timeout: 10000 })
            .type(card.number, { delay: 0 });
          cy.get('#Field-expiryInput', { timeout: 10000 })
            .type(card.exp, { delay: 0 });
          cy.get('#Field-cvcInput', { timeout: 10000 })
            .type(card.cvc, { delay: 0 });
        });

      // Click en "Agregar Tarjeta"
      cy.contains('button', /^Agregar Tarjeta$/)
        .should('not.be.disabled')
        .click();

      // Validación básica en la UI
      cy.contains(new RegExp(card.brand, 'i'), { timeout: 20000 }).should('be.visible');
      cy.contains(card.last4, { timeout: 20000 }).should('be.visible');
    });
  });
}







}
export const input = new Input()