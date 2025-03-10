fetch('http://localhost:3000/updateuser', {
    method:'PUT',headers: new Headers(
        {"Content-Type": "application/json",
            "Accept": "application/json",
            "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTczOTM5Njg4NiwiZXhwIjoxNzM5NDA0MDg2fQ.5LHxx8eqPhh_eas-LX7Xb-vZFoSjv1_5TYI0TUzbVPM"}
    ),
    body:JSON.stringify({"Email":"jozsi@example.com"})
}).then(response => response.json())
  .then(data => console.log(data))

fetch('http://localhost:3000/getUser', {
    method:'GET',headers: new Headers(
        {"Content-Type": "application/json",
            "Accept": "application/json",
            "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTczOTM5Njg4NiwiZXhwIjoxNzM5NDA0MDg2fQ.5LHxx8eqPhh_eas-LX7Xb-vZFoSjv1_5TYI0TUzbVPM"}
    )
}).then(response => response.json())
  .then(data => console.log(data))


fetch('http://localhost:3000/Admupdateuser/111', {
    method:'PUT',headers: new Headers(
        {"Content-Type": "application/json",
            "Accept": "application/json",
            "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTczOTM5Njg4NiwiZXhwIjoxNzM5NDA0MDg2fQ.5LHxx8eqPhh_eas-LX7Xb-vZFoSjv1_5TYI0TUzbVPM"}
    ),
    body:JSON.stringify({"Email":"ujemail@gmail.com"})
}).then(response => response.json())
  .then(data => console.log(data))

//Blockolás
fetch('http://localhost:3000/Admupdateuser/111', {
    method:'PUT',headers: new Headers(
        {"Content-Type": "application/json",
            "Accept": "application/json",
            "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTczOTM5Njg4NiwiZXhwIjoxNzM5NDA0MDg2fQ.5LHxx8eqPhh_eas-LX7Xb-vZFoSjv1_5TYI0TUzbVPM"}
    ),
    body:JSON.stringify({"statusz":0})
}).then(response => response.json())
  .then(data => console.log(data))


//törlés
  fetch('http://localhost:3000/Admdeleteuser/115', {
    method:'DELETE',headers: new Headers(
        {"Content-Type": "application/json",
            "Accept": "application/json",
            "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTczOTM5Njg4NiwiZXhwIjoxNzM5NDA0MDg2fQ.5LHxx8eqPhh_eas-LX7Xb-vZFoSjv1_5TYI0TUzbVPM"}
    )
}).then(response => response.json())
  .then(data => console.log(data))

//getuser Admin
fetch('http://localhost:3000/Admgetuserbyid/111', {
    method:'GET',headers: new Headers(
        {"Content-Type": "application/json",
            "Accept": "application/json",
            "x-access-token":"token"}
    )
}).then(response => response.json())
  .then(data => console.log(data))

fetch('http://localhost:3000/Admgetusers', {
    method:'GET',headers: new Headers(
        {"Content-Type": "application/json",
            "Accept": "application/json",
            "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTczOTM5Njg4NiwiZXhwIjoxNzM5NDA0MDg2fQ.5LHxx8eqPhh_eas-LX7Xb-vZFoSjv1_5TYI0TUzbVPM"}
    )
}).then(response => response.json())
  .then(data => console.log(data))


//Notes
fetch('http://localhost:3000/getNotes', {
    method:'GET',headers: new Headers(
        {"Content-Type": "application/json",
            "Accept": "application/json",
            "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTczOTM5Njg4NiwiZXhwIjoxNzM5NDA0MDg2fQ.5LHxx8eqPhh_eas-LX7Xb-vZFoSjv1_5TYI0TUzbVPM"}
    )
}).then(response => response.json()).then(data => console.log(data))

fetch('http://localhost:3000/CreateNote', {
  method:'POST',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTczOTM5Njg4NiwiZXhwIjoxNzM5NDA0MDg2fQ.5LHxx8eqPhh_eas-LX7Xb-vZFoSjv1_5TYI0TUzbVPM"} 
  ),
  body:JSON.stringify({"JegyzetNeve":"TesztJegyzet2","Lathatosag":1,"JegyzetTartalma":"qwertzuiopőúűáááélkjhgfdsaíyxcvbnm"})
}).then(response => response.json()).then(data => console.log(data))

fetch('http://localhost:3000/getNote/1', {
  method:'GET',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjIsImlhdCI6MTczOTU2OTc1NywiZXhwIjoxNzM5NTc2OTU3fQ.WVfi_uFzavvtwtGca4N5-N_KBtlhWjvxNtiOAYy03eg"}
  )
}).then(response => response.json()).then(data => console.log(data))

fetch('http://localhost:3000/deleteNote/1', {
  method:'DELETE',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTczOTM5Njg4NiwiZXhwIjoxNzM5NDA0MDg2fQ.5LHxx8eqPhh_eas-LX7Xb-vZFoSjv1_5TYI0TUzbVPM"}
      )
}).then(response => response.json()).then(data => console.log(data))

fetch('http://localhost:3000/updateNote/4', {
  method:'PUT',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTczOTM5Njg4NiwiZXhwIjoxNzM5NDA0MDg2fQ.5LHxx8eqPhh_eas-LX7Xb-vZFoSjv1_5TYI0TUzbVPM"}
  ),
  body:JSON.stringify({"JegyzetNeve":"UjJegyzetNev","Lathatosag":0,"JegyzetTartalma":"UjTartalom"})
}).then(response => response.json()).then(data => console.log(data))



fetch('http://localhost:3000/sharedWith', {
  method:'GET',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjcsImlhdCI6MTczOTgwMzEyMywiZXhwIjoxNzM5ODEwMzIzfQ.1e00HE-CMRHrbI7mB1j8GDDraEAq-1Obxp0oxU8bnMk"}
  )
}).then(response => response.json()).then(data => console.log(data))

fetch('http://localhost:3000/sharedBy', {
  method:'GET',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjcsImlhdCI6MTczOTgwMzEyMywiZXhwIjoxNzM5ODEwMzIzfQ.1e00HE-CMRHrbI7mB1j8GDDraEAq-1Obxp0oxU8bnMk"}
  )
}).then(response => response.json()).then(data => console.log(data))


//8-as eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTczOTgwMzA2MywiZXhwIjoxNzM5ODEwMjYzfQ.-B1-bw99Z9jZNZ5gX7x2ethUUxnJjoBmUu9svZoYlaY
//2-es eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjIsImlhdCI6MTczOTYyNzkzOCwiZXhwIjoxNzM5NjM1MTM4fQ.NNHxKgqLbkyMyK1jqdtMO0H8PItua33tgGtEqilJqiU
//7-es eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjcsImlhdCI6MTczOTgwMzEyMywiZXhwIjoxNzM5ODEwMzIzfQ.1e00HE-CMRHrbI7mB1j8GDDraEAq-1Obxp0oxU8bnMk

fetch('http://localhost:3000/shares', {
  method:'POST',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTczOTgwMzA2MywiZXhwIjoxNzM5ODEwMjYzfQ.-B1-bw99Z9jZNZ5gX7x2ethUUxnJjoBmUu9svZoYlaY"}
  ),
  body:JSON.stringify({"JegyzetId":2,"MegosztottFelhId":7,"GroupSharedId":null,"Jogosultsag":"R"})
}).then(response => response.json()).then(data => console.log(data))