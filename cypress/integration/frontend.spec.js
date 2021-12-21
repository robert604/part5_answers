describe('blog app',() => {
  beforeEach(() => {
    cy.request('POST','http://localhost:3000/api/testing/reset')
    cy.visit('http://localhost:3000')
  })
  it('displays login form by default',() => {
    cy.get('form')
    .and('contain','Login')
    .should('contain','Username')
    .should('contain','Password')
    cy.get('form input')
    .should('have.length',2)
    cy.get('form button')
    .contains('Login')

  })
})

describe('user login',() => {
  beforeEach(() => {
    cy.request('POST','http://localhost:3000/api/testing/reset')
    const user = {
      name: 'testname',
      username: 'testusername',
      password: 'testpassword',
      blogs: []
    }
    cy.request('POST','http://localhost:3000/api/users',user)
    cy.visit('http://localhost:3000')
  })

  it('can open front page',() => {
    cy.contains('Login')
  })

  it('can login',() => {
    cy.get('#username').type('testusername')
    cy.get('#password').type('testpassword')
    cy.get('#login-button').click()
    cy.contains('testname logged in')
  })

  it('cannot login with invalid username',() => {
    cy.get('#username').type('wrongusername')
    cy.get('#password').type('testpassword')
    cy.get('#login-button').click()
    cy.get('html').should('not.contain','logged in')
  })

  it('cannot login with wrong password',() => {
    cy.get('#username').type('testusername')
    cy.get('#password').type('wrongpassword')
    cy.get('#login-button').click()
    cy.get('html').should('not.contain','logged in')
  })

  it.only('red notification with invalid login',() => {
    cy.get('#username').type('testusername')
    cy.get('#password').type('wrongpassword')
    cy.get('#login-button').click()
    cy.get('#notification')
    .should('have.css','color','rgb(255, 0, 0)')
  }) 
})