
//NOTE THAT FOR THIS PARTICULAR CANVAS SET, GETGMT function HAS A FALLBACK FOR JSON 24 TO GET
//A JSON FILE THAT IS TOO BIG FOR PHP TO HANDLE.

	function getScoreBoard(){

		d3.select("table#scoreboard").remove();
		var xmlhttp = createXMLhttp();
			
		xmlhttp.open("GET","getScoreboard.php", false);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send();	
		
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
		
			var json = JSON.parse(xmlhttp.responseText);
			showScore = json
			var scoreboard = d3.select("#scoreboard").append("table").attr("id", "scoreboard").style("width", "201px");
			scoreboard.append("tr").selectAll("th").data(["Name", "Score"])
						.enter().append("th").text(function(d){return d});
						
			for (var jsonRow = 0; jsonRow < json.length; jsonRow++){
				var jRow = scoreboard.append("tr").attr("id", "rank" + json[jsonRow][0]);
				jRow.selectAll("td").data(json[jsonRow]).enter().append("td").text(function(d){return d});
			
			
			}
						
		}
		
		else {
			getScoreBoard();
		}
	}
	
	function scoreBoardMod(score){
		var name = window.prompt("Please Insert Your Name","");
		if (name != "" && name != null)
		{
			modifyScoreBoard(score, name);
			document.getElementById("scoreboardButton").disabled = true;
		}
	
	}
	
	
	function modifyScoreBoard(score, name){
		
		var xmlhttp = createXMLhttp();
			
		xmlhttp.open("POST","modifyScoreboard.php", false);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send("score=" + score + "&name=" + name);

		
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
		
			var json = JSON.parse(xmlhttp.responseText);
			d3.selectAll("table#scoreboard").remove();

			showScore = json;
			var scoreboard = d3.select("#scoreboard").append("table").attr("id", "scoreboard").style("width", "201px");
			scoreboard.append("tr").selectAll("th").data(["Name", "Score"])
						.enter().append("th").text(function(d){return d});
						
			for (var jsonRow = 0; jsonRow < json.length - 1; jsonRow++){
				var jRow = scoreboard.append("tr").attr("id", "rank" + json[jsonRow][0]);
				jRow.selectAll("td").data(json[jsonRow]).enter().append("td").text(function(d){return d});
			}


			window.alert("Congratulations! Your N2C ranking is " + json[json.length - 1] + ".");
		}
		else {
			modifyScoreBoard(score, name);
			console.log("repeated modifyScoreboard");
		}
	
	
	
	
	
	
	
	}
	
	
	
	function initializeIt(json){

			var weights = json['weights'];
			var textArray = json['texts'];

			// Main function.	
			G_VAR = {	
						names: textArray,
						nodes: [],  // nodes Container
						width: Math.sqrt(weights.length),
						canvasSize: 275,
						scale: 1,
						canvasRGB : [0, 255, 255],
						indicatorColor: [255, 255, 255],
						avgWeight : 0,
						scaleZoom: 1,
						translateZoom: [0,0], 
						infoDict: {},
						infos: {},
						randomArray: [],
						reverseInfos: {}
					}

			for (var i = 0; i < weights.length; i++){
				var node = new NodeObj(i, weights[i], textArray[i]);
				G_VAR.avgWeight += weights[i] / weights.length / 8;
				G_VAR.nodes.push(node);
			}


			//Index dict
			G_VAR.reverseDict = {};
			for (var i = 0; i < G_VAR.nodes.length; i++){
				if (G_VAR.reverseDict[G_VAR.nodes[i].searchText]){
					G_VAR.reverseDict[G_VAR.nodes[i].searchText].push(i);
				} else {
				
					G_VAR.reverseDict[G_VAR.nodes[i].searchText] = [i];
				}
				
			}
			myVar = undefined;
			return G_VAR;
		}

		function infoDictMaker(infos){
			// Creates a dictionary from the GMT Files inputted
			// The dictionary counts how many times an element appears in the file.
			infoDict = {};
			for (var line in infos){
				elements = infos[line];
				for (var i = 0; i < elements.length; i++){
					if (elements[i].toUpperCase() in infoDict){
						infoDict[elements[i].toUpperCase()].push(line);
					} else {
						infoDict[elements[i].toUpperCase()] = [line];
					} 
				}
			}

			return infoDict;
		}
		

		
		
	function clearTextArea(textArea){
		// Clears the textArea upon first click.
		// Will not clear after the first click.

		textArea.value = "";
		textArea.onfocus = "";
	}

	
	//--------------------------
	// Create Name Array + Choose Random Genes
	//--------------------------
	function changeLevel(sI)
	{
		if (sI == 1)
		{
			var options = {"11": "OMIM Diseases", "10": "Target Scan - MicroRNAs", "13": "Reactome Pathways", "22": "OMIM Diseases Expanded", "25": "VirusMINT - Virus-Host Interactions", "30": "NCI-60 Cancer Cell Line", "28": "Mouse Gene Atlas", "26": "Human Gene Atlas"};
		} else if (sI == 2)
		{		
			var options = {"8": "KEGG Pathways", "3": "Chip-X Enrichment Analysis (ChEA)", "12": "PFAM Interpro - Protein Domains", "14": "WikiPathways", "6": "Gene Ontology Cellular Components"};
		} else if (sI == 3)
		{
			var options = {"24": "JASPAR + Transfac PWM", "23": "PPI Hub Proteins", "29": "Cancer Cell Line Encyclopedia", "1": "Kinase Enrichment Analysis (KEA)", "4": "Biocarta Pathways", "7": "Gene Ontology Molecular Function", "9": "MGI - Mammalian Phenotype - Top 4"};

		} else if (sI == 4)
		{
			var options = {"27": "Human Endogenous Complex", "17": "UCSC GenomeBrowser PWM", "33": "Down-Regulated CMAP Top 100", "32": "Up-Regulated CMAP Top 100", "31": "GeneSigDB", "35": "HMDB Metabolites", "34": "CORUM", "5": "Gene Ontology Biological Processes"};
		} else
		{
			console.log("What is going on>?? - This is Error")
			return
		}
		
		d3.select("#selectCanvas").selectedIndex = 0;
		d3.select("#selectCanvas").selectAll("option").remove();

		d3.select("#selectCanvas").append("option")
			.attr("value", "x")
			.text("2. Choose a Canvas");
		for (var index in options)
		{
			d3.select("#selectCanvas").append("option")
						.attr("value", index)
						.text(options[index]);
		}

		document.getElementById("selectCanvas").disabled = false;

	}


	function getTerms()
	{	
		d3.selectAll("#pvalueSVG").remove();
		d3.selectAll("#GSEElement1").remove();
		d3.selectAll(".GSE").remove();
		document.getElementById("selectionDisplay3").innerHTML = ""
		document.getElementById("timer").innerHTML = "";
		d3.select("#submitButton").attr("disabled", "disabled");

		if (typeof myVar != 'undefined')
		{
			clearInterval(myVar);
			myVar = undefined;
		}
		var x = 10;
		var randomArray = G_VAR.nodeNames; 
					
		for (var i = 1; i <=x ; i++){
			q = Math.floor(Math.random() * randomArray.length)
			swap = randomArray[randomArray.length - i];
			randomArray[randomArray.length - i] = randomArray[q];
			randomArray[q] = swap;
		}

		var randomNodeList = randomArray.slice(randomArray.length - x);

		var GSE = d3.select("#enrichmentResults").append("div").attr("class", "GSE").attr("id", "GSE")


			baseTable = GSE.append("table").attr("id", "GSEElement1").attr("class", "contain");
			for (var i = 0; i < randomNodeList.length; i++){
				var tableRow = baseTable.append("tr").attr("id", "pvalueRow" + i).style("color", "rgb(0,0,0)");
				tableRow.append("td").text(randomNodeList[i]);

			}		
			
			
		displayOutput(2);
		pvalueCanvas(randomNodeList);
		document.getElementById("pvalueCanvas").checked = true;
		selectAlternateView();

		gameStart();
	}

	function pleaseWait(count, target, attribute){
		if (count%4 == 0){
			dots =" ";
		} else if (count%4 == 1 ) {
			dots = " .";
		} else if (count%4 == 2) { 
			dots = " . .";
		} else {
			dots = " . . .";
		}
		
		if (attribute == "value"){
			document.getElementById(target).value = "Getting GMT File. Please wait" + dots; 
		} else if (attribute == "innerHTML") {
			document.getElementById(target).innerHTML = "Getting GMT File. Please wait" + dots; 
		}
	}
	//--------------------------
	// Bright Color Wheel
	//--------------------------

	function colorWheel(pixels, target, modify, startColor){
		// Generates the bright color wheel as darker colors are not that useful
		// on the canvas. 
		var sqrt3 = Math.sqrt(3);
		
		var rows = [
			[[0, 255, 255], [51, 204, 255], [51, 153, 255], [102, 153, 255]],
			[[102, 255, 204], [102, 255, 255], [102, 204, 255], [153, 204, 255], [153, 153, 255]],
			[[102, 255, 153], [153, 255, 204], [204, 255, 255], [204, 204, 255], [204, 153, 255], [204, 102, 255]],
			[[102, 255, 102], [153, 255, 153], [204, 255, 204], [255, 255, 255], [255, 204, 255], [255, 153, 255], [255, 102, 255]],
			[[153, 255, 102], [204, 255, 153], [255, 255, 204], [255, 204, 204], [255, 153, 204], [255, 102, 204]],
			[[204, 255, 102], [255, 255, 153], [255, 204, 153], [255, 153, 153], [255, 102, 153]],
			[[255, 255, 102], [255, 204, 102], [255, 153, 102], [255, 102, 102]]
			]
		var svg = d3.select(target).append("svg:svg").attr("height", 7 * pixels * sqrt3).attr("width", 7 * pixels * sqrt3);
		var mid = Math.floor(rows.length/2);

		for (var r = 0; r < rows.length; r++){
			var shift = Math.abs(mid - r);
			for (var hex = 0; hex < rows[r].length; hex++){
				var columnOrigin = sqrt3 * shift / 2 * pixels + hex * sqrt3 * pixels
				var rowOrigin = pixels / 2 + ((r+1) * 1.5 * pixels);
				var up = pixels/2;
				var right = sqrt3*pixels/2;
				var path = ["M", columnOrigin, rowOrigin, 
							"l", right, up, 
							"l",  right, -up, 
							"l", 0, -pixels,  
							"l", -right, -up,  
							"l", -right, up, "Z"].join(" ");

				aPath = svg.append("svg:path").attr("d", path)
					.attr("modify", modify)
					.attr("target", target)
					.attr("value", rows[r][hex])
					.style("fill", ["rgb(", rows[r][hex].join(","), ")"].join(""))
					.on("click", colorCanvas);
					
				if (rows[r][hex].join(",") === startColor.join(",")){
			
					aPath.attr("stroke-width", 2)
						 .attr("stroke", "black");
				}
			}
		}
	}
	

	function colorCanvas(){
		// Colors the canvas depending on what was selected on the color wheel.
		// Note that FireFox treats color information in the form of RGB(r,g,b),
		// not by hexcode.

		d3.select(this.getAttribute("target")).selectAll("path").style("stroke", "none");
		console.log(this.style.fill);
		this.style.stroke = "#666"
		this.style.strokeWidth = 2;

		canvasRGB = this.getAttribute("value").split(",");

	

		if (this.getAttribute("modify") === "G_VAR.canvasRGB"){

			G_VAR.canvasRGB = canvasRGB;

				for (var i = 0; i < G_VAR.nodes.length; i++){
					G_VAR.nodes[i].colorizer(G_VAR.scale, canvasRGB);
				}
				canvas.selectAll("rect").remove();
				canvas.selectAll("circle").remove();
				rectMake(G_VAR.nodes, G_VAR.canvasSize / Math.sqrt(G_VAR.nodes.length));
				circleMake(G_VAR.nodes, G_VAR.canvasSize / Math.sqrt(G_VAR.nodes.length));
				
				
				
		} else if (this.getAttribute("modify") === "G_VAR.indicatorColor"){
			G_VAR.indicatorColor = canvasRGB;
			for (var i = 0; i < G_VAR.nodes.length; i++){
				if (isEmpty(G_VAR.nodes[i].circles) == false){
					for (var x = 0; x < G_VAR.nodes[i].circles.length ; x++){
						G_VAR.nodes[i].circles[x][1] = ["rgb(", canvasRGB.join(","), ")"].join("");
				
					}
				}
			
			}
			
			weight_visualize(G_VAR.nodes, G_VAR.canvasSize);
			/*
			if (d3.select("svg#pvalueSVG").empty() ==false){
				d3.select("svg#pvalueSVG").remove();
				pvalueCanvas(G_VAR.nodeList);
			}
			*/
			
			
			if (d3.select("svg#NetworkView").empty() == false){
				d3.select("svg#NetworkView").remove();
				console.log(G_VAR.indicatorColor);
				buildNetwork(G_VAR.networkLinks, 275, G_VAR.indicatorColor);
			}
			
		}

	}
	function selectAlternateView(){
		if (document.getElementById("mainCanvasSelector").checked){
			
			document.getElementById("chartContainer").style.display = "none";
			document.getElementById("svgContainer").style.display="block";
			document.getElementById("pvalueContainer").style.display="none"
			//document.getElementById("NetworkView").style.display="none";
			document.getElementById("pvalueSVG").style.display="none";
			document.getElementById("mainSVG").style.display="inline";

		
		
		} else if (document.getElementById("networkView").checked){
			
			document.getElementById("chartContainer").style.display = "block";
			document.getElementById("svgContainer").style.display="none";
			document.getElementById("pvalueContainer").style.display="none"
			document.getElementById("NetworkView").style.display="inline";
			document.getElementById("pvalueSVG").style.display="none";
			document.getElementById("mainSVG").style.display="none";
			d3.select("a.toggleChart").text("Click to View Canvas")


	
		
		} else if (document.getElementById("pvalueCanvas").checked){
			
			document.getElementById("chartContainer").style.display = "none";
			document.getElementById("svgContainer").style.display="none";
			document.getElementById("pvalueContainer").style.display="block";
			//document.getElementById("NetworkView").style.display="none";
			document.getElementById("mainSVG").style.display="inline";
			document.getElementById("pvalueSVG").style.display="inline";
			
		}
	}
	
	function pvalueCanvas(nodeList){
		
		pvalueSVG = d3.select("#pvalueContainer")
							.append("svg:svg")
							.attr("id", "pvalueSVG")
							.attr("width", 275)
							.attr("height", 275)
							.attr("pointer-events", "all")
							.append('svg:g')
								.attr("id", "zoomLayerPvalue")
								.call(d3.behavior.zoom().on("zoom", redraw1))
							.append('svg:g')
								.attr("id", "gameFindLayer");

		d3.select("#zoomLayerPvalue").on("dblclick.zoom", null);
		
		var nodeNames = [];
		var nodeDict = {};
		var nodes = G_VAR.nodes;
		var indicate = G_VAR.indicatorColor;
		var width = Math.sqrt(G_VAR.nodes.length);
		var pixels = 275 / width; 
		for (var i = 0; i < nodeList.length; i++) { 
			nodeNames.push(nodeList[i].toUpperCase())

		}
		
		rectGroup = pvalueSVG.selectAll("rect");
		
		
		for (var i = 0; i < nodes.length; i++){
				
				var node = nodes[i];
				rec = rectGroup.data([node]).enter().append("svg:rect");
				rec.attr("x", function(d){ return d.index%width * pixels;})
							.attr("y", function(d) { return Math.floor(d.index/width) * pixels;})
							.attr("width", pixels)
							.attr("height", pixels)
							.attr("fill", "rgb(0,0,0)")
							.attr("id", "pCanvas" + i);
				

		}
		G_VAR.nodeList = nodeList
		persistentNodeNames = nodeNames;
		persistentNodeDict = nodeDict;

		clicksLeft = 100;
		maxNodes = nodeNames.length;
		points = 0;
		goodGame = false;
		document.getElementById("pvalueCanvas").disabled = false;
		document.getElementById("mainCanvasSelector").disabled = true;
		counterPersistent = 0;
		timeGame=0;

			
	}
			
		
		function gameStart()
		{
			points += 1000;
			d3.select("#startButton").remove();
			var nodeList = G_VAR.nodeList;
			d3.select("#gameFindLayer").on("mousedown", gameFind);
			d3.select("#pvalueRow" + counterPersistent).style("color", "rgb(255,0,0)");

			
			document.getElementById("selectionDisplay3").innerHTML = "Please Find : " + persistentNodeNames[counterPersistent];
			var nodeNames = [];
			var nodes = G_VAR.nodes;
			var indicate = G_VAR.indicatorColor;
			var width = Math.sqrt(G_VAR.nodes.length);
			var mD = maxDistance(width);
			
			var pixels = 275 / width; 
			for (var i = 0; i < nodeList.length; i++) { 
				nodeNames.push(nodeList[i][0].toUpperCase())

			}
			rectGroup = pvalueSVG.selectAll("rect");

			if (typeof myVar == 'undefined')
			{
				myTime();
			}

		}
	
		function maxDistance(width)
		{
			if (width == 2)
			{
				return 1;
			}
			
			else if (width == 3)
			{
				return 2;
			}
			
			else
			{
				return (Math.floor( width / 2) * 2);
			
			}
		}
		
		function gameFind()
		{
			// Uses the textMap to get Node Name and Additional Information and places it into the Display Info div.
			var width = Math.sqrt(G_VAR.nodes.length)
			var pixels = G_VAR.canvasSize / width;
			var m = d3.svg.mouse(this);
			var column = Math.floor(m[0]/pixels);
			var row = Math.floor(m[1]/pixels);
			var index = row * width + column;
			var indicate = G_VAR.indicatorColor;
			var mD = maxDistance(width);
			var nN = G_VAR.nodes[index].searchText;
			var cI = persistentNodeNames.indexOf(nN);
			var chosenNode = persistentNodeNames[counterPersistent]
			var nodeI = G_VAR.reverseDict[persistentNodeNames[counterPersistent]];
			
			if (nN == persistentNodeNames[counterPersistent] && !(counterPersistent >= 20))
			{
				for  (var a = 0; a < nodeI.length; a++)
				{
					d3.select("#pCanvas" + nodeI[a]).attr("fill", "rgb(255,255,255)");
					d3.select("#pCanvas" + nodeI[a]).append("title").text(nN);
				}
				points += Math.floor(1000 / (1 + .005 * timeGame) * (1 + .05 * G_VAR.width));
				d3.selectAll("#pvalueRow" + counterPersistent).style("color", "rgb(0,200,0)");
				goodGame = true;
			}
			
			else if (d3.select("#pCanvas" + index).attr("fill") == "rgb(0,0,0)" && goodGame == false)
			{	
				var closestDistance = 9999;
				for (var a = 0; a < nodeI.length; a++)
				{
					var distance = findDistance(row, column, Math.floor(nodeI[a]/width), nodeI[a]%width,  width)
					console.log(row, column, Math.floor(nodeI[a]/width), nodeI[a]%width, width);
					if (distance < closestDistance)
					{
						closestDistance = distance;
					}
		
				}
				
				points -= 100;
				clicksLeft -= 1;
				console.log(mD, closestDistance);
				var str = ["rgb(", [Math.floor(((mD - closestDistance) * 255 /mD)), 0 , Math.floor((255 * closestDistance / mD))].join(","), ")"].join("");
				console.log(str);
				d3.select("#pCanvas" + index).attr("fill", str);
				d3.select("#pCanvas" + index).append("title").text(nN);
			
				
			}
			

			if (clicksLeft <= 0){
				goodGame = true;
			}
			
			if (clicksLeft > 0 && counterPersistent < maxNodes && goodGame == false){
				document.getElementById("timer").innerHTML = "<table style = 'width:390px'><tr><td>Points: " + points + "</td><td> Nodes Left: " + (10 - counterPersistent) + " </td></tr><tr><td>Time: " + timeGame + "</td><td>Clicks Left: " + clicksLeft + "</td></tr></table>";
			}

			return; 
		}
		


		
		function myTime()
		{
			
			myVar = setInterval(function(){timer()}, 1000);
		}
		
	function gameContinue()
	{
		for (var a = 0; a < G_VAR.nodes.length; a++)
		{

			if (d3.select("#pCanvas" + a).attr("fill") == "rgb(255,255,255)")
			{
				console.log(d3.select("#pCanvas" + a).attr("fill"));
			}
			else
			{
					d3.select("#pCanvas" + a).attr("fill", "rgb(0,0,0)");
					d3.select("#pCanvas" + a).select("title").remove();
			}
		
		
		}
		
		counterPersistent += 1;


			if (!(counterPersistent >= 10) && !(clicksLeft <= 0))
			{
				goodGame = false;
				gameStart();
			} else if ((counterPersistent >= 10)){
				clearInterval(myVar);
				points += Math.floor(clicksLeft * 100 * (1 + 0.01 * G_VAR.width));
				document.getElementById("timer").innerHTML = "You have completed the game in " + timeGame + " seconds with " + points + " points";		
				document.getElementById("selectionDisplay3").innerHTML = '<input type="button" name="button" id = "scoreBoardButton" value="Play Again?" onclick="getTerms()" /> <input type="button" name="button" id="scoreBoardButton" value="New Canvas?" onclick="indicateClear(G_VAR.nodes);" />\n\n<input type="button" name="button" id="scoreboardButton" value="Submit Score?" onclick="scoreBoardMod(points);" />'	
				myVar = undefined;
			} else if (clicksLeft <= 0)
			{
				clearInterval(myVar);
				document.getElementById("timer").innerHTML = "Game Over.<br /> # of wrong clicks reached. <br />Your score is "+ points + " with " + timeGame + " seconds elapsed.";
				document.getElementById("selectionDisplay3").innerHTML = '<input type="button" name="button" id = "scoreBoardButton" value="Play Again?" onclick="getTerms()" /> <input type="button" name="button" id="scoreBoardButton" value="New Canvas?" onclick="indicateClear(G_VAR.nodes);" />\n\n<input type="button" name="button" id="scoreboardButton" value="Submit Score?" onclick="scoreBoardMod(points);" />'	
				
				myVar = undefined;
			}

	}
		
		function timer(){
			console.log(timeGame)
			document.getElementById("timer").innerHTML = "<table style = 'width:390px'><tr><td>Points: " + points + "</td><td> Nodes Left: " + (10 - counterPersistent) + "</td></tr><tr><td>Time: " + timeGame + "</td><td>Clicks Left: " + clicksLeft + "</td></tr></table>";
			timeGame += 1;

			if (goodGame == true)
			{
				gameContinue();
			}

		
		}
	//--------------------------
	// Download Link 
	//--------------------------


		function downloadLink(){
			// Allows downloading and printing of the current canvas view
			var selector;
			
			
			if (document.getElementById("mainCanvasSelector").checked){
				selector = "svg#mainSVG";			
			} else if (document.getElementById("networkView").checked){
				selector = "svg#NetworkView";
			} else if (document.getElementById("pvalueCanvas").checked){
				selector = "svg#pvalueSVG";
			}
			
	        var html = d3.select(selector).attr("xmlns", "http://www.w3.org/2000/svg").node()
				.parentNode.innerHTML;
			var newWindow=window.open("data:image/svg+xml;base64,"+ btoa(html), " ", 'location=yes');
			newWindow.print();
		}
		
	//--------------------------
	// get from server
	//--------------------------		
		
		function createXMLhttp(){
			var xmlhttp;
			if (window.XMLHttpRequest) {
			  	xmlhttp=new XMLHttpRequest();
			} else {
			  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			return xmlhttp;
		}
		/*
		function createTextFile(string){
			// Creates a temporary text file by using XMLHttpRequest to send information
			// back to the server. The filename is generated by using the date and a small
			// random tag appended to the end of it. 
			//
			// It then generates a link for download asynchronously. 

			var xmlhttp = createXMLhttp();
			var d=new Date();
			random = d.getTime().toString().slice(2)+ Math.floor(Math.random() * 1000).toString();
			
			xmlhttp.open("POST","createFile.php",true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.send("random="+random+"&string="+string)

			xmlhttp.onreadystatechange=function(){
				if (xmlhttp.readyState==4 && xmlhttp.status==200){
					d3.select("#selectionDisplay3").append("div").attr("id", "textdownload")
							.style("width", "390px")
							.style("padding-top", "15px")
					.append("a").attr("id", "textdownload")
					.attr("href", "downloadTextFile.php?q=" + random)
					.text("Click Here to Download Full Node/P-Value Table");
				}
			}
		}
		*/
		
			
		
	function getJSON(i, canvasRGB, indicatorColor)
	{
			// Gets the canvas JSON file from server synchronously. 
			// Calls getGMT to get the information for the canvas. 

			//GET CANVAS
			
			var number = document.getElementById("selectCanvas").options[i].value;
			
			console.log(number)
			if (number == "x"){
				return;
			}
			
			if (typeof myVar != 'undefined'){
				clearInterval(myVar);
				document.getElementById("timer").innerHTML = "";
				myVar = undefined;
			}
				d3.selectAll(".manhattan").remove();
				d3.select("#mainSVG").remove();
				d3.selectAll("#NetworkView").remove();
				d3.selectAll("#pvalueSVG").remove();
				d3.selectAll("#textdownload").remove();
				d3.selectAll("#toggleChart").remove();
				d3.selectAll(".GSE").remove();
				
				document.getElementById("mainCanvasSelector").checked = "checked";
				document.getElementById("networkView").disabled = true;
				document.getElementById("pvalueCanvas").disabled = true;
				document.getElementById("chartContainer").style.display = "none";
				document.getElementById("pvalueContainer").style.display="none"
				
			
			var xmlhttp = createXMLhttp();
			
			xmlhttp.open("GET","getJSON.php?number="+number, false);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.send();	
			
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
			
				var json = JSON.parse(xmlhttp.responseText);
				
			
				G_VAR = initializeIt(json);
				G_VAR.canvasRGB = canvasRGB; //canvasRGB
				G_VAR.indicatorColor = indicatorColor; //indicatorColor
				G_VAR.scale = Math.log(0.25)/Math.log(G_VAR.avgWeight);
				for (var i = 0; i < G_VAR.nodes.length; i++)
				{
						G_VAR.nodes[i].colorizer(G_VAR.scale, G_VAR.canvasRGB);
				}
				visualizeIt(G_VAR);
				document.getElementById("svgContainer").style.display="block";
				document.getElementById("mainSVG").style.display="inline";
				//document.getElementById('colorScale').innerHTML = 0.25;
				//document.getElementById('range_colorScale').value = 0.25;

				G_VAR.nodeNames = [];
				for (var a = 0; a < G_VAR.nodes.length; a++)
					{
					if (!(G_VAR.nodeNames.indexOf(G_VAR.nodes[a].searchText) > -1))
					{
						G_VAR.nodeNames.push(G_VAR.nodes[a].searchText);
					}
					}
			}
			
			else {
				getJSON(i, canvasRGB, indicatorColor)
			}
			document.getElementById("submitButton").disabled = false;
		}
	
	function getGMT(i)
	{
			//Get GMT
			var number = document.getElementById("selectCanvas").options[i].value;
			
			if (number == "x"){
				return;
			}
			
			
			

			if (number == "24"){
				//Note. used because the GMT is too big for PHP to handle.
				d3.json("GMT/Transfac_GMT_dict.json", function(data){
					G_VAR.infos=data;
				})
				return;
			}
			

			
			document.getElementById("selectCanvas").disabled = "disabled"			
			var xmlhttp = createXMLhttp();
			xmlhttp.open("GET","getGMT.php?number=" + number, true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.send();
			
			xmlhttp.onreadystatechange=function(){
				if (xmlhttp.readyState==4 && xmlhttp.status==200){
					G_VAR.infos = JSON.parse(xmlhttp.responseText.toUpperCase());
					//document.getElementById("selectCanvas").disabled = "";
				}	
				else if (xmlhttp.readyState == 4 && xmlhttp.status == 500){
					getGMT(i)
				}
			}

	}
	
	//-----------------------------
	// Selection Options
	//-----------------------------


		function indicateClear(nodes){
			// Clears all circles from the current SVG View by making their opacity 0.
			// Transitions included to make circle removal smooth.
			// Removes all analysis outputs and switches any toggle back to the canvas.
			/*
			clearInterval(myVar);
			document.getElementById("timer").innerHTML = "";
			*/
			d3.select("#startButton").remove();
			if (typeof myVar != 'undefined'){
				clearInterval(myVar);
				myVar = undefined;
			}
			d3.select("#submitButton").attr("disabled", null);
			document.getElementById("timer").innerHTML = "";
			document.getElementById("timer").innerHTML = "";
			document.getElementById("selectionDisplay3").innerHTML = "";

			d3.select("#nodeTable_gene").remove();
			d3.select("#results_gene").remove();
			d3.selectAll(".GSE").remove();
			d3.select("div#manhattan").remove();
			d3.select("svg#pvalueSVG").remove();


			document.getElementById("LevelSelect").selectedIndex = 0;
			document.getElementById("selectCanvas").selectedIndex = 0;
			document.getElementById("submitButton").disabled = true;
			document.getElementById("selectCanvas").disabled = true;


			document.getElementById("mainCanvasSelector").checked = "checked";
			document.getElementById("networkView").disabled = true;
			document.getElementById("pvalueCanvas").disabled = true;
			document.getElementById("chartContainer").style.display = "none"; 
			document.getElementById("pvalueContainer").style.display="none"
			
			document.getElementById("mainSVG").style.display = "inline";
			document.getElementById("svgContainer").style.display="block";
			d3.selectAll("#NetworkView").remove();
			d3.selectAll("#textdownload").remove();
			d3.selectAll("#toggleChart").remove();
			
			
			displayOutput(1);
			for (var i = 0; i < nodes.length; i++){
					nodes[i].circleClear();
					}
			canvas.selectAll("circle")
					.transition().delay(100).duration(2000).ease("linear").attr("r",1e-5)
				.remove();
			d3.select('#zoomLayerPvalue').call(d3.behavior.zoom().on("zoom", null));
			d3.select('#zoomLayer').call(d3.behavior.zoom().on("zoom", redraw));
		}

	//-------------------------------------
	// Manhattan Distance Calculation
	//-------------------------------------

		function fill(nodes, elements, RGB, width)
		{
			// Fill creates an array of indicated values using delimiter "\n", 
			// and calls circleMake to create the indicator circles.
			
			var elementList = elements.toUpperCase().split("\n");			
			var manhattanNodes = [];
			var checkIndex = {};    // Prevents nodes from being indicated more than once per fill

				for (var i in nodes){
					if (elementList.indexOf(nodes[i].searchText) > -1 && !(i in checkIndex)){
						nodes[i].circleMaker(RGB, 1);
						manhattanNodes.push(nodes[i])
						checkIndex[i] = i;
					}
				}
			canvas.selectAll("circle").remove();
			circleMake(nodes, 275 / width);

		}	
		

		function fillElement2(infoDict, elementList, nodes, RGB, width){
		
			var checkList = {};
			var nodeNames = [];
			for (var i = 0; i < elementList.length; i++){
				var nodeElements = infoDict[elementList[i]];
				for (var f = 0; f < nodeElements.length; f++){
					if (!(nodeElements[f] in checkList)){ 
						nodeNames.push(nodeElements[f]);
						checkList[nodeElements[f]] = 1;
					}
				}
			}
			
			for (var i in nodes){
				if (nodeNames.indexOf(nodes[i].searchText) > -1){
					nodes[i].circleMaker(RGB, 1);
				}
			}
			
			circleMake(nodes, 275 / width);
			
		}
			
		function fillElement(nodes, elements, RGB, width)
		{
			// Fill creates an array of indicated values using delimiter "\n", 
			// and calls circleMake to create the indicator circles.
			var count = 0;
			var elementList = elements.toUpperCase().split("\n");
			
			if (isEmpty(G_VAR.infos) == true) {
				var wait = self.setInterval(function(){
				
					if (isEmpty(G_VAR.infos) == false){
						clearInterval(wait);
						infos = G_VAR.infos;
						G_VAR.infoDict = infoDictMaker(infos);
						fillElement2(G_VAR.infoDict, elementList, nodes, RGB, width);
						document.getElementById("selectionDisplay3").innerHTML = "";
						
					} else {
						pleaseWait(count, "selectionDisplay3", "innerHTML");
						count += 1;
					}										
					} , 100);

			} else if (isEmpty(G_VAR.infoDict) == true){
				G_VAR.infoDict = infoDictMaker(G_VAR.infos);
				fillElement2(G_VAR.infoDict, elementList, nodes, RGB, width);

			} else { 
				fillElement2(G_VAR.infoDict, elementList, nodes, RGB, width);
			}
			
			
			
		}	
		

		function findDistance(x1, y1, x2, y2, width)
		{
			with (Math){
				xdiff = (2 * abs(x2 - x1) <= width) ? abs(x2 - x1) : width - abs(x2 - x1);
				ydiff = (2 * abs(y2 - y1) <= width) ? abs(y2 - y1) : width - abs(y2 - y1);
				console.log(xdiff, ydiff);
				distance = xdiff + ydiff;
				}
			return distance;
		}
		
		function manhattanDistance(nodes, width)
		{
			// Calculates the shortest manhattan distance between all selected nodes.
			// As the canvas is a torus, this function will select for the smallest
			// distance between two nodes using this criteria.
			// Afterwards, the sum of all interactions are averaged together to get
			// the average manhattan distance between all nodes.
			
			var combination = 0, totalDistance = 0, x1 = 0, x2 = 0, y1 = 0, y2 = 0,
				avgDistance = 0, stdev = 0; xdiff = 0; ydiff= 0, distanceArr = [],
				numerator = 0;


			for (var i = (nodes.length - 1); i >= 0; i--){
				x1 = nodes[i].index%width;
				y1 = Math.floor(nodes[i].index/width);

				for (var c = (i - 1); c >= 0; c--){
					x2 = nodes[c].index%width;
					y2 = Math.floor(nodes[c].index/width);
					
					distance = findDistance(x1, y1, x2, y2, width);

					distanceArr.push(distance)
					totalDistance += (distance)
					combination += 1
				}
			}


			avgDistance = totalDistance / combination;
			for (var i = 0; i < distanceArr.length; i++){
				numerator += Math.pow(distanceArr[i] - avgDistance, 2);
			}

			stdev = Math.sqrt(numerator/(combination-1));
			var nodeOutput = [avgDistance, stdev];

			return nodeOutput;
		}


	
	function clusterFind(elementList, nodes, width)
	{
			// Calculate the z-score using the average Nearest Neighbor distance.
			// Note that "nodes" are the selected nodes. 
			// 
			// If there is only one node selected, the clusterFind function will
			// output a really large positive z-score. The more negative the z-score,
			// the greater the clusering. 
			// 
			// The algorithm's creator is Neil Clark.
			var x1, x2, x2, y2, 
				totalSum, distance, nearestDist, 
				avgNN, m, z

			if (nodes.length < 3){
				return "N/A";
			}

			totalSum = 0;

			for (var chosen = 0; chosen < nodes.length; chosen++){
				nearestDist = 9999;
				x1 = nodes[chosen].index%width;
				y1 = Math.floor(nodes[chosen].index/width);
				for (var i = 0; i < nodes.length; i++){
					if (i !== chosen){
						x2 = nodes[i].index%width;
						y2 = Math.floor(nodes[i].index/width);
						distance = findDistance(x1, y1, x2, y2, width);
						
						if (nearestDist > distance){
							nearestDist = distance;
							if (nearestDist == 1){
								break;
							}
						}
					}
				}
				totalSum += nearestDist;
			}

			avgNN = totalSum / nodes.length;
			m = .6291 * Math.pow(nodes.length/width/width, -0.503301)
			z = (avgNN - m) / (0.328 * Math.pow(nodes.length, -1.00728) * Math.pow(width, 1.00939))
			
			return z
	}

	function calculateBestDistance(nodes, width)
	{
		//Nodes in this case refer to the selected Nodes.
		var leastDistance = {};
		var distanceArray = [];
		var edgeLimit = Math.ceil(nodes.length * 1.5)
		var distance;
		
		for (var chosen = 0; chosen < nodes.length; chosen++){
				smallDist = 9999;
				x1 = nodes[chosen].index%width;
				y1 = Math.floor(nodes[chosen].index/width);
				for (var i = chosen; i < nodes.length; i++){
					if (i !== chosen){
						x2 = nodes[i].index%width;
						y2 = Math.floor(nodes[i].index/width);

						distance = findDistance(x1, y1, x2, y2, width);
						
						distanceArray.push([nodes[chosen].searchText, nodes[i].searchText, distance])
						if (distance < smallDist){
							smallDist = distance;
							leastDistance[nodes[chosen].searchText] = [nodes[i].searchText, distance];
							if (leastDistance[nodes[i].searchText] == undefined || leastDistance[nodes[i].searchText][1] > smallDist){
								leastDistance[nodes[i].searchText] = [nodes[chosen].searchText, distance];
							}
						}
					}
				}
		}
		
		distanceArray.sort(function(a,b){return a[2]-b[2]})
		var edges = distanceArray.slice(0, edgeLimit)
		var trackNodes = {};
		var exportEdges = [];
		for (var i = 0; i < edges.length; i++){
			exportEdges.push({source: edges[i][0], target: edges[i][1], type: "default"})
			trackNodes[edges[i][0]] = true;
			trackNodes[edges[i][1]] = true;
		}
		
		for (var chosen = 0; chosen < nodes.length; chosen++){
			if (nodes[chosen].searchText in trackNodes){
			} else {
			exportEdges.push({source: nodes[chosen].searchText, target: leastDistance[nodes[chosen].searchText][0], type: "default"})
			}
		}
			
		return exportEdges;
		
	}



	//------------------------------
	// Gene List Enrichment
	//------------------------------
		function isEmpty(obj){
			for (var i in obj){
				if (obj.hasOwnProperty(i)){ return false; };
			}
				return true;
		}
		
		function countKeys(obj){
			var count = 0, key;
			for (var key in obj){
				if (obj.hasOwnProperty(key)){
					count += 1;
				}
			}
			return count;
		}
		
		function createUniqueArray(array){
			var uniqueDict = {} , uniqueArray = [];
			for (index in array){
				elements = array[index];
				for ( i in elements){
					uniqueDict[elements[i]] = 1;
				}
			}
			for (element in uniqueDict){
				uniqueArray.push(element);
			}
			return [uniqueDict, uniqueArray];
		}
		

		function calculateGeneFill(nodes, elements, hexCode, infoDict, infos)
		{
			
			document.getElementById("networkView").disabled = true;
			document.getElementById("pvalueCanvas").disabled = true;
			
			
			var contA, contB, contC, contD;
			var nodeList = [];		// Stores Fisher Test Results
			var listDownload = [];			
			var rawList = elements.toUpperCase().split("\n");
			var elementAssoc = {};
			var checkList = {};
			var elementList = [];


			if (isEmpty(infoDict))
			{
					G_VAR.infoDict = infoDictMaker(infos);
					infoDict = G_VAR.infoDict;
			}
			
			for (var index in rawList)
			{ //remove duplicates
					elementAssoc[rawList[index].toUpperCase()] = 1;
			}
				
			for (var key in elementAssoc)
			{ //remove non-mapped entries
				if (key in infoDict)
				{
					elementList.push(key);
				}
			}
			
			// Create contigency table for Fisher Test
			// contA = Kinase/Element List Intersect, contB = Kinase/Other Genes Intersect
			// contC = Other Kinases/ Element List Intersect, contD = Other kinases/ Other Genes


				var totalGeneCount = countKeys(infoDict);				
				var totalElementCount = elementList.length;
				
				// Calculate pvalue using FisherTest

				for (var key in infos)
				{
					var info = infos[key];
					var contigencyTable = []; 
					var genesIntersect = [];
					contA = 0;

					
					checkList = {};
					var contC = 0;
					for (var index in info){
						if (!(info[index].toUpperCase() in checkList)){   //Remove effect of any duplicate genes in the info line.
							contC += 1
							checkList[info[index].toUpperCase()] = 1;
							if ((info[index].toUpperCase() in elementAssoc)){ //Get intersection
								contA += 1;
								genesIntersect.push(info[index]);
							}
						}
					}

					
					if (contA !== 0){
						var contB = totalElementCount - contA;
						var contD = totalGeneCount - contC;
						var pvalue = fisherExact(contA, contB, contC, contD)
						nodeList.push([key.toUpperCase(), pvalue.toExponential(3), contA + contB, elementList.length, contA, genesIntersect.join(";")])
						listDownload.push([key.toUpperCase(),pvalue])
					}
				}

				//Create the List download File
				nodeList.sort(function(a,b){return a[1]-b[1]});
				nodeTextFile = [["Node Name", "P-value", "Total Genes in Gene Set", "Total Genes in Input", "Total Genes Intersected", "Intersecting Genes"].join('\t')];
				nodeNames =[];
				dictNode = {};
				

					
				for (var i = 0; i < nodeList.length; i++){
					if (nodeList[i][1] < 0.05){
						dictNode[nodeList[i][0].toUpperCase()] = nodeList[i][1]
						nodeNames.push(nodeList[i][0].toUpperCase())
						nodeTextFile.push([nodeList[i][0], nodeList[i][1], nodeList[i][2], nodeList[i][3], nodeList[i][4], nodeList[i][5]].join('\t'))
					} else {
						break
					}
				}


				nodeList = nodeList.slice(0,20);
				nodeNames = nodeNames.slice(0,20);
				G_VAR.nodeList = nodeList
				G_VAR.nodeNames = nodeNames
				manhattanNodes = [];
				d3.select('#zoomLayer').call(d3.behavior.zoom().on("zoom", null));
				pvalueCanvas(nodeList)


				
				var dispNodes = [];

				for (var i in nodes)
				{
					if (nodeNames.indexOf(nodes[i].searchText) > -1){
							manhattanNodes.push(nodes[i])
							dispNodes.push([i, nodes[i], dictNode[nodes[i].searchText]])
					}
				}


				dispNodes.sort(function(a,b){return a[2]-b[2]});

				for (var i = 0; i < dispNodes.length; i++)
				{
					nodes[dispNodes[i][0]].circleMaker(hexCode, .6 + (.4/(i+1)));
				}

				manOutput = manhattanDistance(manhattanNodes,G_VAR.width)
				nodeNameList = []
				checkList= {}		
				for (var index in manhattanNodes)
				{
					if (!(manhattanNodes[index].searchText in checkList))
					{
						nodeNameList.push(manhattanNodes[index].searchText);
						checkList[manhattanNodes[index].searchText] = 1;
					}
				}
				zscore = clusterFind(nodeNameList, manhattanNodes, G_VAR.width)
				manOutput.push(zscore)

				circleMake(nodes, 275 / Math.sqrt(G_VAR.nodes.length));	
				elementList.sort();


				// Creates the table for the Gene Set Enrichment

				var GSE = d3.select("#enrichmentResults").append("div").attr("class", "GSE").attr("id", "GSE");
				baseTable = GSE.append("table").attr("id", "GSEElement1").attr("class", "contain");
			
				for (var i = 0; i < nodeList.length; i++)
				{
					var tableRow = baseTable.append("tr").attr("id", "pvalueRow" + i).style("color", "rgb(0,0,0)");
					for (var x = 0; x < 2; x++)
					{
						tableRow.append("td").text(nodeList[i][x]);

					}		
				}
			
				displayOutput(2);
			
			
				//Builds the Network View
				document.getElementById("mainSVG").style.display = "inline";
				d3.selectAll("#NetworkView").remove();

				document.getElementById("pvalueCanvas").checked = true;
				
				selectAlternateView();
				gameStart();
		}

			
		function geneFill(nodes, elements, hexCode, infoDict, infos)
		{
			// Calculates the enrichment of a node for a user-inputed set of elements.
			// Outputs a p-value based on the Fisher's Exact Test.
			// Calculates the manhattan distance between those nodes.
			// Creates a bar graph and a table that shows the most significant results of the analysis.
			// Creates a text file containing the full table.

			indicateClear(nodes);
			var count = 0;
			
			
			if (isEmpty(G_VAR.infos) == true) {
				var wait = self.setInterval(function(){
				
					if (isEmpty(G_VAR.infos) == false){
						clearInterval(wait);
						infos = G_VAR.infos;
						G_VAR.infoDict = infoDictMaker(infos);
						document.getElementById("selectionDisplay3").innerHTML = "";
						calculateGeneFill(nodes, elements, hexCode, infoDict, infos);
						document.getElementById("timer").innerHTML = ""
						
					} else {
						pleaseWait(count, "timer", "innerHTML");
						count += 1;
					}										
					} , 100);

			} else { 
				calculateGeneFill(nodes, elements, hexCode, infoDict, infos);
			}
					
		}



	//----------------------------------
	// Fisher Exact Test = Right Tailed
	//----------------------------------
		function factorialLog(x){
			if (storeFact[x] !== undefined){
				return storeFact[x];
			} else {
				var start = storeFact.length;
				for (i = start; i <= x; i++){
					storeFact.push(storeFact[i-1] + Math.log(i));
				}
			}
			return storeFact[x];
		}
		
		
		function fisherExact(contA, contB, contC, contD){
			//Calculate RIGHT-SIDED FISHER EXACT
			var numerator, denominator, p = 0;
			var min = (contC < contB) ? contC : contB;

			for (var q = 0; q < min + 1; q++){ 
				numerator  = factorialLog(contA + contB) + factorialLog(contC + contD) 
									+ factorialLog(contA + contC)+ factorialLog(contB + contD);

				denominator = factorialLog(contA) + factorialLog(contB) + factorialLog(contC) 
									+ factorialLog(contD) + factorialLog(contA + contB + contC + contD);
				p += Math.exp(numerator - denominator);
				
				contA += 1
				contB -= 1
				contC -= 1
				contD += 1
			
			}
			return p;
		}
			
				 


	//-----------------------------
	// Canvas Options Functionality
	//-----------------------------


		function scaleColor(nodes, avgWeight, modWeight, canvasRGB, canvasSize){
			// Modifies the color scaling of the SVG, giving greater contrast to similarly colored elements.

			if (avgWeight != 1.0){
				var scale = Math.log(modWeight)/Math.log(avgWeight);
			}
			
			for (var i = 0; i < nodes.length; i++){
				nodes[i].colorizer(scale, canvasRGB);
			}
			weight_visualize(nodes, canvasSize);	
			G_VAR.scale = scale;
			
			return;
		}


		function centerCanvas(nodes, canvasSize){
			// Centers canvas with current attributes on click.
			G_VAR.scaleZoom = 1;
			G_VAR.translateZoom = [0,0];
			d3.selectAll("svg#mainSVG").remove();
			createCanvas(canvasSize);
			weight_visualize(nodes, canvasSize);

		}

		function resetColorScale(nodes, canvasRGB, canvasSize){
			var scale = 1.00;
			for (var i = 0; i < nodes.length; i++){
				nodes[i].colorizer(scale, canvasRGB);
			}
			weight_visualize(nodes, canvasSize);
			G_VAR.scale = scale; 

			document.getElementById('colorScale').innerHTML = G_VAR.avgWeight.toString().slice(0,4);
			document.getElementById('range_colorScale').value = G_VAR.avgWeight.toString().slice(0,4);
		}
	

	//------------------------------
	// Canvas Creation Functionality
	//------------------------------

		
			
		function visualizeIt(G_VAR){
			
			createCanvas(G_VAR.canvasSize);	
			weight_visualize(G_VAR.nodes, G_VAR.canvasSize);


		}
			


		function circleMake(nodes, pixels){
			
			var radius = Math.floor(pixels/2.5);
			var width = Math.sqrt(nodes.length);
			

			for (var i = 0; i < nodes.length; i++){
				var node = nodes[i];
				if (node.circles.length !== 0){
					circles = indicate.data(node.circles).enter().append("svg:circle");
					circles.attr("cx", (node.index % width) * pixels + pixels/2)
						.attr("cy", Math.floor(node.index / width) * pixels + pixels/2)
						.attr("fill", function(d) { return d[1];})
						.attr("opacity", function(d){ return d[3]})
						.transition()
							.duration(2000)
							.ease(Math.sqrt)
							.attr("r", function(d) {return(radius * d[2]);});
					circles.append("title").text(function(d) {return d[0]; })	
				}
			}
		}
				
		function rectMake(nodes, pixels){
			// Defines the square attributes. Position and color are controlled here.
			var width = Math.sqrt(nodes.length);
			for (var i = 0; i < nodes.length; i++){
				var node = nodes[i];
				rects = rect.data([node]).enter().append("svg:rect");
				rects.attr("x", function(d){ return d.index%width * pixels;})
							.attr("y", function(d) { return Math.floor(d.index/width) * pixels;})
							.attr("width", pixels)
							.attr("height", pixels)
							.attr("fill", function(d) {return d.color});
				rects.append("title")
			        .text(function(d) { return d.text; });
			}
		}		



		function weight_visualize(nodes, canvasSize){
			// Removes all elements of canvas and then recreates those elements
			// Object removal prevents multiple elements from appearing when the SVG is downloaded.
			var pixels = canvasSize / Math.sqrt(nodes.length);
			canvas.selectAll("rect").remove();
			canvas.selectAll("circle").remove();
			rectMake(nodes, pixels);
			circleMake(nodes, pixels);
		}

		function createCanvas(canvasSize){
			// Creates the canvas. Called during initialization, centering, or resizing the SVG canvas.
			canvas = d3.select("div#svgContainer")
						.append("svg:svg")
						.attr("id","mainSVG")
						.attr("width", canvasSize)
						.attr("height", canvasSize)
						.attr("pointer-events", "all")
					  .append('svg:g')
						.attr("id", "zoomLayer")
						.call(d3.behavior.zoom().on("zoom", redraw))
					  .append('svg:g')
						.attr("id","main");

			// Fill Canvas with Weights and Names
			rect = canvas.selectAll("rect");
			indicate = canvas.selectAll("circle");
			texts = canvas.selectAll("text");
		}

		function NodeObj(index, weigh, text){
		
			this.index = index;
			this.weight = weigh;
			this.text = text;
			this.searchText = text.toUpperCase();
			this.circles = [];
			this.circleMaker = function(RGB, opacity){
				var adjust = Math.pow(0.7, this.circles.length);
				this.circles.push([this.text, ["rgb(", RGB.join(","), ")"].join("") , adjust, opacity]);
			}
				
			this.circleClear = function(){
				this.circles = [];
			}
			
			
			
			this.colorizer = function (scale, canvasRGB){
				var oriNum = [];
				for (i=0; i<3; i++){
						oriNum.push(Math.floor(canvasRGB[i] * Math.pow(this.weight, scale)/Math.pow(8, scale)));			
					}
				this.color = ["rgb(", oriNum.join(","), ")"].join("");
			}

		}



	//---------------------------------------
	// Gene Count Selection and Zoom Features
	//---------------------------------------
	

		function redraw() {
			// Allows panning and zooming of the canvas.
			if (d3.event.scale <= 1){
				// Constrains the zoom function, preventing panning or zoom-out when canvas is already at full size.
				d3.event.scale = 1;
				d3.event.translate = [0,0];
				d3.select('#zoomLayer').call(d3.behavior.zoom().on("zoom", null));
				d3.select('#zoomLayer').call(d3.behavior.zoom().on("zoom", redraw));

			}
			console.log(d3.event.scale, d3.event.translate);
			canvas.attr("transform", "translate(" + d3.event.translate + ")"
		      + " scale(" + d3.event.scale + ")");

			G_VAR.scaleZoom = d3.event.scale;
			G_VAR.translateZoom = d3.event.translate;
		}

		
		function redraw1() {
			// Allows panning and zooming of the canvas.
			if (d3.event.scale <= 1){
				// Constrains the zoom function, preventing panning or zoom-out when canvas is already at full size.
				d3.event.scale = 1;
				d3.event.translate = [0,0];
				d3.select('#zoomLayerPvalue').call(d3.behavior.zoom().on("zoom", null));
				d3.select('#zoomLayerPvalue').call(d3.behavior.zoom().on("zoom", redraw1));
				d3.select("#zoomLayerPvalue").on("dblclick.zoom", null);

			}
			console.log(d3.event.scale, d3.event.translate);
			pvalueSVG.attr("transform", "translate(" + d3.event.translate + ")"
		      + " scale(" + d3.event.scale + ")");

			G_VAR.scaleZoom = d3.event.scale;
			G_VAR.translateZoom = d3.event.translate;
		}
		
		
		function seeScale(value)
		{
			document.getElementById('colorScale').innerHTML=value.toString().slice(0,5);
		}
		
	//-------------------------
	// Menu/Tab/Display + Label Display
	//-------------------------


		function displayTab(form_number){
				for (i = 1 ; i < 3 ; i++){
					if (i === form_number){
						document.getElementById('form'+i).style.display = 'block';
						document.getElementById('tab'+i).style.fontWeight = '700';
						document.getElementById('tab'+i).style.backgroundColor= '#FFF';
					}
					else{
						document.getElementById('form'+i).style.display = 'none';
						document.getElementById('tab'+i).style.fontWeight = '400';
						document.getElementById('tab'+i).style.backgroundColor= '#CCC';
					}
				}
		}


		function displayFind(form_number){
				for (i = 1 ; i < 3 ; i++){
					if (i === form_number){
						document.getElementById('formFind'+i).style.display = 'block';
						document.getElementById('tabFind'+i).style.fontWeight = '700';
						document.getElementById('tabFind'+i).style.backgroundColor= '#FFF';
					}
					else{
						document.getElementById('formFind'+i).style.display = 'none';
						document.getElementById('tabFind'+i).style.fontWeight = '400';
						document.getElementById('tabFind'+i).style.backgroundColor= '#CCC';
					}
				}
		}

		
		
		function displayOutput(form_number){
				for (i = 1 ; i < 3 ; i++){
					if (i === form_number){
						document.getElementById('outputDisplay'+i).style.display = 'block';
						document.getElementById('outputTab'+i).style.fontWeight = '700';
						document.getElementById('outputTab'+i).style.backgroundColor= '#FFF';
					}
					else{
						document.getElementById('outputDisplay'+i).style.display = 'none';
						document.getElementById('outputTab'+i).style.fontWeight = '400';
						document.getElementById('outputTab'+i).style.backgroundColor= '#CCC';
					}
				}
		}
		
		

	