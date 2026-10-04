//-------------------------1. osa Ostukorv ------------------------suurendaArtikkel

"use strict";
//toote pealt vajaliku info kogumine ja lisamine ostukorvi
let korv = [];
const korviSisu = document.querySelector(".korv");
const lisaKorviNupud = document.querySelectorAll('[data-action="lisa_korvi"]');
lisaKorviNupud.forEach(lisaKorviNupp => {
    lisaKorviNupp.addEventListener('click', () => {
        const toodeInfo = lisaKorviNupp.parentNode;
        const toode = {
            nimi: toodeInfo.querySelector(".toode_nimi").innerText,
            hind: toodeInfo.querySelector(".toode_hind").innerText,
            kogus: 1
        };
        const onKorvis = (korv.filter(korvArtikkel => (korvArtikkel.nimi === toode.nimi)).length > 0);
        if (!onKorvis) {
            lisaArtikkel(toode); // selle funktsiooni loome allpool
            korv.push(toode);
            nupuOhjamine(lisaKorviNupp, toode); // selle funktsiooni loome allpool
            arvutaKoguhind();
        }
    });
});

//funktsioon toote lisamiseks
function lisaArtikkel(toode) {
    korviSisu.insertAdjacentHTML('beforeend', `
    <div class="korv_artikkel">
      <h3 class="korv_artikkel_nimi">${toode.nimi}</h3>
      <h3 class="korv_artikkel_hind">${toode.hind}</h3>    
      <div class="korv_artikkel_buttons">  
      <button class="btn-small" data-action="vahenda_artikkel">&minus;</button>
      <h3 class="korv_artikkel_kogus">${toode.kogus}</h3>
      <button class="btn btn-small" data-action="suurenda_artikkel">&plus;</button>
      <button class="btn btn-small" data-action="eemalda_artikkel">&times;</button>
      </div>
    </div>
  `);

    lisaKorviJalus(); // selle funktsiooni lisame allpool
}

//funktsioon nupu sündmusekuulutaja jaoks
function nupuOhjamine(lisaKorviNupp, toode) {
    lisaKorviNupp.innerText = 'Ostukorvis';
    lisaKorviNupp.disabled = true;

    const korvArtiklidD = korviSisu.querySelectorAll('.korv_artikkel');
    korvArtiklidD.forEach(korvArtikkelD => {
        if (korvArtikkelD.querySelector('.korv_artikkel_nimi').innerText === toode.nimi) {
            korvArtikkelD.querySelector('[data-action="suurenda_artikkel"]').addEventListener('click', () => suurendaArtikkel(toode, korvArtikkelD));
            korvArtikkelD.querySelector('[data-action="vahenda_artikkel"]').addEventListener('click', () => decreaseItem(toode, korvArtikkelD, lisaKorviNupp));
            korvArtikkelD.querySelector('[data-action="eemalda_artikkel"]').addEventListener('click', () => eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp));
        }
    });
}

//toodete arvu suurendamine
function suurendaArtikkel(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            korvArtikkelD.querySelector(".korv_artikkel_kogus").innerText =
                ++korvArtikkel.kogus;
        }
    });

    arvutaKoguhind();
}

//Ülesanne 5.1: lisa funktsioon toodete hulga vähendamiseks.
function decreaseItem(toode, korvArtikkelD, lisaKorviNupp) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            korvArtikkel.kogus = korvArtikkel.kogus - 1;

            if (korvArtikkel.kogus > 0) {
                korvArtikkelD.querySelector(".korv_artikkel_kogus").innerText =
                    korvArtikkel.kogus;
            } else {
                eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp);
            }
        }
    });

    arvutaKoguhind();
}
//toodete eemaldamine ostukorvist
function eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
    korvArtikkelD.remove();

    korv = korv.filter(korvArtikkel =>
        korvArtikkel.nimi !== toode.nimi
    );

    lisaKorviNupp.innerText = 'Lisa ostukorvi';
    lisaKorviNupp.disabled = false;

    if (korv.length < 1) {
        document.querySelector('.korv-jalus').remove();
    }

    arvutaKoguhind();
}

//ostukorvi jaluse ehk alumiste nuppude lisamine
function lisaKorviJalus() {
    if (document.querySelector('.korv-jalus') === null) {
        korviSisu.insertAdjacentHTML('afterend', `
      <div class="korv-jalus">
        <button class="btn" data-action="tyhjenda_korv">Tühjenda ostukorv</button>
        <button class="btn" data-action="kassa">Maksma</button>
      </div>
    `);
        document.querySelector('[data-action="tyhjenda_korv"]').addEventListener('click', () => tuhjendaKorv());
        document.querySelector('[data-action="kassa"]').addEventListener('click', () => kassa());
    }
}

// ostukorvi tühjendamine
function tuhjendaKorv() {
    korviSisu.querySelectorAll('.korv_artikkel').forEach(korvArtikkelD => {
        korvArtikkelD.remove();
    });

    document.querySelector('.korv-jalus').remove();

    korv = [];

    lisaKorviNupud.forEach(lisaKorviNupp => {
        lisaKorviNupp.innerText = 'Lisa ostukorvi';
        lisaKorviNupp.disabled = false;
    });
}


//Ülesanne 5.2: lisa funktsioon, mis arvutab ostukorvi summa kokku.
function arvutaKoguhind() {
    let toodeteSumma = 0;
    let tarneHind = 0;

    korv.forEach(toode => {
        toodeteSumma = toodeteSumma + toode.hind * toode.kogus;
    });

    tarneNupud.forEach(tarneNupp => {
        if (tarneNupp.checked) {
            tarneHind = tarneNupp.value * 1;
        }
    });

    const maksmaNupp = document.querySelector('[data-action="kassa"]');

    if (maksmaNupp !== null) {
        maksmaNupp.innerText =
            "Maksma (" + (toodeteSumma + tarneHind) + " €)";
    }
}


//-------------------------2. osa Taimer ------------------------

//taimer
let taimeriIntervall;

function alustaTaimer(kestvus, kuva) {
    clearInterval(taimeriIntervall);

    let start = Date.now();

    function taimer() {
        let vahe = kestvus - Math.floor((Date.now() - start) / 1000);

        if (vahe < 0) {
            clearInterval(taimeriIntervall);
            kuva.innerHTML = "alusta uuesti";
        } else {
            let minutid = Math.floor(vahe / 60);
            let sekundid = Math.floor(vahe % 60);

            if (minutid < 10) {
                minutid = "0" + minutid;
            }

            if (sekundid < 10) {
                sekundid = "0" + sekundid;
            }

            kuva.textContent = minutid + ":" + sekundid;
        }
    }

    taimeriIntervall = setInterval(taimer, 1000);
    taimer();
}

// Taimer käivitub Maksma nupule vajutades
function kassa() {
    let taimeriAeg = 60 * 2;
    let kuva = document.getElementById("time");

    alustaTaimer(taimeriAeg, kuva);
}
;


//-------------------------3. osa Tarne vorm ------------------------

const form = document.querySelector("form");
const eesnimi = document.getElementById("eesnimi");
const perenimi = document.getElementById("perenimi");
const telefon = document.getElementById("telefon");

// minu kood
if (document.getElementById("linn") === null) {
    form.insertAdjacentHTML("beforeend", `
        <!-- minu kood -->
        <label for="linn">Linn:</label>
        <input type="text" id="linn" name="linn">
    `);
}

const linn = document.getElementById("linn");
const kinnitus = document.getElementById("kinnitus");

const errorMessage = document.getElementById("errorMessage");
const tarneNupud = form.querySelectorAll('input[type="radio"]');


// tarnemaksumused
tarneNupud[0].value = "3";
tarneNupud[1].value = "0";

tarneNupud.forEach(tarneNupp => {
    tarneNupp.addEventListener("click", () => {
        arvutaKoguhind();
    });
});

function sisaldabNumbrit(tekst) {
    let numberOlemas = false;

    for (let i = 0; i < tekst.length; i++) {
        if (tekst[i] >= "0" && tekst[i] <= "9") {
            numberOlemas = true;
        }
    }

    return numberOlemas;
}
function ainultNumbrid(tekst) {
    let koikNumbrid = true;

    for (let i = 0; i < tekst.length; i++) {
        if (tekst[i] < "0" || tekst[i] > "9") {
            koikNumbrid = false;
        }
    }

    return koikNumbrid;
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errors = [];

    if (eesnimi.value.trim() === "") {
    errors.push("Sisesta eesnimi");
} else if (sisaldabNumbrit(eesnimi.value)) {
    errors.push("Eesnimi ei tohi sisaldada numbreid");
}

    if (perenimi.value.trim() === "") {
    errors.push("Sisesta perenimi");
} else if (sisaldabNumbrit(perenimi.value)) {
    errors.push("Perenimi ei tohi sisaldada numbreid");

}
if (telefon.value.length < 6) {
    errors.push("Telefon peab sisaldama vähemalt 6 numbrit");
}

if (!ainultNumbrid(telefon.value)) {
    errors.push("Telefon võib sisaldada ainult numbreid");
}
// minu kood
if (linn.value.trim() === "") {
    errors.push("Sisesta linn");
}

    if (!kinnitus.checked) {
        errors.push("Palun nõustu tingimustega");
    }
let tarneValitud = false;

tarneNupud.forEach(tarneNupp => {
    if (tarneNupp.checked) {
        tarneValitud = true;
    }
});

if (!tarneValitud) {
    errors.push("Vali tarneviis");
}
    if (errors.length > 0) {
        e.preventDefault();
        errorMessage.innerHTML = errors.join(', ');
    }
    else {
        errorMessage.innerHTML = "";

    }

})

/* Ülesanne 5.3: täienda vormi sisendi kontrolli:
- eesnime ja perenime väljal ei tohi olla numbreid;
- telefoni väli ei tohi olla lühem kui 6 sümbolit ning peab sisaldama ainult numbreid;
- üks raadionuppudest peab olema valitud;
- lisa oma valikul üks lisaväli ning sellele kontroll. Märgi see nii HTML kui JavaScripti
  koodis "minu kood" kommentaariga. */
