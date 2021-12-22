describe('blog app',() => {
  beforeEach(() => {
    cy.request('POST','http://localhost:3000/api/testing/reset')
  })
  it('displays login form by default',() => {
    cy.visit('http://localhost:3000')    
    cy.get('form')
    .and('contain','Login')
    .should('contain','Username')
    .should('contain','Password')
    cy.get('form input')
    .should('have.length',2)
    cy.get('form button')
    .contains('Login')
  })
  describe('user login',() => {
    beforeEach(() => {
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
  
    it('red notification with invalid login',() => {
      cy.get('#username').type('testusername')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()
      cy.get('#notification')
      .should('have.css','color','rgb(255, 0, 0)')
    }) 
  })
  describe('while user logged in',() => {
    beforeEach(() => {
      const user = {
        name: 'testname',
        username: 'testusername',
        password: 'testpassword',
        blogs: []
      }
      cy.request('POST','http://localhost:3000/api/users',user)
      cy.visit('http://localhost:3000')
      cy.get('#username').type('testusername')
      cy.get('#password').type('testpassword')
      cy.get('#login-button').click()    
    })
    it('can create new blog',() => {
      cy.get('#createnewblog').click()
      cy.get('#title').type('new blog title')
      cy.get('#author').type('new blog author')
      cy.get('#url').type('new blog url')
      cy.get('#addnewblog').click()

      cy.get('#createnewblog').click()
      cy.get('#title').type('new2 blog title')
      cy.get('#author').type('new2 blog author')
      cy.get('#url').type('new2 blog url')
      cy.get('#addnewblog').click()

      cy.get('html')
      .should('contain','new2 blog title')
      .should('contain','new2 blog author')
    })

    it('can like a blog',() => {
      cy.get('#createnewblog').click()
      cy.get('#title').type('new3 blog title')
      cy.get('#author').type('new3 blog author')
      cy.get('#url').type('new3 blog url')
      cy.get('#addnewblog').click()

      cy.get('#view').click()
      cy.get('html').should('contain','likes 0')
      cy.get('#like').click()
      cy.get('html').should('contain','likes 1')
    })

    it('can delete own blog',() => {
      cy.get('#createnewblog').click()
      cy.get('#title').type('new blog title')
      cy.get('#author').type('new blog author')
      cy.get('#url').type('new blog url')
      cy.get('#addnewblog').click()
      cy.contains('new blog title')
      cy.get('#view').click()
      cy.get('#delete').click()
      cy.get('html')
      .should('not.contain','new blog title')
    })

    it.only('blogs ordered by decreasing likes',() => {
      cy.get('#createnewblog').click()
      cy.get('#title').type('new blog title')
      cy.get('#author').type('new blog author')
      cy.get('#url').type('new blog url')
      cy.get('#addnewblog').click()

      cy.get('#createnewblog').click()
      cy.get('#title').type('new2 blog title')
      cy.get('#author').type('new2 blog author')
      cy.get('#url').type('new2 blog url')
      cy.get('#addnewblog').click()

      cy.get('#createnewblog').click()
      cy.get('#title').type('new3 blog title')
      cy.get('#author').type('new3 blog author')
      cy.get('#url').type('new3 blog url')
      cy.get('#addnewblog').click()
      
      cy.contains('CANCEL').click()

      cy.get('.blog').contains('new blog title').as('blog1')
      cy.get('@blog1').contains('view').click()
      cy.get('@blog1').contains('like').click()
      cy.get('@blog1').contains('like').click()
      cy.get('@blog1').contains('like').click()            

      cy.get('.blog').contains('new2 blog title').as('blog2')
      cy.get('@blog2').contains('view').click()
      cy.get('@blog2').contains('like').click()
      cy.get('@blog2').contains('like').click()  
      cy.get('@blog2').contains('like').click()
      cy.get('@blog2').contains('like').click()           

      cy.get('.blog').contains('new3 blog title').as('blog3')
      cy.get('@blog3').contains('view').click()
      cy.get('@blog3').contains('like').click()      

      cy.get('.likesDiv').then($likesdivs=>{
        let aa = $likesdivs.map((ind,item)=>{
          return item.textContent
        })
        aa = aa.toArray()
        let sorted = aa.sort((b,a)=>a<b ? -1 : b<a ? 1 : 0)
        cy.wrap(aa).should('equal',sorted)
      })
    })
  })
})



