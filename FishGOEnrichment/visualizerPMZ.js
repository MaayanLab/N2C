
	//--------------------------
	// Download Link 
	//--------------------------

		function downloadLink(){
			// Allows downloading and printing of the current SVG View
			
	        var html = d3.select("svg#mainSVG").attr("xmlns", "http://www.w3.org/2000/svg").node()
				.parentNode.innerHTML;
			var newWindow=window.open("data:image/svg+xml;base64,"+ btoa(html), " ", 'location=yes');
			newWindow.print();
		}
	

	//-----------------------------
	// Selection Options
	//-----------------------------

		function sampler(hexCode){
			// Determines if hexCode is valid and controls the "Elements" color preview

			var checkHex = /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/

			if(checkHex.test(hexCode) === false){
				return;

			}else {
				
				sample_svg.selectAll("rect").remove();
				
				sample_svg.append("svg:rect")
					.attr("width", 20)
					.attr("height", 20)
					.attr("stroke", "black")
					.attr("stroke-width", 3)
					.attr("fill", hexCode);
			}
		}

		function sampler_gene(hexCode_gene){
			// Determines if hexCode is valid for the "Gene" color preview.

			var checkHex = /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/

			if (checkHex.test(hexCode_gene) === false){
				return;	
			} else {
				
				sample_svg_gene.selectAll("rect").remove();
				
				sample_svg_gene.append("svg:rect")
					.attr("width", 20)
					.attr("height", 20)
					.attr("stroke", "black")
					.attr("stroke-width", 3)
					.attr("fill", hexCode_gene);
			}
		}

		function indicateClear(nodes){
			// Clears all circles from the current SVG View by making their opacity 0.
			// Transitions included to make circle removal smooth.
			d3.select("#nodeTable_gene").remove();
			d3.select("#results_gene").remove();
			d3.selectAll(".GSE").remove();

			G_VAR.listNumber = 1;

			for (var i = 0; i < nodes.length; i++){
					nodes[i].circleClear();
					}
				canvas.selectAll("circle")
						.transition().delay(100).duration(2000).ease("linear").attr("r",1e-5)
					.remove();
				canvas.selectAll("text").remove();	
				textMake(nodes, G_VAR.pixels, G_VAR.textColor, G_VAR.textSize);
		}

	//-------------------------------------
	// Manhattan Distance Calculation
	//-------------------------------------

		function fill(nodes, elements, hexCode, width){
			// Fill creates an array of indicated values using delimiter "\n", validates the given hexcode for the selector, 
			// and calls circleMake to create the indicator circles.
			
			var elementList = elements.toUpperCase().split("\n");			
			var checkHex = /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/
			var manhattanNodes = [];
			var checkIndex = {};    // Prevents nodes from being indicated more than once per fill
			// Validate hexCode
			if (checkHex.test(hexCode) == false){
					alert("Not a valid hexCode");
					return;	}

				for (var i in nodes){
					if (elementList.indexOf(nodes[i].searchText) > -1 && !(i in checkIndex)){
						nodes[i].circleMaker(hexCode, 1);
						manhattanNodes.push(nodes[i])
						checkIndex[i] = i;
					}
				}
				
				
			d3.select("div#manhattan").remove();
			
			var nodeOutput = manhattanDistance(manhattanNodes, width); // Contains nodes
			//var pvalue = calculateManhattanPvalue(nodes, width, nodeOutput[0], manhattanNodes.length, 1000);
			//var pvalue = calculatePvalueFromNDist(nodes, width, nodeOutput[0], nodeOutput[1], manhattanNodes.length, 1000)
			//var pvalue = WilcoxonSignedRank(nodes, width, nodeOutput[0], nodeOutput[1], manhattanNodes.length, 1000);
			var zscore = clusterFind(manhattanNodes, width);

			nodeOutput.push(zscore);

			// Create Manhattan Display

			d3.select("#selectionDisplay4").append("div").attr("class", "manhattan").attr("id", "manhattan");
			
			baseTable = d3.select("#manhattan").append("table").attr("class", "contain");
			nodeTable = baseTable.append("td").attr("id", "col1").append("table").attr("id", "manhattan_gene");
			nodeTable.selectAll("th").data(["Selected Nodes"]).enter().append("th").text(function(d){return d });
			nodeTable.selectAll("tr").data(manhattanNodes).enter().append("tr").text(function(d){return d.text;});
			
	
			geneTable = baseTable.append("td").attr("id", "col2").append("table").attr("id", "manhattan_gene")
			geneTable.selectAll("th").data(["Average Pair Distance", "Standard Dev.", "Z-Score"]).enter().append("th").text(function(d){return d;});
			geneTable.append("tr").selectAll("td").data(nodeOutput).enter().append("td").text(function(d){return d.toString().slice(0,6)});


			canvas.selectAll("text").remove();	
			canvas.selectAll("circle").remove();
			indicate = canvas.selectAll("circle");
			textfill = canvas.selectAll("text");
			circleMake(nodes, G_VAR.pixels);
			textMake(G_VAR.nodes, G_VAR.pixels, G_VAR.textColor, G_VAR.textSize);

		}	

		function calculateManhattanPvalue(nodes, width, testValue, selectionLength, numberOfSamples){
			var count = 0;
			var pvalue = 0;

			for (var a = 0; a < numberOfSamples; a++){
				sampleNodes =[];
				checkNum = {};
				while (sampleNodes.length < selectionLength){
					var index = Math.floor(Math.random() * width * width);
					if (index in checkNum){
					} else {
						sampleNodes.push(nodes[index]);
						checkNum[index] = index;
					}
				}

				nodeOutput = manhattanDistance(sampleNodes, width);
				if (testValue > nodeOutput[0]){
					// Greater count means higher p-value.
					// Smaller testValue means greater clustering.
					
					count += 1;
				}
			}

			pvalue = count / numberOfSamples;
			return pvalue;
		}

		function calculatePvalueFromNDist(nodes, width, testAvg, testStdev, selectionLength, numberOfSamples){
			var sumAvg = 0;
			var pvalue = 0;

			for (var a = 0; a < numberOfSamples; a++){
				sampleNodes =[];
				checkNum = {};
				while (sampleNodes.length < selectionLength){
					var index = Math.floor(Math.random() * width * width);
					if (index in checkNum){
					} else {
						sampleNodes.push(nodes[index]);
						checkNum[index] = index;
					}
				}

				nodeOutput = manhattanDistance(sampleNodes, width);
				sumAvg += nodeOutput[0];

			}

			var avgRandom = sumAvg / numberOfSamples;
			var z = (testAvg - avgRandom) / (testStdev * Math.sqrt(2) / Math.sqrt(selectionLength));
			pvalue = normalDistribution(z)
			return pvalue;
		}

		function normalDistribution(z){
			// Error Function has maximum error of 1.5E-7.
			// x is assumed to be positive.
			var t = 1 / (1 + 0.3275911 * z)
			var coeff = [0.254829592, -0.284496736, 1.421413741, -1.453152027, 1.061405429];
			var sumErr = 0;

			for (i = 0; i < coeff.length; i++){
				sumErr += coeff[i] * Math.pow(t, i + 1);
			}

			var valueErr = 1 - sumErr * Math.exp(-Math.pow(z, 2));
			var pvalue = 0.5 * ( 1 + valueErr);

			return pvalue;
		}

		function sign(x){
			if (x < 0){
				return -1;
			} else if (x === 0){
				return 0;
			} else {
				return 1;
			}
		}

		function WilcoxonSignedRank(nodes, width, testAvg, testStdev, selectionLength, numberOfSamples){
			// Nonparametric test using Wilcoxon Signed Rank Test for one-sample. In this variant of the test,
			// the array containing the second sample consists entirely of the testAvg.

			var diff = 0;
			var sumAvg = 0;
			var pvalue = 0;
			var randomAvg = [];
			var diffLen = 0;
			var W = 0; // Test statistic
			var previousVal = 0;
			var exitArray = [];
			var holdRank = [];
			var averageRankSum = 0;
			var averageRank = 0;


			for (var a = 0; a < numberOfSamples; a++){
				sampleNodes =[];
				checkNum = {};

				while (sampleNodes.length < selectionLength){
					var index = Math.floor(Math.random() * width * width);
					if (index in checkNum){
					} else {
						sampleNodes.push(nodes[index]);
						checkNum[index] = index;
					}
				}


				nodeOutput = manhattanDistance(sampleNodes, width);
				randomAvg.push(nodeOutput[0]);
			}

			randomAvg.sort(function(a,b){return(a-b);});
			diffArr = [];

			for (var i = 0; i < numberOfSamples; i++){
				diff = randomAvg[i] - testAvg;
				if (diff !== 0.0){
					diffArr.push([sign(diff), Math.abs(diff)])

				}
			}

			diffLen = diffArr.length;
			diffArr.sort(function(a,b){return a[1] - b[1];});

			for (var i = 0; i < diffLen; i++){
				exitArray.push(diffArr[i]);
				holdRank.push(i+1);
				
				if (previousVal !== diffArr[i][1] || i === diffLen - 1){
					averageRankSum = 0;
					averageRank = 0;
					
					for (var a = 0; a < holdRank.length-1; a++){
						averageRankSum += holdRank[a];
					}
					averageRank = averageRankSum / (holdRank.length-1);
					for (var a = 0; a < exitArray.length-1; a++){
						W += averageRank * exitArray[a][0];
						console.log(W, averageRank, exitArray[a][0])
					}

					holdRank = [i+1];
					exitArray = [diffArr[i]];
					previousVal = diffArr[i][1];
				}
			}

			W = Math.abs(W);
			var sigma = Math.sqrt(diffLen * (diffLen + 1) * ( 2 * diffLen + 1) / 6)

			console.log(sigma)
			var z = (W - 0.5) / sigma;

			pvalue = normalDistribution(z)
			return pvalue;
		}

		function manhattanDistance(nodes, width){
			
			
			var combination = 0, totalDistance = 0, x1 = 0, x2 = 0, y1 = 0, y2 = 0,
				avgDistance = 0, stdev = 0; xdiff = 0; ydiff= 0, distanceArr = [],
				numerator = 0;


			for (var i = (nodes.length - 1); i >= 0; i--){
				x1 = nodes[i].column;
				y1 = nodes[i].row;

				for (var c = (i - 1); c >= 0; c--){
					x2 = nodes[c].column;
					y2 = nodes[c].row;
					xdiff = 0;
					ydiff = 0;

					if (Math.abs(x2 - x1) <= width - Math.abs(x2 - x1)){
						xdiff += Math.abs(x2 - x1);
					} else {
						xdiff += width - Math.abs(x2 - x1);
					}

					if (Math.abs(y2 - y1) <= width - Math.abs(y2 - y1)){
						ydiff += Math.abs(y2 - y1);
					} else {
						ydiff += width - Math.abs(y2 - y1);
					}

					distanceArr.push(xdiff + ydiff)
					totalDistance += (xdiff + ydiff)
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

		function clusterFind(nodes, width){

			// Calculate average Nearest Neighbor
			var totalSum = 0
			for (var chosen = 0; chosen < nodes.length; chosen++){
				nearestDist = 9999;
				x1 = nodes[chosen].column;
				y1 = nodes[chosen].row;
				for (var i = 0; i < nodes.length; i++){
					if (i !== chosen){
						x2 = nodes[i].column;
						y2 = nodes[i].row;

						with (Math){

							xdiff = (abs(x2 - x1) <= width - abs(x2 - x1)) ? abs(x2 - x1) : width - abs(x2 - x1);
							ydiff = (abs(y2 - y1) <= width - abs(y2 - y1)) ? abs(y2 - y1) : width - abs(y2 - y1);
							distance = sqrt(pow(xdiff,2) + pow(ydiff,2));
						}

						if (nearestDist > distance){
							nearestDist = distance;
						}
					}
				}
				totalSum += nearestDist;
			}
			var avgNN = totalSum / nodes.length;
			
			// Calculate Z-Score

			var lambda = width * width / nodes.length;

			var v = lambda * (4 - Math.PI) / (4 * Math.PI);
			var m = Math.sqrt(lambda)/2;
			var z = (avgNN - m) / Math.sqrt(v / nodes.length);


			return z
		}

	//------------------------------
	// Gene Set Enrichment
	//------------------------------

		function geneFill(nodes, elements, hexCode, infoDict, primes, listNumber){
			indicateClear(nodes);
			d3.select("div#manhattan").remove();
			var contA, contB, contC, contD;
			var nodeList = [];		// Stores Fisher Test Results
			var checkHex = /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/;

			

			var elementList = elements.toUpperCase().split("\n");
			var elementAssoc = {};
			var checkList = {};
			var newElementList = []
			for (var index in elementList){
				if (!(elementList[index] in checkList)){
					newElementList.push(elementList[index]);
					checkList[elementList[index]] = elementList[index];
				}
			}

			elementList = newElementList;

			for (var index in elementList){
					elementAssoc[elementList[index]] = elementList[index];
			}

			
			if (checkHex.test(hexCode) == false){
				alert("Not a valid hexCode");
				return;	}
			

			// Create contigency table for Fisher Test
			// contA = Kinase/Element List Intersect, contB = Kinase/Other Genes Intersect
			// contC = Other Kinases/ Element List Intersect, contD = Other kinases/ Other Genes

				
				var totalGeneCount = 0;   // n for 2 x 2 contigency table (A + B + C + D)
				for (var i in infoDict){
					totalGeneCount += infoDict[i];
				}

				var totalElementCount = 0; 	// (A + C) for table

				for (index in elementList){
					if (elementList[index] in infoDict){
						totalElementCount += infoDict[elementList[index]];
					}
				}


				// Calculate pvalue using FisherTest

				for (var i in nodes){
					var info = nodes[i].info.split(", ")
					var contigencyTable = []; 
					contA = 0;

					for (var index in info){
						if (info[index] in elementAssoc){
							contA += 1;
						}
					}

					if (contA !== 0){
						var contB = info.length - contA;
						var contC = totalElementCount - contA;
						var contD = totalGeneCount - contA - contB - contC;
						console.log(contA, contB, contC, contD)
							
							if (contD < 50000){

								var pvalue = fisherExact(contA, contB, contC, contD, primes);
						
								if (isNaN(pvalue) === true){
									pvalue = YatesCorrection(contA, contB, contC, contD);
									console.log("YatesCorrection  ", pvalue, nodes[i].text, contA, contB, contC, contD);
								}

							} else {
								var pvalue = YatesCorrection(contA, contB, contC, contD);
								console.log("YatesCorrection  ", pvalue, nodes[i].text, contA, contB, contC, contD);

							}

						nodeList.push([i, pvalue])
					}
				}


			nodeList.sort(function(a,b){return a[1]-b[1]});
			nodeList = nodeList.slice(0,20);
			nodeOutput = [];
			var manhattanNodes = [];
			for (var i in nodeList){
				var index = nodeList[i][0];
				nodes[index].circleMaker(hexCode, .6 + (.4/i));
				nodeOutput.push([nodes[index].text, nodeList[i][1].toExponential(3)]); 
				manhattanNodes.push(nodes[index])
			}

			manOutput = manhattanDistance(manhattanNodes,G_VAR.width)
			zscore = clusterFind(manhattanNodes, G_VAR.width)
			manOutput.push(zscore)

			circleMake(nodes, G_VAR.pixels);	
			elementList.sort();


			// Creates the table for the Gene Set Enrichment

			d3.select("#selectionDisplay4").append("div").attr("class", "GSE").attr("id", "GSE" + listNumber)
				//.append("p").attr("class", "center").text("List  " + listNumber + " -  ")
				/*.append("svg:svg")
					.attr("id", "GSECanvas" + listNumber)
					.attr("width", 20)
					.attr("height", 20);
			d3.select("svg#GSECanvas" + listNumber).selectAll("rect")
				.data([hexCode]).enter()
				.append("svg:rect")
				.attr("x", 0)
				.attr("y", 0)
				.attr("width", 20)
				.attr("height", 20)
				.attr("stroke", "#000000")
				.attr("stroke-width", 3)
				.style("vertical-align", "bottom")
				.attr("fill", function(d){return d;})*/

			baseTable = d3.select("#GSE" + listNumber).append("table").attr("id", "GSEElement1").attr("class", "contain")
				.on("click", displayGSEChart);	
			baseTable.selectAll("th").data(["Node", "Pvalue"]).enter().append("th").text(function(d){return d;});

			for (index in nodeOutput){
				var tableRow = baseTable.append("tr");
				tableRow.selectAll("td").data(nodeOutput[index]).enter().append("td").text(function(d){return d});
			}
			
			var w = 150;

			var chart = d3.select("div#GSE" + listNumber).append("svg:svg").attr("class", "chart").attr("id", "GSEElement2")
				.attr("height", 20 * nodeOutput.length).attr("width", w)
				.style("display", "none").on("click", displayGSETable);

			chart.append("rect")
				.attr("width", w)
				.attr("height", 20 * nodeOutput.length)
				.attr("opacity", 0);


			var rects = chart.selectAll("rect").data(nodeOutput).enter().append("rect")
				.attr("x", 70)
				.attr("y", function(d,i){return i * 20;})
				.attr("width", function(d,i){return d[1] * w})
				.attr("height", 20)
				.style("stroke", "white")
				.style("fill", "steelblue")
				.text(function(d){return d[1]})

			rects.append("title").text(function(d){return d[1]})


			chart.selectAll("text").data(nodeOutput).enter().append("svg:text")
						.attr("x", 0)
						.attr("y", function(d,i){ return i * 20 + 12;})
						.text(function(d){return d[0]})

			var path = chart.append("svg:path")
				.attr("d", "M " + (70 + 0.05*w) + " 0 L " + (70 + 0.05*w) + " " + 20 * nodeOutput.length)
				.style("stroke", "brown")
				.style("opacity", .5)
				.style("stroke-width", 1)


			path.append("title").text("This line represents p-value = 0.05.")

			G_VAR.listNumber += 1;

			// Adding Manhattan 

			d3.select("#selectionDisplay3").append("div").attr("class", "manhattan").attr("id", "manhattan");
			
			baseTable = d3.select("#manhattan").append("table").attr("class", "contain");
			nodeTable = baseTable.append("td").attr("id", "col1").append("table").attr("id", "manhattan_gene");
			nodeTable.selectAll("th").data(["Selected Nodes"]).enter().append("th").text(function(d){return d });
			nodeTable.selectAll("tr").data(manhattanNodes).enter().append("tr").text(function(d){return d.text;});
			
	
			geneTable = baseTable.append("td").attr("id", "col2").append("table").attr("id", "manhattan_gene")
			geneTable.selectAll("th").data(["Average Pair Distance", "Standard Dev.", "Z-Score"]).enter().append("th").text(function(d){return d;});
			geneTable.append("tr").selectAll("td").data(manOutput).enter().append("td").text(function(d){return d.toString().slice(0,6)});


			canvas.selectAll("text").remove();	
			canvas.selectAll("circle").remove();
			indicate = canvas.selectAll("circle");
			textfill = canvas.selectAll("text");
			circleMake(nodes, G_VAR.pixels);
			textMake(G_VAR.nodes, G_VAR.pixels, G_VAR.textColor, G_VAR.textSize);


			}


			//----------------------------------
			// Fisher Exact Test
			//----------------------------------

				function objectSize(numberDict){
					count = 0
					for(var key in numberDict){
				        if(numberDict.hasOwnProperty(key)){
				        	count += 1;
				        }
				    }
				    return count;
				}

				function populateArray(numberList){
					numberDict = {};
					for (var i = 0; i < numberList.length; i++){
						if (numberList[i] > 1){	
							for (var x = 2; x <= numberList[i]; x++){  	// Factorial of 0 and 1 is equal to 1. Thus, start with 2.
								if (x in numberDict){
									numberDict[x] += 1
								} else {
									numberDict[x] = 1;
								}
							}
						}
					}

					return numberDict;
				}

				function multiplier(numberDict){
					var value = 1;
					for (var index in numberDict){
						if (numberDict[index] !== undefined && isNaN(numberDict[index]) === false){
							value *= Math.pow(index, numberDict[index])
							
							if (isFinite(value) === false){
								break
						}
					}
					}
				
					return value;
				}

				function largestKey(numberDict){
					// Returns key of an object in descending numerical order
					// Order is important for complete extraction using extractValue
					var keys = [];
		  			for(var key in numberDict){
				        if(numberDict.hasOwnProperty(key)){
		            		keys.push(key);
		        		}
		    		}
		    		keys.sort(function(a,b){return b-a});
				    return keys[0];
				}

				function extractValue(numberDict, value){
					// Extracts all instances of the value from the numberDict and puts it into its own entry.
					var bigKey = largestKey(numberDict);
					if (typeof(numberDict[value]) === undefined || isNaN(numberDict[value]) === true){
						numberDict[value] = 0;
					}

					for (var key = bigKey; key > value; key-- ){
							if (key % value === 0 && numberDict[key] != undefined){			
								var entry = key/value;
								if (value === entry){
									// In the case of a squared prime
									numberDict[value] += (2 * numberDict[key]);
								} else if (entry in numberDict){
									numberDict[entry] += numberDict[key];
									numberDict[value] += numberDict[key];
								} else {
									numberDict[entry] = numberDict[key];
									numberDict[value] += numberDict[key];
								}

								delete numberDict[key];

							}
						}

					return numberDict;
				}

				function removeCommonFactors(numDict, demDict){
					for (var index in numDict){
						if (index in demDict){
							if (numDict[index] === demDict[index]){
								delete numDict[index];
								delete demDict[index];

							} else if (numDict[index] < demDict[index]){
								demDict[index] -= numDict[index]; 
								delete numDict[index];
							} else {
								numDict[index] -= demDict[index];
								delete demDict[index];
							}
						}
					}
					return [numDict, demDict];
				}

				function fisherExact(contA, contB, contC, contD, primes){
					
					var numList = [(contA + contB), (contC + contD), (contA + contC), (contB + contD)];
					var demList = [contA, contB, contC, contD, (contA + contB + contC + contD)];
					var numDict = populateArray(numList);
					var demDict = populateArray(demList);
					var dictArray = [];
					var numerator = 0;
					var denominator = 0;
					var pvalue = 0;

					dictArray = removeCommonFactors(numDict, demDict);
					numDict = dictArray[0];
					demDict = dictArray[1];
					numerator = multiplier(numDict);
					denominator = multiplier(demDict);
					pvalue = numerator / denominator;


					if (isFinite(denominator) === true){
						return pvalue;
					}


					for (var i = 0; i < primes.length; i++){
						numDict = extractValue(numDict, primes[i]);
						demDict = extractValue(demDict, primes[i]);
						dictArray = removeCommonFactors(numDict, demDict);
						numDict = dictArray[0];
						demDict = dictArray[1];
						numerator = multiplier(numDict);
						denominator = multiplier(demDict);
						pvalue = numerator/denominator
						if (isFinite(denominator) === true){
							return pvalue;
						} 
					}

					console.log(contA, contB, contC, contD);
					return NaN;
				} 


			//----------------------------------
			// Chi-Square Test 
			//----------------------------------


				function YatesCorrection(contA, contB, contC, contD){
					// Calculates the chi-square from the 2 x 2 contigency table. Afterwards, the pvalue is calculated from this chi value.			
					// The chi-squared value calculated is corrected using Yates Correction.
						var numerator = (contA + contB + contC + contD) * 
										Math.pow(
											(Math.abs(contA * contD - contB * contC) - (contA + contB + contC + contD) / 2), 2);
						
						var denominator = (contA + contB) * (contC + contD) * 
										  (contA + contC) * (contB + contD);

						var chi = numerator / denominator; 
						var pvalue = chi2Pvalue(chi)
						return pvalue;
					}

				function poz(z){
					/*  The following JavaScript function for calculating normal and
				        chi-square probabilities and critical values were adapted by
				        John Walker from C implementations
				        written by Gary Perlman of Wang Institute, Tyngsboro, MA
				        01879.  Both the original C code and this JavaScript edition
				        are in the public domain.  */

				    /*  POZ  --  probability of normal z value

				        Adapted from a polynomial approximation in:
				                Ibbetson D, Algorithm 209
				                Collected Algorithms of the CACM 1963 p. 616
				        Note:
				                This routine has six digit accuracy, so it is only useful for absolute
				                z values < 6.  For z values >= to 6.0, poz() returns 0.0.
				    */

						var y, x, w;
						var Z_MAX = 6.0;

							y = 0.5 * Math.abs(z);
							if (y >= (Z_MAX * .5)){
								x = 1.0;
							} else if (y < 1.0){
								w = y * y;
								x = ((((((((0.000124818987 * w
			                         - 0.001075204047) * w + 0.005198775019) * w
			                         - 0.019198292004) * w + 0.059054035642) * w
			                         - 0.151968751364) * w + 0.319152932694) * w
			                         - 0.531923007300) * w + 0.797884560593) * y * 2.0;
				            } else {
				                y -= 2.0;
				                x = (((((((((((((-0.000045255659 * y
				                               + 0.000152529290) * y - 0.000019538132) * y
				                               - 0.000676904986) * y + 0.001390604284) * y
				                               - 0.000794620820) * y - 0.002034254874) * y
				                               + 0.006549791214) * y - 0.010557625006) * y
				                               + 0.011630447319) * y - 0.009279453341) * y
				                               + 0.005353579108) * y - 0.002141268741) * y
				                               + 0.000535310849) * y + 0.999936657524;


							}
						return z > 0.0 ? ((x + 1.0) * 0.5) : ((1.0 - x) * 0.5);
					}


					function chi2Pvalue(x){
						//Chi2Pvalue converts a chi-value to a pvalue using one degree of freedom.
						var pvalue;
						var z = -Math.sqrt(x)
						if (x <= 0 || z == 0.0){
							return 1;
						}
						pvalue = 2.0 * poz(z);
						return pvalue;
					}		

					

	//-----------------------------
	// Canvas Options Functionality
	//-----------------------------

		function canvasColorChange(nodes, hexCode){
			// Changes the color of the canvas according to a user-given hexcode. The default is #00FFFF.
			// canvasColorChange returns nothing if the hexcode given is invalid. 
			
			var checkHex = /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/

			if (checkHex.test(hexCode) === false){
				return;
			} else {
				G_VAR.canvasHex = hexCode;	
				var canvasRGB = [];
				for (var i=1; i<7; i=i+2){
					var canvasElement = parseInt(hexCode.slice(i,i+2), 16);
					canvasRGB.push(canvasElement);
				}

				}

			G_VAR.canvasRGB = canvasRGB;

			for (var i = 0; i < nodes.length; i++){
				nodes[i].colorizer(G_VAR.scale, canvasRGB);
			}
			
			canvas.selectAll("rect").remove();
			rectMake(nodes, G_VAR.pixels);
		}

		function scaleColor(nodes, avgWeight, modWeight, canvasRGB, pixels, textColor, textSize){
			// Modifies the color scaling of the SVG, giving greater contrast to similarly colored elements.

			if (avgWeight != 1.0){
				var scale = Math.log(modWeight)/Math.log(avgWeight);
			}
			
			for (var i = 0; i < nodes.length; i++){
				nodes[i].colorizer(scale, canvasRGB);
			}
			weight_visualize(nodes, pixels, textColor, textSize);	
			G_VAR.scale = scale;

		}


		function resize(nodes, pixels, textColor, textSize){
			// Resizes the canvas based on the Node Size scale.
			
			G_VAR.pixels = pixels;
			for (var i = 0; i < nodes.length; i++){
				nodes[i].canvasChange(pixels);	}
			d3.select("svg#mainSVG").remove();

			createCanvas(G_VAR.width, pixels);
			weight_visualize(nodes, pixels, textColor, textSize);
			canvas.on("mousedown", find);
			zoomSelect(G_VAR.zSelect)
		}	


		function invert(nodes, invertColor, scale, canvasRGB, pixels, textColor, textSize){
			// Inverts the color of the canvas based on the Invert Color checkbox.
			
			G_VAR.invertColor = (G_VAR.invertColor == 0) ? 1 : 0;
			document.getElementById("changeDescription").innerHTML = (G_VAR.invertColor == 1) ? "inversely" : "directly";
			for (var i = 0; i < nodes.length; i++){
				nodes[i].colorizer(scale, canvasRGB);
			}	
			weight_visualize(nodes, pixels, textColor, textSize);
		}


		function centerCanvas(nodes, pixels, textColor, textSize, width){
			// Centers canvas with current attributes on click.
			G_VAR.scaleZoom = 1;
			G_VAR.translateZoom = [0,0];
			d3.select("svg#mainSVG").remove();
			createCanvas(width, pixels);
			weight_visualize(nodes, pixels, textColor, textSize);
			canvas.on("mousedown", find);
			zoomSelect(G_VAR.zSelect)
		}

		function resetColorScale(nodes, canvasRGB, pixels, textColor, textSize){
			var scale = 1.00;
			for (var i = 0; i < nodes.length; i++){
				nodes[i].colorizer(scale, canvasRGB);
			}
			weight_visualize(nodes, pixels, textColor, textSize);
			G_VAR.scale = scale; 

			document.getElementById('colorScale').innerHTML = G_VAR.avgWeight.toString().slice(0,4);
			document.getElementById('range_colorScale').value = G_VAR.avgWeight.toString().slice(0,4);
		}
	//------------------------------
	// Text Options
	//------------------------------

		function textColorChange(nodes, textHexCode){
			// textColorChange checks to see if the hexcode given is valid and then colors the text based on the hexcode
			// textColorChange's effects will not be seen if G_VAR.textVisible is false (0).

			var checkHex = /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/

			if (checkHex.test(textHexCode) === false){
				return;
			}

			G_VAR.textColor = textHexCode;
			canvas.selectAll("text").remove();
			textMake(G_VAR.nodes, G_VAR.pixels, G_VAR.textColor, G_VAR.textSize);
		}

		function textSizeChange(nodes, textSize){
			// Validates the number given and changes the size of the text (in pixels).
			// Effects are not seen if G_VAR.textVisible is false(0).
			var checkNum = /[0-9]+/
			if (checkNum.test(textSize) == true){
				G_VAR.textSize = textSize;
				canvas.selectAll("text").remove();
				textMake(G_VAR.nodes, G_VAR.pixels, G_VAR.textColor, G_VAR.textSize);
			}
		}

		function showText(textVisible){
			// Connected to the Show Text checkbox. Toggles the text object's appearance.
			G_VAR.textVisible = (textVisible == 0) ? 1 : 0;
			canvas.selectAll("text").remove();
			textMake(G_VAR.nodes, G_VAR.pixels, G_VAR.textColor, G_VAR.textSize);
		}

	//------------------------------
	// Canvas Creation Functionality
	//------------------------------

		function initializeIt(json, infos){	

			var weights = json['weights'];
			var textArray = json['texts'];

			// Main function.	
			G_VAR = {	
						primes: [2, 3, 5, 7, 11, 13],
						listNumber: 1,

						// TextMap Placeholder
						textMap: {},
						
						// Text Attributes
						
						textVisible: 0,
						textColor: "#FFFFFF",
						textSize: 10,
						
						//nodes Display
						
						nodes: [],  // nodes Container
						width: Math.sqrt(weights.length),
						canvasSize: 275,
						pixels: 0,          // Default Pixel Size
						invertColor: 0,
						scale: 1,
						canvasHex : "#00FFFF",
						canvasRGB : [0,255,255],
						avgWeight : 0,

						// BoxSelection
							
							// For the encompassing of all
							startRow: 0,
							startColumn: 0,
							endRow: 0,
							endColumn: 0,

							// For creating an animated box

							selectStartRow: 0,
							selectStartColumn: 0,
							selectMouseDown: 0,

						// Scale and Translate Track

						scaleZoom: 1,
						translateZoom: [0,0], 
						zSelect: 0
					}

			G_VAR.pixels = G_VAR.canvasSize / G_VAR.width;
			for (var i = 0; i < weights.length; i++){
				G_VAR.avgWeight += weights[i] / weights.length / 8; 	
			}
			console.log(G_VAR.avgWeight)

			if (G_VAR.avgWeight != 1.0){
				G_VAR.scale = Math.log(0.25)/Math.log(G_VAR.avgWeight);
			}


			for (var i = 0; i < weights.length; i++){
				var info = infos[textArray[i]] || "None";
				if (info !== "None"){
					info = info.slice(1).join(", ")
				}
				var node = new NodeObj(i, weights[i], textArray[i], info.toUpperCase(), G_VAR.width, G_VAR.pixels);
				//G_VAR.avgWeight += weights[i] / weights.length / 8;
				node.colorizer(G_VAR.scale, G_VAR.canvasRGB);
				G_VAR.nodes.push(node);
			}

			

			G_VAR.textMap = textMapper(G_VAR.nodes, G_VAR.width)
			G_VAR.infoDict = infoDictMaker(infos)
			
			return G_VAR;
		}
			//Creates the sample squares used by the Element and Gene Enrinchment selection to display a color.
		function samplerCreate(){
			sample_svg = d3.select("em#samples").append("svg:svg")
						.attr("id", "sample");

			sample_svg.append("svg:rect")
					.attr("width", 20)
					.attr("height", 20)
					.attr("stroke", "black")
					.attr("stroke-width", 3)
					.attr("fill", "#FFFFFF");
					
			sample_svg_gene = d3.selectAll("em#sample_gene").append("svg:svg")
						.attr("id", "sample_gene");
						
			sample_svg_gene.append("svg:rect")
					.attr("width", 20)
					.attr("height", 20)
					.attr("stroke", "black")
					.attr("stroke-width", 3)
					.attr("fill", "#FFFFFF");
		}
			
		function visualizeIt(G_VAR){
			
			createCanvas(G_VAR.width, G_VAR.pixels);	
			weight_visualize(G_VAR.nodes, G_VAR.pixels, G_VAR.textColor, G_VAR.textSize);
			canvas.on("mousedown", find);

			//document.getElementById('colorScale').innerHTML = Math.exp(G_VAR.scale * Math.log(G_VAR.avgWeight)).toString().slice(0,4);
			//document.getElementById('range_colorScale').value = Math.exp(G_VAR.scale * Math.log(G_VAR.avgWeight)).toString().slice(0,4);
			//document.getElementById('pixelText').innerHTML = G_VAR.pixels.toString();
			//	document.getElementById('resizer').value = G_VAR.pixels.toString();
		}
			
		function textMapper(nodes, width){
			// Maps text information for Node and Additional Information display based on row and column position
			// Used in conjunction with the find() function to return Node Name and Additional Information
			var column = 0;
			var row = 0;
			var textMap = [];
			var myRow = [];
			for (index in nodes){
				column = nodes[index].column;
				row = nodes[index].row;
				myRow[column] = index;
				if (myRow.length == width){
					textMap[row] = myRow;
					myRow = [];
				}
			}
			return textMap;
		}

		function circleMake(nodes, pixels){
			
			var radius = Math.floor(pixels/2.5)

			for (var i = 0; i < nodes.length; i++){
				var node = nodes[i];
				if (node.circles.length !== 0){
					circles = indicate.data(node.circles).enter().append("svg:circle");
					circles.attr("cx", node.columnPixels + pixels/2)
						.attr("cy", node.rowPixels + pixels/2)
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

			for (var i = 0; i < nodes.length; i++){
				var node = nodes[i];
				rects = rect.data([node]).enter().append("svg:rect");
				rects.attr("x", function(d){ return d.columnPixels;})
							.attr("y", function(d) { return d.rowPixels;})
							.attr("width", pixels)
							.attr("height", pixels)
							.attr("fill", function(d) {return d.color});
				rects.append("title")
			        .text(function(d) { return d.text; });
			}
		}		

		function textMake(nodes, pixels, textColor, textSize){
			// Defines the text attributes. Position, color, size, and opacity are controlled here.

			for (var i = 0; i < nodes.length; i++){
				var node = nodes[i];
				texts = textfill.data([node]).enter().append("svg:text");	
				texts.attr("x", function(d) {return (d.columnPixels)+pixels/2;})
					.attr("y", function(d) {return (d.rowPixels)+pixels/2+2;})
					.attr("text-anchor", "middle")
					.attr("fill", textColor)
					.style("font-size", textSize)
					.style("font-family", "Arial")
			
			texts.append("title")
				.text(function(d) {return d.text;} );
				
			if (G_VAR.textVisible === 1){
				texts.text(function(d) {return d.text;});
				}
			}
		}

		function weight_visualize(nodes, pixels, textColor, textSize){
			// Removes all elements of canvas and then recreates those elements
			// Object removal prevents multiple elements from appearing when the SVG is downloaded.
			
			canvas.selectAll("rect").remove();
			canvas.selectAll("circle").remove();
			canvas.selectAll("text").remove();
			rectMake(nodes, pixels);
			circleMake(nodes, pixels);
			textMake(nodes, pixels, textColor, textSize);
		}

		function createCanvas(width, pixels){
			// Creates the canvas. Called during initialization, centering, or resizing the SVG canvas.
			canvas = d3.select("div#svgContainer")
						.append("svg:svg")
						.attr("id","mainSVG")
						.attr("width", width * pixels)
						.attr("height", width * pixels)
						.attr("pointer-events", "all")
					  .append('svg:g')
						.attr("id", "zoomLayer")
						.call(d3.behavior.zoom().on("zoom", redraw))
					  .append('svg:g')
						.attr("id","main");
				
			zoomSelect(G_VAR.zSelect);



			// Fill Canvas with Weights and Names
			rect = canvas.selectAll("rect");
			indicate = canvas.selectAll("circle");
			textfill = canvas.selectAll("text");
		}

		function NodeObj(index, weigh, text, info, width, pixels){
		
			this.index = index;
			this.weight = weigh;
			this.text = text;
			this.searchText = text.toUpperCase();
			this.info = info;
			
			this.column = index%width;
			this.row = Math.floor(index/width);
			
			this.columnPixels = index%width * pixels;
			this.rowPixels = Math.floor(index/width) * pixels;


			this.circles = [];

			
			
			this.circleMaker = function(hexCode, opacity){
				var adjust = Math.pow(0.7, this.circles.length);
				this.circles.push([this.text, hexCode, adjust, opacity]);
			}
				
			this.circleClear = function(){
				this.circles = [];
			}
			
			this.colorizer = function (scale, canvasRGB){
				var hexArray =["#"];
					for (i=0; i<3; i++){
						if (canvasRGB[i] === 0){
							hexArray.push("00");
						} else {
							var oriNum = (G_VAR.invertColor === 0) ? Math.floor(canvasRGB[i]*Math.pow(this.weight, scale)/Math.pow(8, scale)) : Math.floor(canvasRGB[i]-canvasRGB[i]*Math.pow(this.weight, scale)/Math.pow(8, scale));
							var hexNum = oriNum.toString(16);
							if (hexNum.length === 1){
								hexNum = '0' + hexNum;
							}
							hexArray.push(hexNum);
						}
					}
				this.color = hexArray.join("");
				}
				
			this.canvasChange = function(pixels){
					this.columnPixels = this.column * pixels;
					this.rowPixels = this.row * pixels;
					}
		}

		function infoDictMaker(infos){
			// Creates a dictionary from the GMT Files inputted
			// The dictionary counts how many times an element appears in the file.
			infoDict = {};
			for (var line in infos){
				elements = infos[line];
				for (var i = 1; i < elements.length; i++){
					if (elements[i] in infoDict){
						infoDict[elements[i]] += 1;
					} else {
						infoDict[elements[i]] = 1;
					} 
				}
			}
			return infoDict;
		}

	//---------------------------------------
	// Gene Count Selection and Zoom Features
	//---------------------------------------
	
		function zoomSelect(zSelect){
			//0 is Zoom. 1 is Select.
			//Toggle Zoom

			G_VAR.zSelect = zSelect;

			if (zSelect === 0){
				
				d3.select("#zoomLayer").on("mousedown", null);
				d3.select("#zoomLayer").on("mouseup", null);
				d3.select("#zoomLayer").on("mousemove", null);
				d3.select("#zoomLayer").call(d3.behavior.zoom().on("zoom", redraw));

			} else {
			
			d3.select("#zoomLayer").call(d3.behavior.zoom().on("zoom", null));
			d3.select("#zoomLayer").on("mousedown", preSelection);
			d3.select("#zoomLayer").on("mousemove", selectionSizing);
			d3.select("#zoomLayer").on("mouseup", boxSelection);
			}
		}

		function preSelection(){

			G_VAR.selectMouseDown = 1;	//Mousedown Check for selectionSizing Later

			d3.selectAll("path").remove()
			var m = d3.svg.mouse(this);
			var pixels = G_VAR.pixels;

			G_VAR.selectStartColumn = m[0];
			G_VAR.selectStartRow = m[1];


			column = Math.floor((m[0]-G_VAR.translateZoom[0])/G_VAR.scaleZoom/pixels);
			row = Math.floor((m[1]-G_VAR.translateZoom[1])/G_VAR.scaleZoom/pixels);
			G_VAR.startColumn = column; 
			G_VAR.startRow = row;
		}

		function selectangleMaker(rowStart, rowEnd, columnStart, columnEnd, translate, zoomScale, pixels, pixelOrColumn){

			if (pixelOrColumn === "column"){
				var rowStart = rowStart * pixels;
				var rowEnd = ( rowEnd + 1) * pixels;
				var columnStart = columnStart * pixels;
				var columnEnd = (columnEnd + 1) * pixels;

			}	else if (pixelOrColumn === "pixel"){
				// Compensate for Zoom and Translation

				rowStart = (rowStart - translate[1]) / zoomScale;
				rowEnd = (rowEnd - translate[1]) / zoomScale;
				columnStart = (columnStart - translate[0]) / zoomScale;
				columnEnd = (columnEnd - translate[0]) / zoomScale;
			}


			var startingPoint = ["M", columnStart, rowStart].join(" ");
			var line1 = ["L", columnEnd, rowStart].join(" ");
			var line2 = ["L", columnEnd, rowEnd].join(" ");
			var line3 = ["L", columnStart, rowEnd].join(" ");
			var line4 = ["L", columnStart, rowStart].join(" ");
			
			var	pathString = [startingPoint, line1, line2, line3, line4].join(" ");

			d3.selectAll("path").remove();
			d3.selectAll(".selecTangle").remove();
			
			canvas.append("svg:path")
						.attr("d", pathString)
						.attr("opacity", 0.4)
						.style("stroke", "#FFFF00")
						.style("stroke-width", 2)
						.style("fill-opacity", 0.1)
						.style("fill", "#333333");
		}

		function selectionSizing(){
			var m =d3.svg.mouse(this);
			if (G_VAR.selectMouseDown === 1){
				// Create path information - selection box	
				selectangleMaker(G_VAR.selectStartRow, m[1], G_VAR.selectStartColumn, m[0], 
								 G_VAR.translateZoom, G_VAR.scaleZoom, G_VAR.pixels, "pixel")	
			}
		}

		function GeneObj(gene, count){
			this.gene = gene;
			this.count = count;	
		}

		function boxSelection(){
			G_VAR.selectMouseDown = 0;

			d3.select("#geneTable").remove();
			d3.select("#nodeTable").remove();
			var m = d3.svg.mouse(this);
			var pixels = G_VAR.pixels;
			column = Math.floor((m[0]-G_VAR.translateZoom[0])/G_VAR.scaleZoom/pixels);
			row = Math.floor((m[1]-G_VAR.translateZoom[1])/G_VAR.scaleZoom/pixels);

			if (G_VAR.startColumn === column && G_VAR.startRow === row){
				d3.selectAll("path").remove(); 
				return; 
			}
			// If the starting row/column is larger than the end row/column. Swap them.
			
			if (G_VAR.startRow > row){ 
				G_VAR.stopRow = G_VAR.startRow; G_VAR.startRow = row;
			} else {
				G_VAR.stopRow = row;
			}
			
			if (G_VAR.startColumn > column){ 
				G_VAR.stopColumn = G_VAR.startColumn; G_VAR.startColumn = column; 
			} else { 
				G_VAR.stopColumn = column; 
			}

			// AutoSnap for Box - Precisely Select All Nodes. + Add the Titles for Mouseover

				selectangleMaker(G_VAR.startRow, G_VAR.stopRow, G_VAR.startColumn, G_VAR.stopColumn, 
								 G_VAR.translateZoom, G_VAR.scaleZoom, G_VAR.pixels, "column")


			// Identify selected nodes and keep a running count of the genes associated with the nodes.
			var selectedNodes = [];
			var geneList = {}
			for (r = G_VAR.startRow; r <= G_VAR.stopRow; r++){
				var rowMap = G_VAR.textMap[r];
				for(c = G_VAR.startColumn; c <= G_VAR.stopColumn; c++){
						
					// Add Mouseover Title
					var selecTangle = canvas.append("svg:rect").attr("class", "selecTangle")
							.attr("x", c * G_VAR.pixels)
							.attr("y", r * G_VAR.pixels)
							.attr("width", G_VAR.pixels)
							.attr("height", G_VAR.pixels)
							.attr("opacity", 0);
					selecTangle.append("title")
		        		.text(G_VAR.nodes[rowMap[c]].text)


		        	// Count Genes

					selectedNodes.push(G_VAR.nodes[rowMap[c]].text);
					var infoList = G_VAR.nodes[rowMap[c]].info.split(", ");
					for (var index in infoList){
						if (infoList[index] in geneList){
							geneList[infoList[index]].count += 1;
						} else {
							geneList[infoList[index]] = new GeneObj(infoList[index], 1);
						}
					}
				}
			}
			var geneOutput = []
			for (index in geneList){
				geneOutput.push([geneList[index].gene, geneList[index].count])
			}
			selectedNodes.sort();
			geneOutput.sort(function(a,b){return b[1] - a[1]});
			geneOutput = geneOutput.slice(0,20)
			
			nodeTable = d3.select("#selectionDisplay3").append("table").attr("id", "nodeTable");
			nodeTable.selectAll("th").data(["Selected Nodes"]).enter().append("th").text(function(d){return d;});
			nodeTable.selectAll("tr").data(selectedNodes).enter().append("tr").text(function(d){return d});
			


			geneTable = d3.select("#selectionDisplay3").append("table").attr("id", "geneTable")
			geneTable.selectAll("th").data(["Genes", "Count"]).enter().append("th").text(function(d){return d;});

			for (index in geneOutput){
				var tableRow = geneTable.append("tr")
				tableRow.selectAll("td").data(geneOutput[index]).enter().append("td").text(function(d){return d});
			}


			// Shows the Tab and Display that corresponds to this function

		}


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

	//-------------------------
	// Menu/Tab/Display + Label Display
	//-------------------------


		function seePixels(pixels){
			// Shows the current node size on the Node Size option.
			document.getElementById('pixelText').innerHTML=pixels;
		}

		function seeScale(scale){
			// Shows the current color scale value on the ColorScale option.
			document.getElementById('colorScale').innerHTML=scale.slice(0,5);
		}

		function displayTab(form_number){
				for (i = 1 ; i < 5 ; i++){
					if (i === form_number){
						document.getElementById('form'+i).style.display = 'block';
						document.getElementById('tab'+i).style.fontWeight = '700';
					}
					else{
						document.getElementById('form'+i).style.display = 'none';
						document.getElementById('tab'+i).style.fontWeight = '400';
					}
				}
		}

		function displaySelection(form_number){
				for (i = 1 ; i < 3 ; i++){
					if (i === form_number){
						document.getElementById('selectionForm'+i).style.display = 'block';
						document.getElementById('selection'+i).style.fontWeight = '700';
					}
					else{
						document.getElementById('selectionForm'+i).style.display = 'none';
						document.getElementById('selection'+i).style.fontWeight = '400';
					}
				}
		}

		function displayDisplay(form_number){
				for (i = 1 ; i < 4 ; i++){
					if (i === form_number){
						document.getElementById('selectionDisplay'+i).style.display = 'block';
						document.getElementById('selectDisplay'+i).style.fontWeight = '700';
					}
					else{
						document.getElementById('selectionDisplay'+i).style.display = 'none';
						document.getElementById('selectDisplay'+i).style.fontWeight = '400';
					}
				}
		}

		function displayGSETable(){
			var form_number = 1;
			for (i = 1 ; i < 3; i++){
				if (i === form_number){
						document.getElementById('GSEElement'+i).style.display = 'block';
					}
					else{
						document.getElementById('GSEElement'+i).style.display = 'none';
					}
				}

		}

		function displayGSEChart(){
			var form_number = 2;
			for (i = 1 ; i < 3; i++){
				if (i === form_number){
						document.getElementById('GSEElement'+i).style.display = 'block';
					}
					else{
						document.getElementById('GSEElement'+i).style.display = 'none';
					}
				}

		}

		function find(){
			// Uses the textMap to get Node Name and Additional Information and places it into the Display Info div.
			
			var pixels = G_VAR.pixels;
			var m = d3.svg.mouse(this);
			column = Math.floor(m[0]/pixels);
			row = Math.floor(m[1]/pixels);
			G_VAR.startColumn = column;    // For the potential zoom-in
			G_VAR.startRow = row;
			index = G_VAR.textMap[row][column];
			document.getElementById('nodeName').innerHTML = G_VAR.nodes[index].text;
			document.getElementById('additionalInfo').innerHTML = G_VAR.nodes[index].info;
		}

		function displaySVG(index, container, previousIndex, globvar){
			indicateClear(globvar.nodes)
			container[previousIndex] = globvar;
			d3.selectAll(".manhattan").remove();
			d3.select("#mainSVG").remove();
			G_VAR = container[index]
			G_VAR.textVisible = globvar.textVisible;
			G_VAR.textColor = globvar.textColor;
			G_VAR.textSize = globvar.textSize;
			G_VAR.invertColor = globvar.invertColor;
			G_VAR.canvasHex = globvar.canvasHex;
			G_VAR.canvasRGB = globvar.canvasRGB;
			

			G_VAR.zSelect = globvar.zSelect;
		
			for (var i = 0; i < G_VAR.nodes.length; i++){
				G_VAR.nodes[i].colorizer(G_VAR.scale, G_VAR.canvasRGB);
			}
			
			G_VAR.scaleZoom = 1;
			G_VAR.translateZoom = [0,0];
			visualizeIt(G_VAR);
			return index;
}	
