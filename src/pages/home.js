export function renderHome() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <h2 class="section-title">Welcome to the Virtual Museum</h2>
    <div id="home-featured">
      <img src="/sunflowers.jpg" alt="Sunflowers" class="home-img">
      <h3 class="home-title">Sunflowers</h3>
      <p class="home-artist">Vincent van Gogh</p>
    </div>
  `;
}
