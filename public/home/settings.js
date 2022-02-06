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