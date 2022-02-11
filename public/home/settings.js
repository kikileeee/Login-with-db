let userInfo = JSON.parse(localStorage.getItem('userInfo')) || []
document.querySelector('.helloUser').textContent = 'Hello ' + userInfo.username

const image_input = document.querySelector("#image_input");
image_input.addEventListener("change", function () {
   const reader = new FileReader();
   reader.addEventListener("load", () => {
      const uploaded_image = reader.result;
      document.querySelector("#display_image").style.backgroundImage = `url(${uploaded_image})`;
   });
   reader.readAsDataURL(this.files[0]);
});
      // Confirm button 
document.querySelector('.confirm').addEventListener('click', e => {
   e.preventDefault()
   let file = document.getElementById('image_input').files[0]
   let formdata = new FormData();
   Object.defineProperty(file, 'name', {
      writable: true,
      value: userInfo.username
   });
   formdata.append("image", file);

   fetch("http://localhost:3300/uploadPicture", {
      method: 'POST',
      body: formdata
   })
      .then(response => response.text())
      .then(result => {
         if (result.endsWith('.jpg') || result.endsWith('.png') || result.endsWith('.jpeg') || result.endsWith('.jfif')) {
            document.querySelector('.onErrorImage').classList.add('d-none')
            resetUser(result)
            sendData(result)
         }
         else {
            document.querySelector('.onErrorImage').classList.remove('d-none')
         }
      })
      .catch(error => console.log('error', error))

})

async function sendData(x) {
   body = {
      username: userInfo.username,
      picture: x
   }
   await fetch("http://localhost:3300/uploadPicture", {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
   })
      .then(response => response.json())
      .then(result => {
         deletePictureAfterNewIsUploaded(result[0].picture)
      })
}

if (userInfo.picture != '') {
   document.getElementById('display_image').style.backgroundImage = `url(images/${userInfo.picture})`
}

function resetUser(y) {
   let resetUserInfo = {
      username: userInfo.username,
      adminPrivileges: userInfo.adminPrivileges,
      picture: y
   }
   localStorage.clear();
   localStorage.setItem('userInfo', JSON.stringify(resetUserInfo));
}


function deletePictureAfterNewIsUploaded(x) {
   let body = { picture: x }
   fetch("http://localhost:3300/uploadPicture", {
      method: 'DELETE',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
   })
}
//Logout click
document.addEventListener('DOMContentLoaded', function () {
   document.querySelector('.logoutButton').addEventListener('click', e => {
      localStorage.clear();
   })
})