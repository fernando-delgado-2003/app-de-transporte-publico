
  import { authToken, eliminarDiacriticosEs } from "../modules/modules.js"
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
  import { collection, where, query, getDocs, orderBy, doc, getDoc, getFirestore } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";

  authToken()

  // https://firebase.google.com/docs/web/setup#available-libraries

  const firebaseConfig = {
  	apiKey: "AIzaSyDamHXiL35miZD72mkd-KacmLl06O8W7rA",
  	authDomain: "transport-d589a.firebaseapp.com",
  	projectId: "transport-d589a",
  	storageBucket: "transport-d589a.appspot.com",
  	messagingSenderId: "487444187066",
  	appId: "1:487444187066:web:7244ea31dc3cb937567f83"
  };

  const app = initializeApp(firebaseConfig),
  	db = getFirestore(app),
  	$formLocationManual = document.getElementById("form-location-manual"),
  	$formLocation = document.getElementById("form-location");

  toggleCheckForm()


  $formLocationManual.addEventListener("submit", (e) => {
  	e.preventDefault()
  	let dataForm = new FormData($formLocation),
  		dataFormManual = new FormData($formLocationManual),
  		object = {};

  	if ($formLocation.classList.contains("advanced-search")) {
  		dataForm.forEach((value, key) => object[key] = eliminarDiacriticosEs(value).toLowerCase().trim());

  	}
  	dataFormManual.forEach((value, key) => object[key] = eliminarDiacriticosEs(value).toLowerCase().trim());

  	let json = JSON.stringify(object);
  	json = JSON.parse(json);
  	getTransportForSearch(json);

  });


  async function getTransportForSearch(dataForm) {
  	/*	
  		const refColection = collection(db,`countries/mexico/state/quintana roo/city/`);
  		
  		const snap = await getDocs(refColection);
  		
  		snap.forEach(doc=>{
  			console.log(doc.id)
  		})
  		*/

  	if ($formLocation.classList.contains("advanced-search") && dataForm.countries != "default" && dataForm.state != "default" && dataForm.cityManual != " " && dataForm.cityManual != "") {
  		$formLocationManual.querySelector("button").setAttribute("disabled", "true")
  		document.querySelector(".cards").classList.add("searching");
  		let docRef = doc(db, `countries/${dataForm.countries}/state/${dataForm.state}/city/${dataForm.cityManual}`),
  			data = await getDoc(docRef);
  	
  		if (data.exists()) {
  			screenCard(data, dataForm)
  		}else{
  			  			$formLocationManual.querySelector("button").removeAttribute("disabled")

  			document.querySelector(".cards").classList.remove("searching");
  		}
  		
  	} else {
  		document.querySelector(".cards").classList.add("searching");

  		$formLocationManual.querySelector("button").setAttribute("disabled", "true")
  		let docRef = doc(db, `basic/${dataForm.cityManual}`),
  			data = await getDoc(docRef);
  		if (data.exists()) {
  			docRef = doc(db, `${data.data().routeFirebase}/city/${dataForm.cityManual}`);
  			data = await getDoc(docRef);


  			if (data.exists()) {
  				dataForm.countries = dataForm.cityManual;
  				screenCard(data, dataForm);
  			}


  		} else {
  			document.querySelector(".cards").classList.remove("searching")
  			$formLocationManual.querySelector("button").removeAttribute("disabled")

  		}

  	}

  }

  function screenCard(data, dataForm) {
  	let jsonCard = {},
  		templateCard = "",
  		templateCardUl = "";
  	let places = data.data().places,
  		routes = data.data().routes;

  	for (let claveRoute in routes) {
  		if (claveRoute != undefined) {

  			jsonCard.route = claveRoute;
  			jsonCard.type = routes[claveRoute].type;
  			jsonCard.color = routes[claveRoute].color;
  			for (let clavePlace in places) {
  				let arrayRoutePlace = places[clavePlace].route;
  				if (places[clavePlace].route != undefined) {
  					for (let i = 0; i < arrayRoutePlace.length; i++) {
  						if (arrayRoutePlace[i].number == claveRoute) {
  							templateCardUl += `
  									<li>${clavePlace.charAt(0).toUpperCase() + clavePlace.slice(1)}</li>
  								`;
  						}
  					}
  				}

  			}
  			templateCard += `
  		<div class="card">
				<div class="wrap-tool-tip">
					<div class="btn-tool-tip">
						<i class='bx bx-error-circle' ></i>
						<p class="note">Ver imagen genérica</p>
					</div>
					<div class="generic-img tool-tip" >
						<img src="../assets/img/${jsonCard.type == "combie" ? "combie-generica" : "camion-generico" }.jpeg" alt="">
						<p class="note">Esta imagen no representa la apariencia final del transporte, pero es similar</p>
					</div>
				</div>
				<p class="route"><span>Ruta</span> ${jsonCard.route}</p>
				<div class="wrap-img">
					<img src="../assets/img/${jsonCard.type == "combie" ? "camioneta" :"transporte-publico"}.png" alt="">
					<p class="sub-title">Transporte publico, ${dataForm.countries}</p>
				</div>
				<p class="type">Tipo: ${jsonCard.type}, color: ${jsonCard.color}</p>
				<ul class="punts">
					<li><strong>Puntos de llegada</strong></li>
					<ul>
						${templateCardUl}
					</ul>
				</ul>
				<p class="note">Tenga en cuenta que los puntos llegada, es casi seguro que se pueden como puntos para tomar el transporte</p>
			</div>

  				`;
  			templateCardUl = "";

  		}
  	}
  	document.querySelector(".cards").classList.remove("searching")
  	document.querySelector(".cards").innerHTML = templateCard;
  	setTimeout(() => {
  		$formLocationManual.querySelector("button").removeAttribute("disabled")
  	}, 1000)
  }

  function toggleCheckForm() {
  	document.getElementById("check-form").addEventListener("click", () => {
  		if ($formLocation.classList.contains("advanced-search")) {
  			$formLocation.querySelector("i").setAttribute("class", "bx bx-square")
  			$formLocation.classList.remove("advanced-search");
  		} else {
  			$formLocation.querySelector("i").setAttribute("class", "bx bx-checkbox-checked")
  			$formLocation.classList.add("advanced-search");
  		}
  	})
  }
