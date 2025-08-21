import { basics } from "../support/pageObjects/basics"
import { input } from "../support/pageObjects/input"


describe('Visitar gsound', () => {
  
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
    

  })
it('☑️💾 - Crear nueva cuenta', () => {
      
  cy.contains('button', 'Crear una cuenta nueva')
  .should('be.visible')
  .click();

  // Visitar la pantalla (ajustá si ya estás en ella)
cy.visit('/#sign-up-terms')

// Marca ambos checkboxes (hay 2 y están dentro de .checkbox-container)
cy.get('.checkbox-container input[type="checkbox"]')
  .should('have.length', 2)
  .check({ force: true })     // check() acepta colecciones, marca los 2
  .should('be.checked')

// Verifica que el botón se habilite y hacé click
cy.contains('button', 'Continuar')
  .should('not.be.disabled')
  .click()

  // Estás en la pantalla ya (o visita la ruta)
/* cy.visit('/#sign-up-phone') // ajusta si corresponde */

// 1) Seleccionar país = Argentina
cy.get('select[name="phoneCountry"]', { timeout: 10000 })
  .should('exist')
  .select('AR')


// 2) Ingresar número local (sin +54 porque el componente lo agrega)
cy.get('input.PhoneInputInput')
  .should('be.visible')
  .clear()
  .type('543515557292')

// 3) Verificar que quedó el MSISDN completo
/* cy.get('input.PhoneInputInput')
  .invoke('val')
  .should('eq', '+543515557292') */

// 4) Click en "Enviar por WhatsApp"
cy.contains('button', 'Enviar por WhatsApp')
  .should('be.enabled')
  .click()

  // Asegurate de estar en la pantalla de verificación
cy.contains('Ingresá el código que te enviamos por Whatsapp').should('be.visible')

// Tipear cada dígito en su input
cy.get('#box0-1').type('4')
cy.get('#box1-1').type('4')
cy.get('#box2-1').type('6')
cy.get('#box3-1').type('8')

// Verificar que el botón se habilita y hacer click
cy.contains('button', 'Continuar')
  .should('not.be.disabled')
  .click()

// Validar que estás en la pantalla de email
cy.contains('Ingresa tu e-mail').should('be.visible')

// Ingresar el correo en ambos campos
cy.get('input[name="email"]')
  .should('be.visible')
  .type('lcastroqa@gmail.com')

cy.get('input[name="emailConfirmation"]')
  .should('be.visible')
  .type('lcastroqa@gmail.com')

// Click en Continuar
cy.contains('button', 'Continuar')
  .should('not.be.disabled')
  .click()

// Validar que la pantalla de contraseña esté visible
cy.contains('Ahora, elige una contraseña').should('be.visible')

// Escribir la contraseña en los dos campos
cy.get('input[name="password"]')
  .should('be.visible')
  .type('Luciano123$')

cy.get('input[name="passwordconfirmation"]')
  .should('be.visible')
  .type('Luciano123$')

// Verificar que el botón "Continuar" está habilitado y hacer click
cy.contains('button', 'Continuar')
  .should('not.be.disabled')
  .click()


      
//input.comprarYValidarResumen(3)


    })

});