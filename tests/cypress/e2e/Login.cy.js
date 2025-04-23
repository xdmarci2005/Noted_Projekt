describe("Login & Registration Flow Tests", () => {
    const baseUrl = "http://localhost:5137";
  
    // ---------- LOGIN TESTS ----------
  
    it("AT001 - Login with valid credentials", () => {
        cy.visit("http://localhost:5173/login");
        cy.get('input[id="email"]').type("tesztEmail@gmail.com");
        cy.get('input[id="password"]').type("Jelszo123");
        cy.get('button[name="loginSubmit"]').click();
        cy.get(".modal-message").should("be.visible");
        cy.get(".modal-message").contains("Sikeres").should("exist");
    
        cy.get(".modal-close-btn").click();
        cy.url().should("include", "/home");
      });
  
      it("AT002 - Login with invalid credentials", () => {
        cy.visit("http://localhost:5173/login");
        cy.get('input[id="email"]').type("hibasEmail");
        cy.get('input[id="password"]').type("rosszpsw");
        cy.get('button[name="loginSubmit"]').click();
      
        cy.get(".modal-message").should("be.visible");
        cy.get(".modal-message").contains("Hibás email vagy jelszó").should("exist");
      });
  
      it("AT003 - Login with empty fields", () => {
        cy.visit("http://localhost:5173/login");
        cy.get('button[name="loginSubmit"]').click();
      
        cy.get(".modal-message").should("be.visible");
        cy.get(".modal-message").contains("Hiányzó felhasználónév vagy jelszó!").should("exist");
      });
  
      it("AT004 - Login with SQL injection", () => {
        cy.visit("http://localhost:5173/login");
        cy.get('input[id="email"]').type("TesztEmail@gmail.com");
        cy.get('input[id="password"]').type("SELECT * FROM users WHERE username = 'admin' AND password = 'password' OR '1'='1';");
        cy.get('button[name="loginSubmit"]').click();
      
        cy.get(".modal-message").should("be.visible");
        cy.get(".modal-message").contains("Nem megengedett karakterek használata.").should("exist");
      });
  
    // ---------- REGISTRATION TESTS ----------
    it("AT005 - Register with data already in use", () => {
      cy.visit("http://localhost:5173/register");
      cy.get('input[id="username"]').focus().type("teszt");
      cy.get('input[id="email"]').focus().type("TesztEmail@gmail.com");
      cy.get('input[id="password"]').focus().type("Jelszo123");
      cy.get('button[name="registersubmitbtn"]').click();
  
      cy.get(".modal-message").should("be.visible");
      cy.get(".modal-message").contains("Már létező felhasználó.").should("exist");
      });

    it("AT006 - Register with invalid data", () => {
    cy.visit("http://localhost:5173/register");
    cy.get('input[id="username"]').focus().type("asd");
    cy.get('input[id="email"]').focus().type("hibasEmail");
    cy.get('input[id="password"]').focus().type("rosszpsw");
    cy.get('button[name="registersubmitbtn"]').click();

    cy.get(".modal-message").should("be.visible");
    cy.get(".modal-message").contains("A jelszónak tartalmaznia kell számokat!").should("exist");
    });
  
    it("AT007 - Register with empty fields", () => {
        cy.visit("http://localhost:5173/register");
        cy.get('button[name="registersubmitbtn"]').click();
      
        cy.get(".modal-message").should("be.visible");
        cy.get(".modal-message").contains("Hiányzó adatok").should("exist");
      });
  
      it("AT008 - Register with SQL injection in password", () => {
        cy.visit("http://localhost:5173/register");
        cy.get('input[id="username"]').focus().type("Tesztnev");
        cy.get('input[id="email"]').focus().type("TesztEmail@gmail.com");
        cy.get('input[id="password"]').focus().type("SELECT * FROM users WHERE username = 'admin' AND password = 'password' OR '1'='1';");
        cy.get('button[name="registersubmitbtn"]').click();
      
        cy.get(".modal-message").should("be.visible");
        cy.get(".modal-message").contains("Nem megengedett karakterek használata.").should("exist");
      });
  
    // ---------- UI FUNCTIONALITY TESTS ----------
  
    it("AT009 - Toggle show password on login page", () => {
        cy.visit("http://localhost:5173/login");
        cy.get('input[id="password"]').type("Jelszo");
        cy.get('img[alt="Show Password"]').click();
        cy.get('input[id="password"]').should("have.attr", "type", "text");
      });
  
      it("AT10 - New note button redirects to editor", () => {
        cy.visit("http://localhost:5173/login");
        cy.get('input[id="email"]').type("tesztEmail@gmail.com");
        cy.get('input[id="password"]').type("Jelszo123");
        cy.get('button[name="loginSubmit"]').click();
        cy.get(".modal-message").should("be.visible");
        cy.get(".modal-message").contains("Sikeres").should("exist");
    
        cy.get(".modal-close-btn").click();
        cy.url().should("include", "/home");
        cy.get('button[name="newNoteButton"]').click();
        cy.url().should("include", "/note");
      });
  
      it("AT011 - Profile button redirects to profile page", () => {
        cy.visit("http://localhost:5173/login");
        cy.get('input[id="email"]').type("tesztEmail@gmail.com");
        cy.get('input[id="password"]').type("Jelszo123");
        cy.get('button[name="loginSubmit"]').click();
        cy.get(".modal-message").should("be.visible");
        cy.get(".modal-message").contains("Sikeres").should("exist");
    
        cy.get(".modal-close-btn").click();
        cy.url().should("include", "/home");
        cy.get(".profile-icon").click();
        cy.url().should("include", "/profile");
      });
  });