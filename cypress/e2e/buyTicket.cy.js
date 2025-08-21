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
    basics.login()

  })
it('☑️💾 - Comprar Tickets', () => {
      
  let cantidad=10
  input.buyTickets(cantidad)
  input.validarTarjetaYProcederDesdeAlias()
  input.confirmarPago()

      
//input.comprarYValidarResumen(3)


    })

});