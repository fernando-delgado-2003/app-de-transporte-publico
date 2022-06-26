 let iconCountries = document.querySelector(".icon-countries"),
 	iconState = document.querySelector(".icon-state"),
 	iconCity = document.querySelector(".icon-city");


 function authToken() {
 	let $formLocation = document.getElementById("form-location");
 	toggleIconSelect(iconCountries, true, "countries")

 	fetch("https://www.universal-tutorial.com/api/getaccesstoken",
 		{
 			method: "GET",
 			headers: {
 				"Accept": "application/json",
 				"api-token": "RI5mMqTI3Fs8VHjbgsDapnYshiV39Yt_ym0PPoy73YFCI_L0cgd1Ya_1spSuDZ5hTbA",
 				"user-email": "fernanbravo124@gmail.com"
 			}
 		})
 		.then(response => response.json())
 		.then(token => {
 			getCountries(token.auth_token);

 			$formLocation.querySelector("#countries").addEventListener("change", e => {
 				let dataFormLocation = new FormData($formLocation),
 					optionSelect = dataFormLocation.get("countries");
 				getState(token.auth_token, optionSelect)

 			})

 			$formLocation.querySelector("#state").addEventListener("change", e => {
 				let dataFormLocation = new FormData($formLocation);
 				if (dataFormLocation.get("state") != "default") {
 					getCity(token.auth_token, dataFormLocation.get("state"))
 				}
 			})


 		})
 		.catch(error => {
 			toggleIconSelect(iconCountries, false, "countries")
 		})

 }




 function getCountries(token) {

 	fetch("https://www.universal-tutorial.com/api/countries/", {
 			method: "GET",
 			headers: {
 				"Authorization": `Bearer ${token}`,
 				"Accept": "application/json"
 			}
 		})
 		.then(response => response.json())
 		.then(countries => {
 			screenCountries(countries);
 			toggleIconSelect(iconCountries, true, "countries")
 		})
 		.catch(error => {
 			toggleIconSelect(iconCountries, false, "countries")
 		})
 }


 function screenCountries(countries) {
 	let templateOption = "";
 	for (let i = 0; i < countries.length; i++) {
 		if (i == 0) {
 			templateOption += `
			<option value="default">Seleccione su país</option>
 		`;
 		}
 		templateOption += `
			<option value="${countries[i].country_name}">${countries[i].country_name}</option>
 		`;
 	}
 	document.getElementById("countries").innerHTML = templateOption;
 	templateOption = "";
 }


 function getState(token, optionSelect) {
 	toggleIconSelect(iconState, true, "state")
 	fetch(`https://www.universal-tutorial.com/api/states/${optionSelect}`, {
 			method: "GET",
 			headers: {
 				"Authorization": `Bearer ${token}`,
 				"Accept": "application/json"
 			}
 		})
 		.then(response => response.json())
 		.then(state => {

 			screenState(state)
 			toggleIconSelect(iconState, true, "state")

 		})
 		.catch(error => {
 			toggleIconSelect(iconState, false, "state")

 		})
 }

 function screenState(state) {
 	let templateOption = "";
 	for (let i = 0; i < state.length; i++) {
 		if (i == 0) {
 			templateOption += `
			<option value="default">Seleccione su estado</option>
 		`;
 		}

 		templateOption += `
			<option value="${state[i].state_name}">${state[i].state_name}</option>
 		`;
 	}
 	document.getElementById("state").innerHTML = templateOption;
 }


 function getCity(token, optionSelect) {
 	toggleIconSelect(iconCity, true, "city");
 	fetch(`https://www.universal-tutorial.com/api/cities/${optionSelect}`, {
 			method: "GET",
 			headers: {
 				"Authorization": `Bearer ${token}`,
 				"Accept": "application/json"
 			}
 		})
 		.then(response => response.json())
 		.then(city => {
 			screenCity(city)
 			toggleIconSelect(iconCity, true, "city");
 		})
 		.catch(error => {
 			toggleIconSelect(iconCity, false, "city");

 		})
 }

 function screenCity(city) {
 	let templateOption = "";
 	if (city.length == 0) {
 		templateOption += `
			<option value="null">No encontramos cuidades</option>
 		`;
 	}
 	for (let i = 0; i < city.length; i++) {
 		if (i == 0) {
 			templateOption += `
			<option value="default">Seleccione su ciudad</option>
 		`;
 		}

 		templateOption += `
			<option value="${city[i].city_name}">${city[i].city_name}</option>
 		`;
 	}
 	document.getElementById("city").innerHTML = templateOption;
 }

 function toggleIconSelect(icon, status, type) {

 	if (status == true) {

 		if (icon.classList.contains("bxs-down-arrow")) {
 			icon.setAttribute("class", `bx bx-loader icon-${type}`)
 		} else if (icon.classList.contains("bx-loader")) {
 			icon.setAttribute("class", `bx bxs-down-arrow icon-${type}`)
 		} else if (icon.classList.contains("bxs-error-alt")) {
 			icon.setAttribute("class", `bx bx-loader icon-${type}`)
 		}
 	} else {
 		icon.setAttribute("class", `bx bxs-error-alt icon-${type}`)
 	}
 }



 function eliminarDiacriticosEs(texto) {
 	return texto
 		.normalize('NFD')
 		.replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, "$1")
 		.normalize();
 };



 
 export { authToken, getState, eliminarDiacriticosEs}

