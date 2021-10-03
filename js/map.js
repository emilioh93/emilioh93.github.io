import dataExpLab from "../json/expLab.json" assert { type: "json" };
import dataPortES from "../json/portES.json" assert { type: "json" };

const expLab = dataExpLab;
const portES = dataPortES;

const mapExpLab = expLab?.mapExpLab((e,i) => {
  return (`
    <article key={i} class="card shadow">
      <div class="row no-gutters">
        <div class="col-md-4 bgCardsExpLab text-light d-flex flex-column justify-content-center align-items-center pt-3">
          <p>
            ${e.inicio} - ${e.fin}
          </p>
          <p>${e.empresa}</p>
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${e.puesto}</h5>
            <p class="card-text">${e.descripcion}</p>
          </div>
        </div>
      </div>
    </article>`) 
});
const mapPortES = portES?.map((e,i) => {
  return (`
    <article key={i} class="card shadow">
      <div class="row no-gutters">
        <div class="col-md-4 bgCardsExpLab text-light d-flex flex-column justify-content-center align-items-center pt-3">
          <p>
            ${e.inicio} - ${e.fin}
          </p>
          <p>${e.empresa}</p>
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${e.puesto}</h5>
            <p class="card-text">${e.descripcion}</p>
          </div>
        </div>
      </div>
    </article>`) 
});

document.getElementById("expLabMap").innerHTML = mapExpLab;
