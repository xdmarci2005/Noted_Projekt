import { response } from "express"

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

fetch('http://localhost:3000/getUserByName/Alfred', {
    method:'GET',headers: new Headers(
        {"Content-Type": "application/json",
            "Accept": "application/json",
            "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTc0MzY3MTgzNywiZXhwIjoxNzQzNjc5MDM3fQ.umRczWpOiV8do8VXIbWoYGnQNtVvYkYWqSJDBkXcFHQ"}
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

fetch('http://localhost:3000/getNoteByName/asd', {
  method: 'GET', headers: new Headers(
    {"Content-Type": "application/json",
      "Accept": "application/json",
      "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjExLCJpYXQiOjE3NDM2NzUzMDMsImV4cCI6MTc0MzY4MjUwM30.0oZUZqLNmLS-ENIEGt4UYyyr4vQQLmGhiCu4Z9tDWmU"}
  )
}).then(response => response.json()).then(data => console.log(data))

fetch('http://localhost:3000/saveNote', {
  method:'POST',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTczOTM5Njg4NiwiZXhwIjoxNzM5NDA0MDg2fQ.5LHxx8eqPhh_eas-LX7Xb-vZFoSjv1_5TYI0TUzbVPM"} 
  ),
  body:JSON.stringify({"file": file,"Lathatosag":1})
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
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTc0Mzk1NzAzMSwiZXhwIjoxNzQzOTY0MjMxfQ.yK0j0fK4XDhP_uYlECJiJMLBnnV3Ym8DsvBQwQB8R2Q"}
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

fetch('http://localhost:3000/sharedWithUser', {
  method:'GET',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjcsImlhdCI6MTc0MzM1NjQzNywiZXhwIjoxNzQzMzYzNjM3fQ.eaWIihXLuoZ7qI6Y4dVZd2Vrc4W95oC1KThvyULXfec"}
  )
}).then(response => response.json()).then(data => console.log(data))

fetch('http://localhost:3000/sharedWithGroup/9', {
  method:'GET',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjcsImlhdCI6MTczOTgwMzEyMywiZXhwIjoxNzM5ODEwMzIzfQ.1e00HE-CMRHrbI7mB1j8GDDraEAq-1Obxp0oxU8bnMk"}
  )
}).then(response => response.json()).then(data => console.log(data))

fetch('http://localhost:3000/sharesBy', {
  method:'GET',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTc0NDYxNzMzNSwiZXhwIjoxNzQ0NjI0NTM1fQ.OU7n2AELZcQqjsgacsICNYBOA5NhTvSXccY11s7jCCw"}
  )
}).then(response => response.json()).then(data => console.log(data))

fetch('http://localhost:3000/newShare', {
  method:'POST',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTc0Mzk1NzAzMSwiZXhwIjoxNzQzOTY0MjMxfQ.yK0j0fK4XDhP_uYlECJiJMLBnnV3Ym8DsvBQwQB8R2Q"}
  ),
  body:JSON.stringify({"JegyzetId":1,"MegosztottFelhId":null,"MegosztottCsopId":9,"Jogosultsag":"R"})
}).then(response => response.json()).then(data => console.log(data))

fetch('http://localhost:3000/updateShare/1', { 
  method:'PUT',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTc0Mjk4Njg1NywiZXhwIjoxNzQyOTk0MDU3fQ.G-VvCcXdRW0YyJ7kEyiGEkkbdkkcsTW0S59L-U8teTU"}
  ),
  body:JSON.stringify({"Jogosultsag":"RW"})
}).then(response => response.json()).then(data => console.log(data))

fetch('http://localhost:3000/deleteShare/1', {
  method:'DELETE',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTc0Mzk1NzAzMSwiZXhwIjoxNzQzOTY0MjMxfQ.yK0j0fK4XDhP_uYlECJiJMLBnnV3Ym8DsvBQwQB8R2Q"}
  )
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

fetch('http://localhost:3000/GetGroupsByName/Jozsi', {
  method:'GET',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjksImlhdCI6MTc0NDQ2NjE2NCwiZXhwIjoxNzQ0NDczMzY0fQ.FQe5vsB93XLjHzh7Bnk9e5hle46HdHuzsWbKHmBrza4"}
  )
}).then(response => response.json())
.then(data => console.log(data))

//login

fetch('http://localhost:3000/login', {
  method:'POST',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json"}
  ),
  body:JSON.stringify({"Email":"jozsi@example.com","Jelszo":"Titkos11"})
}).then(response => response.json())
.then(data => console.log(data))

//GroupMembers

fetch('http://localhost:3000/getGroupsByMember',{
  method:'GET',headers: new Headers(
      {"Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTc0Mzc3OTE2MSwiZXhwIjoxNzQzNzg2MzYxfQ.R6lsVocR8pakQNMwTcg2wN1_mrhmoKRSdxYu6wnjAjo"}
  )
}).then(response => response.json()).then(data => console.log(data))

fetch('http://localhost:3000/addMember',{
  method:'POST',headers: new Headers({
    "Content-Type": "application/json",
    "Accept": "application/json",
    "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTc0Mzc3OTE2MSwiZXhwIjoxNzQzNzg2MzYxfQ.R6lsVocR8pakQNMwTcg2wN1_mrhmoKRSdxYu6wnjAjo"
  }),
  body:JSON.stringify({"CsoportId":9,"TagId":9,"JogosultsagId":2})
}).then(response => response.json())
  .then(data => console.log(data))

  fetch('http://localhost:3000/updateMember', {
    method:'PUT',headers: new Headers(
        {"Content-Type": "application/json",
            "Accept": "application/json",
            "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjksImlhdCI6MTc0Mzc5MDkxMSwiZXhwIjoxNzQzNzk4MTExfQ.qglBszauTID0I8viwCpqY0XWSkjm6eAxfoKANedbduQ"}
    ),
    body:JSON.stringify({"CsoportId":9,"TagId":2,"JogosultsagId":2})
}).then(response => response.json())  
  .then(data => console.log(data))

fetch('http://localhost:3000/removeMember', {
    method:'DELETE',headers: new Headers(
        {"Content-Type": "application/json",
            "Accept": "application/json",
            "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjgsImlhdCI6MTc0Mzc5MDcwMiwiZXhwIjoxNzQzNzk3OTAyfQ.SRXCsI8tzL8bbpBlu7g4UD1PnR5ZNmkAqN0g34ATt6E"}
    ),
    body:JSON.stringify({"CsoportId":9,"TagId":2})
}).then(response => response.json())  
  .then(data => console.log(data)) 

