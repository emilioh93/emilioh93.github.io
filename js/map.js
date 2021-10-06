import dataExpLab from "../json/expLab.json" assert { type: "json" };
import dataWorkExp from "../json/workExp.json" assert { type: "json" };
import dataPortES from "../json/portES.json" assert { type: "json" };

const expLab = dataExpLab;
const workExp = dataWorkExp;
const portES = dataPortES;

const mapExpLab = expLab?.map((e) => {
  return `
    <article class="card shadow">
      <div class="row no-gutters">
        <div class="col-md-4 bgCardsExpLab text-light d-flex flex-column justify-content-center align-items-center pt-3">
        <p><img src=${e.logo} alt=${e.empresa} class="logoEmpresa"> <span class="nombreEmpresa">${e.empresa}</span></p>
          <p>
            ${e.inicio} - ${e.fin}
          </p>
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${e.puesto}</h5>
            <p class="card-text">${e.descripcion}</p>
          </div>
        </div>
      </div>
    </article>`;
});
const mapWorkExp = workExp?.map((e) => {
  return `
    <article class="card shadow">
      <div class="row no-gutters">
        <div class="col-md-4 bgCardsExpLab text-light d-flex flex-column justify-content-center align-items-center pt-3">
        <p><img src=${e.logo} alt=${e.empresa} class="logoEmpresa"> <span class="nombreEmpresa">${e.empresa}</span></p>
          <p>
            ${e.inicio} - ${e.fin}
          </p>
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${e.puesto}</h5>
            <p class="card-text">${e.descripcion}</p>
          </div>
        </div>
      </div>
    </article>`;
});
const mapPortES = portES?.map((e, i) => {
  return `
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
    </article>`;
});

if (document.getElementById("expLabMap")) {
  document.getElementById("expLabMap").innerHTML = mapExpLab;
}
if (document.getElementById("workExpMap")) {
  document.getElementById("workExpMap").innerHTML = mapWorkExp;
}
