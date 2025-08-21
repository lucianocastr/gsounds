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

    accessProfileCards(){
      cy.get('img[alt="User Profile"]').click();
      cy.contains('a.menu-link', 'Ver mis tarjetas', { timeout: 3000 })
        .should('be.visible')
        .click();

      cy.contains('button', 'Agregar Tarjeta')
      .should('be.visible')
      .click();

    }

}
export const basics = new Basics()