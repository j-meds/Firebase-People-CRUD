var firebase = "https://jquery.firebaseio.com/";
var people = [];

var person = function(pName, pAge,pCity){
	this.pName = pName;
	this.pAge = pAge;
	this.pCity = pCity;
	this._id = null;
};
function createPerson(){
	var pName = document.getElementById("name");
	var pAge = document.getElementById("age");
	var pCity = document.getElementById("city");
	var nPerson = new person(pName.value,pAge.value,pCity.value);
	postPerson(nPerson);
	pName.value ='';pAge.value ='';pCity.value ='';
}
function postPerson(nPerson){
	var req = new XMLHttpRequest();
	req.open("POST", firebase + ".json", true);
	req.onload = function(cmovie){
	if(this.status >= 200 && this.status<400){
		var res = JSON.parse(this.response);
		nPerson._id = res.name;
		people.push(nPerson);
		read();
	}
}
	req.send(JSON.stringify(nPerson));
};
function read(){
	document.getElementById("list").innerHTML = "";
	var result = "";
	for(var i=0;i<people.length;i++){
		result +="<h4>" +  people[i].pName + "<button class='btn btn-danger' onclick='deletePerson("+ i +")'>" +
		"Delete</button><button class='btn btn-warning' onclick='updateStart("+ i +")'>Edit</button></h4><p>" +
		people[i].pAge + "</p><p>" + people[i].pCity + "</p>"
	}
	document.getElementById("list").innerHTML = result;
}
  

function getPeople(){
	document.getElementById("list").innerHTML = "";
	var req = new XMLHttpRequest();

	req.open("get", firebase + ".json", true);

	req.onload = function(){
	if(this.status >= 200 && this.status<400){
		var res = JSON.parse(this.response);
		people = [];
		for(var prop in res){
			res[prop]._id = prop;
			people.push(res[prop]);
		}read();
	}
};
	req.send();
}

function deletePerson(i){
	var req = new XMLHttpRequest();
	req.open("DELETE",firebase + people[i]._id + "/.json");
	req.onload = function(){
	if(this.status >=200 && this.status <400){
		people.splice(i,1);
		read();
	}
else{console.log("Error: Can not delete")};
}
req.send();
}

function updateStart(i){
	document.getElementById("edits").innerHTML = "";
	document.getElementById("edits").innerHTML =
	'<input type="text" id="editName" value= '+ people[i].pName +' placeholder= "Name" />' +
	'<input type="text" id="editAge" value= '+ people[i].pAge +' placeholder= "Age" />' +
	'<input type="text" id="editCity" value= '+ people[i].pCity +' placeholder= "City" />' +
	'<button onclick="updateFinish('+ i +')">Submit Edit</button> ';
}

function updateFinish(i){
	var req = new XMLHttpRequest();
	req.open("put", firebase + people[i]._id  +"/.json", true);
	req.onload = function(){
		if(this.status >= 200 && this.status <400){

				document.getElementById('edits').innerHTML = "";
      			document.getElementById('list').innerHTML = "";
      			getPeople();
      			read();
	}
		else {console.log("Error Cannot start Update")};
	}
	var updatedPerson = {
		pName: document.getElementById("editName").value,
		pAge: document.getElementById("editAge").value,
		pCity: document.getElementById("editCity").value
	};
req.send(JSON.stringify(updatedPerson));
}

getPeople();
read();