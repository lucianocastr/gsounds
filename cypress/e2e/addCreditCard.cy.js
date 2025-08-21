import { basics } from "../support/pageObjects/basics"
import { input } from "../support/pageObjects/input"


/* describe('Visitar gsound', () => {
  
  beforeEach('Acceder al Hub', ()=>{

    cy.clearCookies()
    cy.clearLocalStorage()
    cy.window().then((win) => {
    // limpia todas las DBs (por si guardan tokens ahí)
    if (win.indexedDB?.databases) {
      return win.indexedDB.databases().then(dbs =>
        Promise.all(dbs.map(db => win.indexedDB.deleteDatabase(db.name)))
      )
    }
  })
    
    
    cy.visit(Cypress.env("URL_BASE"));
    basics.login()

  })
it('☑️💾 - Agregar Tarjeta de Crédito / Débito', () => {
  basics.accessProfileCards()
  input.addCreditCard()

      
//input.comprarYValidarResumen(3)


    }) */






// Valida Add Cards sin escribir en el iframe de Stripe.
// Cubre éxito, declinada y 3DS requerido (requires_action).
// Ajustá selectores/URLs si tu app cambia.

const URL_FORM = 'https://gs-customer.pwa.wellet.dev/#/create-card';

const typeIfPresent = (sel, val) => {
  cy.get('body').then($b => {
    if ($b.find(sel).length) {
      cy.get(sel).should('be.visible').and('not.be.disabled').clear().type(val, { delay: 0 });
    }
  });
};

describe('Add Cards - Integración (mock)', () => {
  beforeEach(() => {


    cy.clearCookies()
    cy.clearLocalStorage()
    cy.window().then((win) => {
    // limpia todas las DBs (por si guardan tokens ahí)
    if (win.indexedDB?.databases) {
      return win.indexedDB.databases().then(dbs =>
        Promise.all(dbs.map(db => win.indexedDB.deleteDatabase(db.name)))
      )
    }
  })
    
    
    cy.visit(Cypress.env("URL_BASE"));
    basics.login()
      basics.accessProfileCards()
    // Suele dispararse al abrir el form; lo usamos como “form ready”
    cy.intercept('GET', '**/customer/setupIntent').as('setupIntent');
    // Listado inicial (si lo hay)
    cy.intercept('GET', '**/customer/cards*').as('listCards');
    
    cy.wait('@setupIntent', { timeout: 20000 });
    cy.contains('button', /^Agregar Tarjeta$/, { timeout: 20000 }).should('be.visible');
  });

  it('Éxito: agrega Visa 4242 y la UI muestra Visa •••• 4242', () => {
    // Mock del alta de tarjeta en TU backend
    cy.intercept('POST', '**/customer/cards*', {
      statusCode: 200,
      body: {
        brand: 'visa',
        last4: '4242',
        status: 'succeeded',
        payment_method: 'pm_test_ok'
      }
    }).as('addCardOK');

    // (Opcional) Mock del refresco de tarjetas luego del alta
    cy.intercept('GET', '**/customer/cards*', {
      statusCode: 200,
      body: [
        { brand: 'visa', last4: '4242', payment_method: 'pm_test_ok', is_default: true }
      ]
    }).as('cardsAfterOK');

    // Completar SOLO campos propios (fuera del iframe)
    typeIfPresent('input[name="cardHolder"], input[placeholder*="Titular"]', 'Ari Test');
    typeIfPresent('input[name="email"], input[type="email"]', 'ari.test@example.com');
    typeIfPresent('input[name="phone"], input[type="tel"]', '+54 9 3511111111');

    // No escribimos en el iframe de Stripe (no es posible). Disparamos submit.
    cy.contains('button', /^Agregar Tarjeta$/).should('not.be.disabled').click();

    // Verificamos alta y refresco
    cy.wait('@addCardOK');
    cy.wait('@cardsAfterOK');

    // UI: muestra brand y last4
    cy.contains(/visa/i, { timeout: 10000 }).should('be.visible');
    cy.contains(/4242/, { timeout: 10000 }).should('be.visible');
  });

  it('Declinada: backend responde 402 y la UI muestra error y no persiste', () => {
    cy.intercept('POST', '**/customer/cards*', {
      statusCode: 402,
      body: { error: 'card_declined' }
    }).as('addCardDeclined');

    // El listado NO cambia tras el error (devolvemos lo mismo que al inicio)
    cy.intercept('GET', '**/customer/cards*', { statusCode: 200, body: [] }).as('cardsAfterDecline');

    typeIfPresent('input[name="cardHolder"], input[placeholder*="Titular"]', 'Ari Decline');
    typeIfPresent('input[name="email"], input[type="email"]', 'ari.decline@example.com');
    typeIfPresent('input[name="phone"], input[type="tel"]', '+54 9 3512222222');

    cy.contains('button', /^Agregar Tarjeta$/).click();

    cy.wait('@addCardDeclined');
    cy.wait('@cardsAfterDecline');

    // UI: mensaje de error visible (ajustá al copy real)
    cy.contains(/rechazad|declinad|error/i, { timeout: 10000 }).should('be.visible');

    // No aparece una tarjeta nueva
    cy.contains(/visa|mastercard|amex/i).should('not.exist');
  });

  it('SCA/3DS: requires_action y la UI guía al usuario a autenticar', () => {
    cy.intercept('POST', '**/customer/cards*', {
      statusCode: 200,
      body: {
        status: 'requires_action',
        next_action: 'redirect_to_url',
        payment_method: 'pm_requires_action'
      }
    }).as('addCard3DS');

    typeIfPresent('input[name="cardHolder"], input[placeholder*="Titular"]', 'Ari 3DS');
    typeIfPresent('input[name="email"], input[type="email"]', 'ari.3ds@example.com');
    typeIfPresent('input[name="phone"], input[type="tel"]', '+54 9 3513333333');

    cy.contains('button', /^Agregar Tarjeta$/).click();
    cy.wait('@addCard3DS');

    // UI: debe informar autenticación requerida (ajustar al mensaje real)
    cy.contains(/autenticaci(ó|o)n|verificaci(ó|o)n|3d/i, { timeout: 10000 }).should('be.visible');
  });
});




/* }); */