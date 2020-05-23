var i = 0;

var items = [];
var ids = [];

function init() {
  var url = 'http://127.0.0.1:3000/items';
  fetch(url, {mode: 'cors'})
    .then(response => response.json())
    .then(data => {
    var n = data.length;
    items = [];
    ids = [];
    for (var j = 0; j < n; j++) {
      items.push(data[j]);
      ids.push(data[j].id);
    }
    initializeList();
    calculateTotal();
  })
    .catch(error => console.error(error));
}

function initializeList() {
  var n = items.length;
  for (var j = 0; j < n; j++) {
    insertItem(items[j].type, items[j]);
  }
}

function updateId() {
  i = 1;
  while (checkDuplicatedId()) {
    i++;
  }
}

function checkDuplicatedId() {
  var duplicatedId = false;
  var n = ids.length;
  for (var j = 0; j < n; j++) {
    if (i === ids[j]) {
      duplicatedId = true;
      break;
    }
  }
  return duplicatedId;
}

function insertItem(itemType, myItem = {}) {
  var node = document.createElement("li");
  var divNode = document.createElement("div");

  var istr;
  var initialItem = false;
  
  if (Object.entries(myItem).length === 0) {
    updateId();
    initialItem = false;
    istr = i.toString();
    ids.push(i);
  } else {
    initialItem = true;
    istr = myItem.id.toString();
    ids.push(myItem.id);
  }

  var label;

  label = document.createTextNode("id: ");
  var idNode = document.createTextNode(istr);

  divNode.appendChild(label);
  divNode.appendChild(idNode);

  label = document.createTextNode(" Type: ");
  var typeNode = document.createElement("p");
  typeNode.setAttribute("id", "itemType" + istr);
  typeNode.setAttribute("style", "display:inline;");
  if (itemType === "Assets" || itemType === "assets") {
    typeNode.innerHTML = "Assets";
  } else if (itemType === "Liabilities" || itemType === "liabilities") {
    typeNode.innerHTML = "Liabilities";
  } else {
    typeNode.innerHTML = "Others";
  }
  divNode.appendChild(label);
  divNode.appendChild(typeNode);

  label = document.createTextNode(" Term: ");
  var termNode = document.createElement("select");
  termNode.setAttribute("id", "itemTerm" + istr);
  var optionNode1 = document.createElement("option");
  optionNode1.setAttribute("value", "short");
  optionNode1.innerHTML = "Short";
  termNode.appendChild(optionNode1);
  var optionNode2 = document.createElement("option");
  optionNode2.setAttribute("value", "long");
  optionNode2.innerHTML = "Long";
  termNode.appendChild(optionNode2);
  
  if (initialItem) {
    termNode.value = myItem.term;
  }

  divNode.appendChild(label);
  divNode.appendChild(termNode);

  label = document.createTextNode(" Title: ");
  var titleNode = document.createElement("input");
  titleNode.setAttribute("id", "itemTitle" + istr);

  if (initialItem) {
    titleNode.value = myItem.title;
  }
  
  divNode.appendChild(label);
  divNode.appendChild(titleNode);

  label = document.createTextNode(" Amount: ");
  var amountNode = document.createElement("input");
  amountNode.setAttribute("id", "itemAmount" + istr);

  if (initialItem) {
    amountNode.value = myItem.amount;
  }
  
  divNode.appendChild(label);
  divNode.appendChild(amountNode)

  label = document.createTextNode(" Currency: ");
  var currencyNode = document.createElement("select");
  currencyNode.setAttribute("id", "itemCurrency" + istr);
  var currencyOption1 = document.createElement("option");
  currencyOption1.setAttribute("value", "CAD");
  currencyOption1.innerHTML = "CAD";
  currencyNode.appendChild(currencyOption1);
  
  if (initialItem) {
    currencyNode.value = myItem.currency;
  }

  divNode.appendChild(label);
  divNode.appendChild(currencyNode);

  label = document.createTextNode(" Status: ");
  var statusNode = document.createElement("select");
  statusNode.setAttribute("id", "itemStatus" + istr);
  var statusOption1 = document.createElement("option");
  statusOption1.setAttribute("value", "current");
  statusOption1.innerHTML = "Current";
  statusNode.appendChild(statusOption1);
  var statusOption2 = document.createElement("option");
  statusOption2.setAttribute("value", "voided");
  statusOption2.innerHTML = "Voided";
  statusNode.appendChild(statusOption2);
  
  if (initialItem) {
    statusNode.value = myItem.status;
  }

  divNode.appendChild(label);
  divNode.appendChild(statusNode);

  var saveBtnNode = document.createElement("BUTTON");
  saveBtnNode.setAttribute("id", "saveBtn" + istr);
  saveBtnNode.setAttribute("onclick", "saveItem(" + istr + ");");
  saveBtnNode.innerHTML = "Save";

  divNode.appendChild(saveBtnNode);

  node.appendChild(divNode);

  if (itemType === "Assets" || itemType === "assets") {
    document.getElementById("myAssets").appendChild(node);
  } else if (itemType === "Liabilities" || itemType === "liabilities") {
    document.getElementById("myLiabilities").appendChild(node);
  } else {
    document.getElementById("myOthers").appendChild(node);
  }
}

function saveItem(itemId) {
  var e;

  var itemType = document.getElementById("itemType" + itemId).innerHTML.toLowerCase();

  var e = document.getElementById("itemTerm" + itemId);
  var itemTerm = e.options[e.selectedIndex].text.toLowerCase();

  var itemTitle = document.getElementById("itemTitle" + itemId).value;

  var itemAmount = parseFloat(document.getElementById("itemAmount" + itemId).value) + 0;

  e = document.getElementById("itemCurrency" + itemId);
  var itemCurrency = e.options[e.selectedIndex].text

  e = document.getElementById("itemStatus" + itemId);
  var itemStatus = e.options[e.selectedIndex].text.toLowerCase();

  if (itemTitle == "") {
    alert("Please enter a title (id -> " + itemId + ")");
  } else if (isNaN(itemAmount)) {
    alert("Please enter a number (id -> " + itemId + ")");
  } else {
    var myItem = {
      id: itemId,
      type: itemType,
      term: itemTerm,
      title: itemTitle,
      amount: itemAmount,
      currency: itemCurrency,
      status: itemStatus
    };
    postRequest('http://127.0.0.1:3000/items', myItem)
      .then(data => {
      var n = items.length;
      var objectFound = false;
      
      for (var j = 0; j < n; j++) {
        if (data.id === items[j].id) {
          objectFound = true;
          items[j] = data;
          break;
        }
      }
      
      if (!objectFound) {
        items.push(data);
      }
      
      console.log(items);
      calculateTotal();
    })
      .catch(error => console.error(error));
  }
}

function postRequest(url, data) {
  return fetch(url, {
    credentials: 'same-origin',
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
  })
    .then(response => response.json());
}

function calculateTotal() {
  var totalAssets = 0;
  var totalLiabilities = 0;
  var totalOthers = 0;
  
  var n = items.length;
  var myItem;
  
  for (var j = 0; j < n; j++) {
    myItem = items[j];
    if ((myItem.type === "assets") && (myItem.status === "current")) {
      totalAssets += myItem.amount;
    } else if ((myItem.type === "liabilities") && (myItem.status === "current")) {
      totalLiabilities += myItem.amount;
    } else if ((myItem.type === "others") && (myItem.status === "current")) {
      totalOthers += myItem.amount;
    }
  }
  
  document.getElementById("myTotalAssets").innerHTML = totalAssets;
  document.getElementById("myTotalLiabilities").innerHTML = totalLiabilities;
  document.getElementById("myTotalOthers").innerHTML = totalOthers;
  
  document.getElementById("myTotalOwned").innerHTML = totalAssets - totalLiabilities + totalOthers;
}

window.onload = init();