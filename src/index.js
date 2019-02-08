function getAllHogs(){
  return fetch('http://localhost:3000/hogs')
  .then(res => res.json())
}

function iterateAllHogs(allHogs){
  allHogs.forEach(hogHTML)
}

function hogHTML(hog){
  let hogContainer = document.getElementById('hog-container')
  const div = document.createElement('div')
  div.className = "hog-card"
  div.dataset.hogId = hog.id

  div.innerHTML = `
  <img src="${hog.image}">
  <h3>"${hog.name}"</h3>
  <span>"${hog.specialty}"</span> </br>
  <input class="grease-box"type="checkbox"> Greased?
  `
  hogContainer.appendChild(div)

  if (hog.greased == true){
    document.querySelector(`div[data-hog-id="${hog.id}"]`).children[4].checked = true
  }
}

function delegateSubmitBtn(){
  let hogForm = document.getElementById('hog-form')
  hogForm.addEventListener("submit", hogFormStuff)
}

function hogFormStuff(event){
  event.preventDefault()
  let hogForm = document.getElementById('hog-form')
  newHogObj = {
    name:hogForm.name.value,
    specialty:hogForm.specialty.value,
    medal:hogForm.medal.value,
    weight:hogForm.weight.value,
    img:hogForm.img.value,
    greased:hogForm.greased.checked
  }
  postNewHog(newHogObj)

}

function postNewHog(newHogObj){
  fetch('http://localhost:3000/hogs', {
    method:"POST",
    body: JSON.stringify(newHogObj),
    headers:{
      "Content-Type": "application/json"
    }
  }).then(res => res.json()).then(data => hogHTML(data))
}

function patchNewHog(hogObj){
  fetch(`http://localhost:3000/hogs/${hogObj.id}`, {
    method:"PATCH",
    body: JSON.stringify(hogObj),
    headers:{
      "Content-Type": "application/json"
    }
  }).then(res => res.json()).then(data => console.log(data))
}

function getHog(hogObj){
  return fetch(`http://localhost:3000/hogs/${hogObj.id}`)
  .then(res => res.json())
}

function delegateHogContainer(){
  let hogContainer = document.getElementById('hog-container')
  hogContainer.addEventListener('click', chkBox)
}

function chkBox(event){
  if (event.target.className === "grease-box"){
    hogObj = {
      id: event.target.parentNode.dataset.hogId
    }
    getHog(hogObj).then(data => {
      data.greased = !data.greased
      patchNewHog(data)
    })
    // patchNewHog(hogObj)
  }

}

document.addEventListener("DOMContentLoaded", async()=>{
  const allHogs = await getAllHogs()
  iterateAllHogs(allHogs)
  delegateSubmitBtn()
  delegateHogContainer()
  console.log(allHogs)
})
