//User
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
  body:JSON.stringify({"JegyzetNeve":"UjJegyzetNev","Lathatosag":0})
}).then(response => response.json()).then(data => console.log(data))

//Shares

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
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTc0MTgyMzY3MiwiZXhwIjoxNzQxODMwODcyfQ.QtDgfq6fSfpNtP-1Y6D2mtz9IqzocpfAh-XK-onjyLg"}
  )
}).then(response => response.json()).then(data => console.log(data))

fetch('http://localhost:3000/newShare', {
  method:'POST',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTc0Mjk4Njg1NywiZXhwIjoxNzQyOTk0MDU3fQ.G-VvCcXdRW0YyJ7kEyiGEkkbdkkcsTW0S59L-U8teTU"}
  ),
  body:JSON.stringify({"JegyzetId":1,"MegosztottFelhId":null,"MegosztottCsopId":9,"Jogosultsag":"R"})
}).then(response => response.json()).then(data => console.log(data))

fetch('http://localhost:3000/updateShare', {
  method:'PUT',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTc0Mjk4Njg1NywiZXhwIjoxNzQyOTk0MDU3fQ.G-VvCcXdRW0YyJ7kEyiGEkkbdkkcsTW0S59L-U8teTU"}
  ),
  body:JSON.stringify({"JegyzetId":2,"MegosztottFelhId":7,"MegosztottCsopId":null,"Jogosultsag":"RW"})
}).then(response => response.json()).then(data => console.log(data))

fetch('http://localhost:3000/deleteShare', {
  method:'DELETE',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTc0Mjk4Njg1NywiZXhwIjoxNzQyOTk0MDU3fQ.G-VvCcXdRW0YyJ7kEyiGEkkbdkkcsTW0S59L-U8teTU"}
  ),
  body:JSON.stringify({"JegyzetId":4,"MegosztottFelhId":7,"MegosztottCsopId":null})
}).then(response => response.json()).then(data => console.log(data))

//Groups

fetch('http://localhost:3000/admGetGroups',{
  method:'GET',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTc0Mjk4Njg1NywiZXhwIjoxNzQyOTk0MDU3fQ.G-VvCcXdRW0YyJ7kEyiGEkkbdkkcsTW0S59L-U8teTU"}
  )
}).then(response => response.json()).then(data => console.log(data))

fetch('http://localhost:3000/GetOwnedGroups',{
  method:'GET',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTc0Mjk4Njg1NywiZXhwIjoxNzQyOTk0MDU3fQ.G-VvCcXdRW0YyJ7kEyiGEkkbdkkcsTW0S59L-U8teTU"}
  )
}).then(response => response.json()).then(data => console.log(data))

fetch('http://localhost:3000/admGetGroup/7',{
  method:'GET',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTc0Mjk4Njg1NywiZXhwIjoxNzQyOTk0MDU3fQ.G-VvCcXdRW0YyJ7kEyiGEkkbdkkcsTW0S59L-U8teTU"}
  )
}).then(response => response.json()).then(data => console.log(data))

fetch('http://localhost:3000/newGroup',{
  method:'POST',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTc0Mjk4Njg1NywiZXhwIjoxNzQyOTk0MDU3fQ.G-VvCcXdRW0YyJ7kEyiGEkkbdkkcsTW0S59L-U8teTU"}
  ),
  body:JSON.stringify({"Name":"JozsiCsoportja"})
}).then(response => response.json()).then(data => console.log(data))  

fetch('http://localhost:3000/UpdateGroup/4',{
  method:'PUT',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTc0Mjk4Njg1NywiZXhwIjoxNzQyOTk0MDU3fQ.G-VvCcXdRW0YyJ7kEyiGEkkbdkkcsTW0S59L-U8teTU"}
  ),
  body:JSON.stringify({"Name":"FrissitettJozsiCsoportja"})
}).then(response => response.json()).then(data => console.log(data))

fetch('http://localhost:3000/DeleteGroup/10',{
  method:'DELETE',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTc0Mjk4Njg1NywiZXhwIjoxNzQyOTk0MDU3fQ.G-VvCcXdRW0YyJ7kEyiGEkkbdkkcsTW0S59L-U8teTU"}
        )
}).then(response => response.json()).then(data => console.log(data))

fetch('http://localhost:3000/GroupMembers/1',{
  method:'GET',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTc0Mjk4Njg1NywiZXhwIjoxNzQyOTk0MDU3fQ.G-VvCcXdRW0YyJ7kEyiGEkkbdkkcsTW0S59L-U8teTU"}
  )
}).then(response => response.json()).then(data => console.log(data))


fetch('http://localhost:3000/login', {
  method:'POST',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json"}
  ),
  body:JSON.stringify({"Email":"jozsi@example.com","Jelszo":"Titkos11"})
}).then(response => response.json())
.then(data => console.log(data))