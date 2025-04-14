describe("Login & Registration Flow Tests", () => {
    const baseUrl = "http://localhost:5137";
  
    // ---------- LOGIN TESTS ----------
  
    it("AT001 - Login with valid credentials", () => {
        cy.visit("http://localhost:5173/login");
        cy.get('input[name="email"]').type("tesztEmail@gmail.com");
        cy.get('input[name="password"]').type("Jelszo123");
        cy.get("form").submit();
      
        cy.url().should("include", "/home");
      });
  
      it("AT002 - Login with invalid credentials", () => {
        cy.visit("http://localhost:5173/login");
        cy.get('input[name="email"]').type("hibasEmail");
        cy.get('input[name="password"]').type("rosszpsw");
        cy.get("form").submit();
      
        cy.contains("hibás adatokat").should("exist");
      });
  
      it("AT003 - Login with empty fields", () => {
        cy.visit("http://localhost:5173/login");
        cy.get("form").submit();
      
        cy.contains("nem adta meg az adatokat").should("exist");
      });
  
      it("AT004 - Login with SQL injection", () => {
        cy.visit("http://localhost:5173/login");
        cy.get('input[name="email"]').type("TesztEmail@gmail.com");
        cy.get('input[name="password"]').type("SELECT * FROM users WHERE username = 'admin' AND password = 'password' OR '1'='1';");
        cy.get("form").submit();
      
        cy.contains("nem megengedett karakterek").should("exist");
      });
  
    // ---------- REGISTRATION TESTS ----------
  
    it("AT005 - Register with existing valid data", () => {
        cy.visit("http://localhost:5173/register");
        cy.get('input[name="username"]').type("tesztfelhasznalo");
        cy.get('input[name="email"]').type("tesztEmail@gmail.com");
        cy.get('input[name="password"]').type("Jelszo123");
        cy.get("form").submit();
      
        cy.contains("már létezik ilyen felhasználó").should("exist");
      });

    it("AT006 - Register with invalid data", () => {
    cy.visit("http://localhost:5173/register");
    cy.get('input[name="username"]').type("asd");
    cy.get('input[name="email"]').type("hibasEmail");
    cy.get('input[name="password"]').type("rosszpsw");
    cy.get("form").submit();

    cy.contains("hibás adatokat adott meg").should("exist");
    });
  
    it("AT007 - Register with empty fields", () => {
        cy.visit("http://localhost:5173/register");
        cy.get("form").submit();
      
        cy.contains("nem adta meg az adatokat").should("exist");
      });
  
      it("AT008 - Register with SQL injection in password", () => {
        cy.visit("http://localhost:5173/register");
        cy.get('input[name="username"]').type("Tesztnev");
        cy.get('input[name="email"]').type("TesztEmail@gmail.com");
        cy.get('input[name="password"]').type("SELECT * FROM users WHERE username = 'admin' AND password = 'password' OR '1'='1';");
        cy.get("form").submit();
      
        cy.contains("nem megengedett karakterek").should("exist");
      });
  
    // ---------- UI FUNCTIONALITY TESTS ----------
  
    it("AT009 - Toggle show password on login page", () => {
        cy.visit("http://localhost:5173/login");
        cy.get('input[name="password"]').type("Jelszo");
        cy.get('.show-password-toggle').click();
        cy.get('input[name="password"]').should("have.attr", "type", "text");
      });
  
      it("AT010 - New note button redirects to editor", () => {
        cy.login();
        cy.visit("http://localhost:5173/home");
        cy.get(".notes-section button").click();
        cy.url().should("include", "/note");
      });
  
      it("AT011 - Profile button redirects to profile page", () => {
        cy.login();
        cy.visit("http://localhost:5173/home");
        cy.get(".profile-icon").click();
        cy.url().should("include", "/profile");
      });
  });