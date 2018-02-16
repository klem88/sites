// TRADUCTION
var lang = window.location.search.split('=')[1];
if (lang == 'fr') {

	d3.select('#paramlinklabellib').text('Livres en commun :');

	d3.select('#allInstitutionslib').text('Institutions :');
	d3.select('#allInstitutions').text('Toutes');
	d3.select('.showInstitutionsDiv').text('Modifier');

	d3.select('#allPublisherslib').text('Editeurs :')
	d3.select('#allPublishers').text('Tous');
	d3.select('.showPublishersDiv').text('Modifier');

	d3.select('#allThemeslib').text('Mots clés 1 :')
	d3.select('#allThemes').text('Tous');
	d3.select('.showDecitreDiv').text('Modifier');

	d3.select('#allCyberclasslib').text('Mots clés 2 :')
	d3.select('#allCyberclass').text('Tous');
	d3.select('.showCyberclassDiv').text('Modifier');

	var allinstitutionskeyword = 'Toutes';
	var allpublisherskeyword = 'Tous';
	var alldecitrekeywords = 'Tout le thesaurus 1';	
	var allCyberclasskeywords = 'Tout le thesaurus 2';	

	d3.select('#headerlogo').attr('src', 'images/mainLogo_fr.jpg');

} else if (lang == 'en') {
	d3.select('#paramlinklabellib').text('Books in common :');

	d3.select('#allInstitutionslib').text('Institutions :');
	d3.select('#allInstitutions').text('All');
	d3.select('.showInstitutionsDiv').text('Modify');

	d3.select('#allPublisherslib').text('Publishers :')
	d3.select('#allPublishers').text('All');
	d3.select('.showPublishersDiv').text('Modify');

	d3.select('#allThemeslib').text('Thesaurus 1 :')
	d3.select('#allThemes').text('All');
	d3.select('.showDecitreDiv').text('Modify');

	d3.select('#allCyberclasslib').text('Thesaurus 2 :')
	d3.select('#allCyberclass').text('All');
	d3.select('.showCyberclassDiv').text('Modify');

	var allinstitutionskeyword = 'All institutions';
	var allpublisherskeyword = 'All publishers';
	var alldecitrekeywords = 'All thesaurus 1';
	var allCyberclasskeywords = 'All thesaurus 2';

	d3.select('#headerlogo').attr('src', 'images/mainLogo_en.jpg');
};

// SET THE VARIABLES
var publivalue = [allpublisherskeyword];
var decitrevalue = [alldecitrekeywords];
var cyberclassvalue = [allCyberclasskeywords];
var nodevalue = [allinstitutionskeyword];

var nodeslinksrange = [5, 15];
var nodesradiusrange = [15, 35];
var zoomextent = [1, 5];

var linkopacity_off = 0.1;
var linkopacity_on = 0.6;

var labelopacity_off = 0.4;
var labelopacity_on = 1;

var coverheight = 100;
var start_nb = 0;
var fontsizeOnmouseover = '120%';
var fontsize = '60%';

var nbcoverstoshow = 20;
var idle = 0;

//var color = d3.scaleOrdinal(d3.schemeCategory20);
//Additional colors from https://jnnnnn.blogspot.fr/2017/02/distinct-colours-2.html
var color = d3
	.scaleOrdinal()
	.range(d3.schemeCategory20.concat(["#1b70fc", "#d50527", "#158940", "#f898fd", "#24c9d7", "#cb9b64", "#866888", "#22e67a", "#e509ae", "#9dabfa", "#437e8a", "#b21bff", "#ff7b91", "#94aa05", "#ac5906", "#82a68d", "#fe6616", "#7a7352", "#f9bc0f", "#b65d66", "#07a2e6", "#c091ae", "#8a91a7", "#88fc07", "#ea42fe", "#9e8010", "#10b437", "#c281fe", "#f92b75", "#07c99d", "#a946aa", "#bfd544", "#16977e", "#ff6ac8", "#a88178", "#5776a9", "#678007", "#fa9316", "#85c070", "#6aa2a9", "#989e5d", "#fe9169", "#cd714a", "#6ed014", "#c5639c", "#c23271", "#698ffc", "#678275", "#c5a121", "#a978ba", "#ee534e", "#d24506", "#59c3fa", "#ca7b0a", "#6f7385", "#9a634a", "#48aa6f", "#ad9ad0", "#d7908c"]));

var width = '100vw';
var height = '100vh';

// SCHOLARVOX
var linkvalue = 250;
var minlinkvaluewithall = 100;
var whichdataset = 'scholarvoxgraphe20.json';
var metadataurl = 'metadata20.json';
var baseurl = '/catalog/?';
var imgurl = 'http://www.lilliadvis.io/static/books_upload/136pix/';

// BIBLIOVOX
/*var linkvalue = 30;
var minlinkvaluewithall = 1;
var whichdataset = 'bibliovoxgraphe7.json';


// INTERNATIONAL
var linkvalue = 120;
var minlinkvaluewithall = 1;
var whichdataset = 'internationalgraphe2.json';
*/

//SET THE ZOOM HANDLER
var zoom = d3
	.zoom()
	.scaleExtent(zoomextent)
	.on("zoom", zoomed);

// SET THE TIMEOUT
d3.interval(function(){ 
	idle += 1;
	console.log(idle);
	if (idle >= 36) window.open('/welcome', '_self');
}, 5000);

// SET THE DIV AND SGV AND G
d3
	.select('.graphVisualisation')	
	.append('svg')
	.attr('class', 'svggraph')
	.attr('width', width)
	.attr('height', height)
	.on('mousemove scroll touchstart touchmove', function(){ idle = 0 })
	.call(zoom);

var svg = d3
	.select(".svggraph")
	.append('g')
	.attr('class', 'gcontainer');

svg
	.append("g")
	.attr("class", "allcoversFR");

svg
	.append("g")
	.attr("class", "allcoversEN");

svg
	.append("g")
	.attr("class", "alllinks");

svg
	.append("g")
	.attr("class", "allnodes");

svg
	.append("g")
	.attr("class", "alltextnodes");


// SET THE FORCES
var simulation = d3
	.forceSimulation()
	.force(
		"link", d3
			.forceLink()
			.id(function(d) {return d.id; }) //Permet de faire le lien entre Nodes et Links (by "id")
	)
	.force(
		"charge", d3
			.forceManyBody()
			.strength(function(d){ return -1000; })
		)

	//.force("center", d3.forceCenter(width / 2, height * 2 / 3))
	.force("x", d3.forceX().x(function(d) { return parseInt(d3.select('.svggraph').style('width'), 10) / 2; }).strength(.25))
	.force("y", d3.forceY().y(function(d) { return parseInt(d3.select('.svggraph').style('height'), 10) / 2; }).strength(.25))
	.force("collide",d3.forceCollide( function(d) { return nodescale(d.nodesize) + 15; } ).strength(1).iterations(1) )
	.alphaMin(.01)
	.alphaDecay(.02);

// READ THE GRAPH DATASET
d3.json(whichdataset, function(error, data) {
	if (error) return console.warn(error);
	detail(data);
});

// READ THE METADATA DATASET
d3.json(metadataurl, function(error, data) {
	if (error) return console.warn(error);
	referencePublishers = data.publishers;
	referenceDecitre = data.decitre;
	referenceCyberclass = data.cyberclass;
});

// FUNCTION USED FOR DETAIL OF NODES AND LINKS
function detail(data){
	
	// Only way I found to copy an array without leaving references 
	var copylinks = JSON.parse(JSON.stringify(data.links_sim));
	var copynodes = JSON.parse(JSON.stringify(data.nodes));
	books = data.books;
	publishers = data.publishers;
	decitre = data.decitre;
	cyberclass = data.cyberclass;
	schools = data.schools;
	
	//viznodes = [];
	//vizlinks = [];
	
	// THE NODES
	viznodes = copynodes.filter(function(u){ return true; });

	// 0 - Filter the nodes by publishers
	viznodes = viznodes.filter(function(d){
			if (publivalue.includes(allpublisherskeyword)) { return true; } else { return publivalue.includes(publishers[books[d.docid].publisherid].publishername); };
		});
	
	// 0 bis - Filter the nodes by decitre keywords
	viznodes = viznodes.filter(function(d){
			if (decitrevalue.includes(alldecitrekeywords)) { return true; } else { return decitrevalue.includes(decitre[books[d.docid].decitre].l1); };
		});

	// 0 ter - Filter the nodes by cyberclass keywords
	viznodes = viznodes.filter(function(d){
			if (cyberclassvalue.includes(allCyberclasskeywords)) { return true; } else { return cyberclassvalue.includes(cyberclass[books[d.docid].classid].cyberclass); };
		});

	// 1 - Create viznodesdetails in order to hold the books' urls
	viznodesdetails = [];
	viznodes.map(function(e){
		viznodesdetails.push(e);
	});

	// 2 - aggregate by iid and sum over the value
	viznodes = d3
		.nest()
		.key(function(u) { return schools[u.iid].id + "|" + schools[u.iid].group + "|" + u.iid; })
		.rollup(function(u){ return d3.sum(u, function(e){ return 1; }) })
		.entries(viznodes);

	// 3 - recreate the initial format and rename the columns
	viznodes.map(function(u) {
		u.id = u.key.split("|")[0];
		u.group = u.key.split("|")[1];
		u.iid = u.key.split("|")[2];
		u.nodesize = u.value;
		delete u.key;
		delete u.value;
	});

	// THE LINKS
	vizlinks = copylinks.filter(function(u){ return true; });

	// 1 - Filter the links by publishers
	vizlinks = vizlinks.filter(function(d){
			if (publivalue.includes(allpublisherskeyword)) { return true; } else { return publivalue.includes(publishers[books[d.docid].publisherid].publishername); };
		});

	// 2 - Filter the links by decitre keywords
	vizlinks = vizlinks.filter(function(d){
			if (decitrevalue.includes(alldecitrekeywords)) { return true; } else { return decitrevalue.includes(decitre[books[d.docid].decitre].l1); };
		});

	// 2 - Filter the links by cyberclass keywords
	vizlinks = vizlinks.filter(function(d){
			if (cyberclassvalue.includes(allCyberclasskeywords)) { return true; } else { return cyberclassvalue.includes(cyberclass[books[d.docid].classid].cyberclass); };
		});

	// 3 - Create vizlinksdetails in order to hold the books' urls
	vizlinksdetails = [];
	vizlinks.map(function(e){
		vizlinksdetails.push(e);
	});

	// 4 - Aggregate the links using "|" as a separator
	vizlinks = d3
		.nest()
		.key(function(u) { return schools[u.iidsource].group + "|" + schools[u.iidtarget].group + "|" + schools[u.iidsource].id + "|" + schools[u.iidtarget].id + "|" + u.iidsource + "|" + u.iidtarget; })
		.rollup(function(u){ return d3.sum(u, function(e){ return 1; }) }) //e.value
		.entries(vizlinks);
	
	// 5 - Split the key and recreate the four initial fields.
	vizlinks.map(function(u) {
		u.groupsource = u.key.split("|")[0];
		u.grouptarget = u.key.split("|")[1];
		u.source = u.key.split("|")[2];
		u.target = u.key.split("|")[3];
		u.iidsource = u.key.split("|")[4];
		u.iidtarget = u.key.split("|")[5];
		delete u.key;
	});
	
	// update the graph
	update(viznodes, vizlinks, vizlinksdetails, data);
};

function update(viznodes, vizlinks, vizlinksdetails, data) {
	minlinkvalue = function() {if (publivalue.includes(allpublisherskeyword) && nodevalue.includes(allinstitutionskeyword) && decitrevalue.includes(alldecitrekeywords) && cyberclassvalue.includes(allCyberclasskeywords)) { return minlinkvaluewithall; }
			else { return 0 /*d3.min(vizlinks.map(function(d){ return d.value; }));*/ }};
	maxlinkvalue = d3.max(vizlinks.map(function(d){ return d.value; }));

	linkvalue = d3.max([linkvalue, minlinkvalue()]);

	function filteriidandvalue(arraytofilter){
		return arraytofilter.filter(function(d){
			if (d.source.id === undefined) { var source = d.source } else { var source = d.source.id };
			if (d.target.id === undefined) { var target = d.target } else { var target = d.target.id };
			if (nodevalue.includes(allinstitutionskeyword)) {return d.value >= linkvalue} else
				if (nodevalue.length == 1) {return d.value >= linkvalue && ( nodevalue.includes(source) || nodevalue.includes(target) );} else {
					//Filtre OU - All links containing either source or target are displayed
					return d.value >= linkvalue && ( nodevalue.includes(source) || nodevalue.includes(target) );
					//Filtre ET - Only links containing source and target is displayed (from two selected iid)
					//return d.value >= linkvalue && ( nodevalue.includes(source) && nodevalue.includes(target) );
				}
		});
	};

	function coveronmouseover(a, coverstoshow) {
		var temp = viznodesdetails.filter(function(c){ return imgurl + books[c.docid].cover_url == a});
		var tempid = temp.map(function(c){ return schools[c.iid].id; } );

		d3
			.selectAll('.onenode')
			.attr("fill", 'red' );
			//.style('stroke', 'red')
			//.style('stroke-width', '3px');
		d3
			.selectAll('.onenode')
			.filter(function(b){ return tempid.includes(b.id); })
			.attr("fill", 'green' );
			//.style('stroke', 'green')
			//.style('stroke-width', '3px');

// TEST AJOUT DES VALUES SUR CHAQUE NODE
/*	svg
			.select('.alltextnodes')
			.selectAll('.valuetext')
			.data(temp)
			.enter()
			.append('text')
			.attr('class', "valuetext")
			.attr('text-anchor', "middle")
			.style('font-size', '100%')
			.attr('color', 'white')
			.style("pointer-events", "none")
			.attr('dx', function(b){ return d3.selectAll('.onenode').filter(function(e){ return b.id == e.id; }).data()[0].x })
			.attr('dy', function(b){ return d3.selectAll('.onenode').filter(function(e){ return b.id == e.id; }).data()[0].y })
			.text(function(b){ return b.value });
			;
*/
		/*d3
			.select('#textname2')
			.text(coverstoshow.filter(function(u){ return u.cover == a; })[0].weight);*/
	};

	function coveronmouseout (b) {d3
		.selectAll('.onenode')
		.attr("fill", function(e) { return color(e.group); });
		//.style('stroke', 'white')
		//.style('stroke-width', '1.5px');
	};

	// FILTER institutions and links size;
	var vizlinksfiltered = filteriidandvalue(vizlinks);
	
	// FILTER the vizlinksdetails BASED ON THE REMAINING vizlinksfiltered
	var sourceandtarget = [];
	vizlinksfiltered.map(function(d){ 
		if (d.source.id === undefined && d.target.id === undefined) { sourceandtarget.push(d.source.concat(d.target)) } else { sourceandtarget.push(d.source.id.concat(d.target.id)) };
	});

	var vizlinksdetailsfiltered = vizlinksdetails.filter(function(e){
		return sourceandtarget.includes(schools[e.iidsource]['id'].concat(schools[e.iidtarget]['id']));
	});
	
	// FIND THE UNIQUE NODES REPRESENTED INTO THE VIZLINKS FILTERED	
	var uniquenodes = vizlinksfiltered
		.map(function(d){ if (d.source.id === undefined) { return d.source } else { return d.source.id }; })
		.concat(vizlinksfiltered
			.map(function(d){ if (d.target.id === undefined) { return d.target } else { return d.target.id }; }))
		.filter(function(x, i, a){ return a.indexOf(x) == i; }); // Keep only the uniques taken from http://stackoverflow.com/questions/11246758/how-to-get-unique-values-in-an-array
		 
	// TWEAK THE FORCES
	//forcestrength = function () { if(vizlinksfiltered.length == 0 || nodevalue.length == 0) { return 1; } else if (nodevalue.includes('All institutions')) { return d3.max([1 / Math.pow(vizlinksfiltered.length, 0.5), 0.04]); } else { return d3.max([1 / nodevalue.length, d3.max([1 / Math.pow(vizlinksfiltered.length, 0.5), 0.04])]); }};

	var viznodesfiltered = viznodes.filter(function(d){ return uniquenodes.includes(d.id) });
	
	var uniquepublishers = vizlinksdetailsfiltered
		.map(function(d){ return publishers[books[d.docid].publisherid].publishername; })
		.filter(function(x, i, a){ return a.indexOf(x) == i; }); // Keep only the uniques taken from http://stackoverflow.com/questions/11246758/how-to-get-unique-values-in-an-array

	var uniquekeywords = vizlinksdetailsfiltered
		.map(function(d){ return decitre[books[d.docid].decitre].l1; })
		.filter(function(x, i, a){ return a.indexOf(x) == i; }); // Keep only the uniques taken from http://stackoverflow.com/questions/11246758/how-to-get-unique-values-in-an-array

	var uniquecyberclass = vizlinksdetailsfiltered
		.map(function(d){ return cyberclass[books[d.docid].classid].cyberclass; })
		.filter(function(x, i, a){ return a.indexOf(x) == i; }); // Keep only the uniques taken from http://stackoverflow.com/questions/11246758/how-to-get-unique-values-in-an-array

	// DEFINE THE SCALES BASED ON THE FILTERED INFO (vizlinksfiltered and viznodesfiltered) 
	nodescale = d3.scaleLinear()
		.domain(d3.extent(viznodesfiltered.map(function(d){ return d.nodesize; })))
		.range(nodesradiusrange);

	linkscale = d3.scaleLinear()
		.domain(d3.extent(vizlinksfiltered.map(function(d){ return d.value; })))
		.range(nodeslinksrange);

	// UPDATE THE LISTS
	// INSTITUTIONS
	var option = d3
		.select('.institutionsDiv')
		.selectAll('.checkbox')
		.data([allinstitutionskeyword].concat(uniquenodes.sort()), function(d){ return d; });

	option.exit().remove();
	
	var optionenter = option
		.enter()
		.append('p')
		.attr('class', 'checkbox');

	optionenter
		.append('input')
		.attr('class', 'institutionslist')
		.attr('value', function(d){ return d; })
		.attr('checked', function(d){ if(nodevalue.includes(d)) { return true}; })
		.attr('id', function(d){ return d; })
		.attr('type', 'checkbox')
		.on("click", function() {
			var index = nodevalue.indexOf(this.value);
			if( index == -1) {
				nodevalue.push(this.value);
				dataLayer.push({'event': 'gtagiidadded'}); // for tracking
			} else {nodevalue.splice(index, 1);};

			if(this.value == allinstitutionskeyword || !(nodevalue.includes(allinstitutionskeyword))) { detail(data) /*update(viznodes, vizlinks, vizlinksdetails, data)*/; };

			d3
				.select('#allInstitutions')
				.text(nodevalue.join(', '));
		});
		
	optionenter	
		.append('label')
		.attr('for', function(d){ return d; })
		.text(function(d){ return d; });

	// PUBLISHERS
	var publi = d3
		.select('.publishersDiv')
		.selectAll('.checkbox')
		.data([allpublisherskeyword].concat(uniquepublishers.sort()), function(d){ return d; });
	
	publi.exit().remove();
	
	var publienter = publi
		.enter()
		.append('p')
		.attr('class', 'checkbox');
	
	publienter
		.append('input')
		.attr('class', 'publisherslist')
		.attr('value', function(d){ return d; })
		.attr('checked', function(d){ if(publivalue.includes(d)) { return true}; })
		.attr('id', function(d){ return d; })
		.attr('type', 'checkbox')
		.on("click", function() {
			var index = publivalue.indexOf(this.value);
			if( index == -1) {
				publivalue.push(this.value);
				dataLayer.push({'event': 'gtagpublisheradded'}); // for tracking
			} else {publivalue.splice(index, 1);};
			
			if(this.value == allpublisherskeyword || !(publivalue.includes(allpublisherskeyword))) { detail(data); };

			d3
				.select('#allPublishers')
				.text(publivalue.join(', '));
		});

	publienter
		.append('label')
		.attr('for', function(d){ return d; })
		.text(function(d){ return d; });

	// DECITRE KEYWORDS
	var key = d3
		.select('.decitreDiv')
		.selectAll('.checkbox')
		.data([alldecitrekeywords].concat(uniquekeywords.sort()), function(d){ return d; });
	
	key.exit().remove();
	
	var keyenter = key
		.enter()
		.append('p')
		.attr('class', 'checkbox');
	
	keyenter
		.append('input')
		.attr('class', 'decitrelist')
		.attr('value', function(d){ return d; })
		.attr('checked', function(d){ if(decitrevalue.includes(d)) { return true}; })
		.attr('id', function(d){ return d; })
		.attr('type', 'checkbox')
		.on("click", function() {
			var index = decitrevalue.indexOf(this.value);
			if( index == -1) {
				decitrevalue.push(this.value);
				dataLayer.push({'event': 'gtagdecitreadded'}); // for tracking
			} else {decitrevalue.splice(index, 1);};
			
			if(this.value == alldecitrekeywords || !(decitrevalue.includes(alldecitrekeywords))) { detail(data); };

			d3
				.select('#allThemes')
				.text(decitrevalue.join(', '));
		});

	keyenter
		.append('label')
		.attr('for', function(d){ return d; })
		.text(function(d){ return d; });

	// CYBERCLASS KEYWORDS
	var cyber = d3
		.select('.cyberclassDiv')
		.selectAll('.checkbox')
		.data([allCyberclasskeywords].concat(uniquecyberclass.sort()), function(d){ return d; });
	
	cyber.exit().remove();
	
	var cyberenter = cyber
		.enter()
		.append('p')
		.attr('class', 'checkbox');
	
	cyberenter
		.append('input')
		.attr('class', 'cyberclasslist')
		.attr('value', function(d){ return d; })
		.attr('checked', function(d){ if(cyberclassvalue.includes(d)) { return true}; })
		.attr('id', function(d){ return d; })
		.attr('type', 'checkbox')
		.on("click", function() {
			var index = cyberclassvalue.indexOf(this.value);
			if( index == -1) {
				cyberclassvalue.push(this.value);
				dataLayer.push({'event': 'gtagcyberclassadded'}); // for tracking
			} else {cyberclassvalue.splice(index, 1);};
			
			if(this.value == allCyberclasskeywords || !(cyberclassvalue.includes(allCyberclasskeywords))) { detail(data); };

			d3
				.select('#allCyberclass')
				.text(cyberclassvalue.join(', '));
		});

	cyberenter
		.append('label')
		.attr('for', function(d){ return d; })
		.text(function(d){ return d; });


	// LINKS
	var link = svg
		.select(".alllinks")
		.selectAll(".onelink")
		.data(vizlinksfiltered, function(d){ return d.groupsource.concat(d.grouptarget); });

	link.exit().remove();

	linkupd = link
		.enter()
			.append("line")
			.attr('class', "onelink")
		.merge(link)
			.style('stroke', '#999')
			.style('stroke-opacity', linkopacity_off)
			.attr("stroke-width", function(e) { return linkscale(e.value); })
			.on("mouseover", function(d){
				d3
					.select(this)
					.transition()
					.style('stroke', '#999')
					.style('stroke-opacity', linkopacity_on);
				/*d3
					.select('.booksNumbers')
					.text(start_nb)
					.transition()
					.duration(500)
					//Taken from Bostock's "Text Transition I" - Used for animating the nb of shared books.
					.tween("text", function() {
						var that = d3.select(this);
						var i = d3.interpolateNumber(start_nb, d.value);
						return function(t) {
							that.text(Math.round(i(t)));
						};
					});*/
				d3
					.selectAll(".nodetext")
					.filter(function(e){ return e.id == d.source.id || e.id == d.target.id; })
					.transition()
					.style('font-size', fontsizeOnmouseover)
					.style("opacity", labelopacity_on);	
			})
			.on("mouseout", function(d){
				d3
					.select(this)
					.transition()
					.style('stroke', '#999')
					.style('stroke-opacity', linkopacity_off);
				/*d3
					.select('.booksNumbers')
					.text('-');*/
				d3
					.selectAll(".nodetext")
					.filter(function(e){ return e.id == d.source.id || e.id == d.target.id; })
					.transition()
					.style('font-size', '50%')
					.style("opacity", labelopacity_off);					
			})
			.on('click', function(d){
			// Mise à jour de l'URL
			d3
				.select('.itemsContainerFR')
				.select('.moreCovers')
				.select('a')
				.attr('target', '_self')
				.attr('href', urlVersCyberlibris(d.iidsource, d.iidtarget, 'fr'));

			d3
				.select('.itemsContainerEN')
				.select('.moreCovers')
				.select('a')
				.attr('target', '_self')
				.attr('href', urlVersCyberlibris(d.iidsource, d.iidtarget, 'en'));

				d3
					.select('.bottomViewer')
					.attr('class', 'bottomViewer');

				d3
					.select('#institutionsname')
					.text(d.source.id + ' - ' + d.target.id);

				dataLayer.push({'event': 'gtaglinkclicked'}); // for tracking

				d3
					.select('#numberofbooks strong')
					.text(d.value);

				var coverstoshow = [];
				var coverstoshowFR = [];
				var coverstoshowEN = [];

				vizlinksdetailsfiltered.map(function(u){ if (schools[u.iidsource]['id'].concat(schools[u.iidtarget]['id']) == d.source.id.concat(d.target.id)) { coverstoshow.push({cover: imgurl + books[u.docid].cover_url, weight: books[u.docid].weight, lang: books[u.docid].lang}); }})
				coverstoshowFR = coverstoshow
					.filter(function(d){ return d.lang == 'fr'; })
					.sort(function(a, b){ 
						return b.weight - a.weight; //décroissant
					})
						.slice(0, nbcoverstoshow);

				coverstoshowEN = coverstoshow
					.filter(function(d){ return d.lang == 'en'; })
					.sort(function(a, b){ 
						return b.weight - a.weight; //décroissant
					})
						.slice(0, nbcoverstoshow);

				var coversFR = d3
					.select('.itemsContainerFR #itemimg')
					.selectAll('.item')
					.data(coverstoshowFR.map(function(e){ return e.cover; }), function(u){ return u; });
				coversFR
					.exit()
					//.transition()
					//.duration(1000)
					//.attr('opacity', 1e-6)
					//.attr('x', width)
					.remove();
				coversFR
					.enter()
					.append('div')
					.attr('class', 'item')
					.append('a')
					.attr('href', '#')
					.append('img')
					//.attr('x', 0)
					//.attr('y', cover_y_fr)
					//.attr('width', coverwidth)
					//.attr('height', coverheight)
					.attr("src", function(u) { return u })
					.on('mouseover', function(a){ coveronmouseover(a, coverstoshowFR); })
					.on('mouseout', function(b){ coveronmouseout(b); })
					.style('opacity', 1e-6)
					.transition()
					.duration(1000)
					.style('opacity', 1)
					//.attr('x', function(u, i) { return i * spacebtw2covers});
				// Obligé de répéter le 'on mouseover' et 'on mouseout' car .merge(covers) pas utilisable à cause des deux transitions.
				/*coversFR
					.on('mouseover', function(a){ coveronmouseover(a, coverstoshowFR); })
					.on('mouseout', function(b){ coveronmouseout(b); })
					.transition()
					.duration(1000)
					.attr('opacity', 1)
					.attr('x', function(u, i) { return i * spacebtw2covers});*/

				// BELOW IS A COPY OF ABOVE! BUT WITH ENGLISH BOOKS!
				var coversEN = d3
					.select('.itemsContainerEN #itemimg')
					.selectAll('.item')
					.data(coverstoshowEN.map(function(e){ return e.cover; }), function(u){ return u; });
				coversEN
					.exit()
					/*.transition()
					.duration(1000)
					.attr('opacity', 1e-6)
					.attr('x', width)*/
					.remove();
				coversEN
					.enter()
					.append('div')
					.attr('class', 'item')
					.append('a')
					.attr('href', '#')
					.append('img')
					//.attr('x', 0)
					//.attr('y', cover_y_en)
					//.attr('opacity', 1e-6)
					//.attr('width', coverwidth)
					//.attr('height', coverheight)
					.attr("src", function(u) { return u })
					.on('mouseover', function(a){ coveronmouseover(a, coverstoshowEN); })
					.on('mouseout', function(b){ coveronmouseout(b); })
					.style('opacity', 1e-6)
					.transition()
					.duration(1000)
					.style('opacity', 1)
					//.attr('x', function(u, i) { return i * spacebtw2covers});
				// Obligé de répéter le 'on mouseover' et 'on mouseout' car .merge(covers) pas utilisable à cause des deux transitions.
				/*coversEN
					.on('mouseover', function(a){ coveronmouseover(a, coverstoshowEN); })
					.on('mouseout', function(b){ coveronmouseout(b); })
					.transition()
					.duration(1000)
					.attr('opacity', 1)
					.attr('x', function(u, i) { return i * spacebtw2covers});*/
			});
	
	// NODES
	groupnode = svg
		.select(".allnodes")
		.selectAll(".onenode")
		.data(viznodesfiltered, function(d){ return d.id; });

	groupnode.exit().remove();

	groupnodeupd = groupnode
		.enter()
		.append("circle")
		.attr("class", "onenode")
		.call(d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended))
		.attr("fill", function(d) { return color(d.group); })
		.merge(groupnode)
		.attr("r", function(a) { return nodescale(a.nodesize); })
		.on("mouseover", function(d){

			d3
				.selectAll(".nodetext")
				.filter(function(e){ return e.id == d.id; })
				.transition()
				.style('font-size', fontsizeOnmouseover)
				.style("opacity", labelopacity_on)
				.text(function(e){ return e.id + ' (' + e.nodesize + ')'; });
			d3
				.select(this)
				.transition()
				.attr("r", nodesradiusrange[1]);
			d3
				.selectAll(".onelink")
				.filter(function(e){ return d.id == e.source.id || d.id == e.target.id; })
				.transition()
				.style('stroke', function(e){ return color(d.group); })
				.style('stroke-opacity', function(e){ return linkopacity_on; });

			/*d3
				.select('.booksNumbers')
				.text(start_nb)
				.transition()
				.duration(500)
				//Taken from Bostock's "Text Transition I" - Used for animating the nb of shared books.
				.tween("text", function() {
					var that = d3.select(this);
					var i = d3.interpolateNumber(start_nb, d.nodesize);
					return function(t) {
						that.text(Math.round(i(t)));
					};
				});*/
			
			/*d3
				.select("#tooltip")
				.style("opacity", 1)	
				.style("left", d.x + "px")
				.style("top", d.y + "px");
				//.style("background", 'white');*/
		})
		.on("mouseout", function(d){
			d3
				.selectAll(".nodetext")
				.filter(function(e){ return e.id == d.id; })
				.transition()
				.style('font-size', '50%')
				.style("opacity", labelopacity_off)
				.text(function(e){ return e.id; });
			d3
				.select(this)
				.transition()
				.attr("r", function(a) { return nodescale(a.nodesize); });
			d3
				.selectAll(".onelink")
				.filter(function(e){ return d.id == e.source.id || d.id == e.target.id; })
				.transition()
				.style('stroke', '#999')
				.style('stroke-opacity', linkopacity_off);
			/*d3
				.select('.booksNumbers')
				.text('-');*/
		})
		.on("click", function(d){

			// Mise à jour de l'URL
			d3
				.select('.itemsContainerFR')
				.select('.moreCovers')
				.select('a')
				.attr('target', '_self')
				.attr('href', urlVersCyberlibris(d.iid, d.iid, 'fr'));

			d3
				.select('.itemsContainerEN')
				.select('.moreCovers')
				.select('a')
				.attr('target', '_self')
				.attr('href', urlVersCyberlibris(d.iid, d.iid, 'en'));

			d3
				.select('.bottomViewer')
				.attr('class', 'bottomViewer');
			d3
				.select('#institutionsname')
				.text(d.id);

			dataLayer.push({'event': 'gtagnodeclicked'}); // for tracking

			d3
				.select('#numberofbooks strong')
				.text(d.nodesize);

			var coverstoshow = [];
			var coverstoshowFR = [];
			var coverstoshowEN = [];

			viznodesdetails.map(function(u){ if (schools[u.iid].id == d.id) { coverstoshow.push({cover: imgurl + books[u.docid].cover_url, weight: books[u.docid].weight, lang: books[u.docid].lang}); }})

			coverstoshowFR = coverstoshow
				.filter(function(d){ return d.lang == 'fr'; })
				.sort(function(a, b){ 
					return b.weight - a.weight; //décroissant
					//return a.weight - b.weight; //croissant
				})
				.slice(0, nbcoverstoshow);

			coverstoshowEN = coverstoshow
				.filter(function(d){ return d.lang == 'en'; })
				.sort(function(a, b){ 
					return b.weight - a.weight; //décroissant
				})
				.slice(0, nbcoverstoshow);

			var coversFR = d3
				.select('.itemsContainerFR #itemimg')
				.selectAll('.item')
				.data(coverstoshowFR.map(function(e){ return e.cover; }), function(u){ return u; });
			coversFR
				.exit()
				/*.transition()
				.duration(1000)
				.attr('opacity', 1e-6)
				.attr('x', width)*/
				.remove();
			coversFR
				.enter()
				.append('div')
				.attr('class', 'item')
				.append('a')
				.attr('href', '#')
				.append('img')
				/*.attr('x', 0)
				.attr('y', cover_y_fr)
				.attr('opacity', 1e-6)
				.attr('width', coverwidth)
				.attr('height', coverheight)*/
				.attr("src", function(u) { return u })
				.on('mouseover', function(a){ coveronmouseover(a, coverstoshowFR); })
				.on('mouseout', function(b){ coveronmouseout(b); })
				.style('opacity', 1e-6)
				.transition()
				.duration(1000)
				.style('opacity', 1)				
				/*.attr('x', function(u, i) { return i * spacebtw2covers});
			coversFR
				.on('mouseover', function(a){ coveronmouseover(a, coverstoshowFR); })
				.on('mouseout', function(b){ coveronmouseout(b); })					
				.transition()
				.duration(1000)
				.attr('opacity', 1)
				.attr('x', function(u, i) { return i * spacebtw2covers});*/

			var coversEN = d3
				.select('.itemsContainerEN #itemimg')
				.selectAll('.item')
				.data(coverstoshowEN.map(function(e){ return e.cover; }), function(u){ return u; });
			coversEN
				.exit()
				/*.transition()
				.duration(1000)
				.attr('opacity', 1e-6)
				.attr('x', width)*/
				.remove();
			coversEN
				.enter()
				.append('div')
				.attr('class', 'item')
				.append('a')
				.attr('href', '#')
				.append('img')
				/*.attr('x', 0)
				.attr('y', cover_y_en)
				.attr('opacity', 1e-6)
				.attr('width', coverwidth)
				.attr('height', coverheight)*/
				.attr("src", function(u) { return u })
				.on('mouseover', function(a){ coveronmouseover(a, coverstoshowEN); })
				.on('mouseout', function(b){ coveronmouseout(b); })
				.style('opacity', 1e-6)
				.transition()
				.duration(1000)
				.style('opacity', 1)			
				/*.attr('x', function(u, i) { return i * spacebtw2covers});
			coversEN
				.on('mouseover', function(a){ coveronmouseover(a, coverstoshowEN); })
				.on('mouseout', function(b){ coveronmouseout(b); })					
				.transition()
				.duration(1000)
				.attr('opacity', 1)
				.attr('x', function(u, i) { return i * spacebtw2covers});*/
		})

	// TEXT NODES
	textnode = svg
		.select(".alltextnodes")
		.selectAll(".nodetext")
		.data(viznodesfiltered, function(d){ return d.id; });

	textnode.exit().remove();

	textnodeupd = textnode
		.enter()
		.append("text")
		.attr('class', "nodetext")
		.merge(textnode)
		.attr('text-anchor', "middle")
		.style('font-size', fontsize)
		.style("opacity", labelopacity_off)
		.style("pointer-events", "none")
		.text(function(d) { return d.id });

	// PARAM FILTER LINK VALUE
	d3
		.select("#paramlinklabel")
		.text(linkvalue)
		/*.property('value', linkvalue)
		.on("change", function() {
			linkvalue = d3.max([+this.value, minlinkvalue()]);
			d3
				.select("#paramlinkvalue")
				.property("value", linkvalue);
			update(viznodes, vizlinks, vizlinksdetails, data);
		})*/;
	d3
		.select("#paramlinkvalue")
		.attr('min', minlinkvalue)
		.attr('max', maxlinkvalue)
		.attr('value', linkvalue)
		.on("input", function() {
			linkvalue = d3.max([+this.value, minlinkvalue()]);
			// Update the label
			d3
				.select("#paramlinklabel")
				.text(linkvalue)
				//.property('value', linkvalue);
			update(viznodes, vizlinks, vizlinksdetails, data);
		});

	// RUN THE FORCES
	simulation
		.nodes(viznodesfiltered) //Replace with 'viznodesfiltered' if update of forces is needed while filter is changing - 'viznodes' otherwise
		.on("tick", ticked);

	simulation
		.force("link")
		.links(vizlinksfiltered); //Replace with 'vizlinksfiltered' if update of forces is needed while filter is changing - 'vizlinks' otherwise

	simulation.nodes(viznodesfiltered).alpha(0.5).restart();

	$(window).on('resize', function(){ simulation.nodes(viznodesfiltered).alpha(0.5).restart(); });
};

function urlVersCyberlibris (first, last, lang){
	publisherid = [];
	classid = [];
	decitreid = [];

	referencePublishers.map(function(d){ return publivalue.includes(d.publishername) ? publisherid.push(d.publisherid) : null; });
	referenceDecitre.map(function(d){ return decitrevalue.includes(d.l1) ? decitreid.push(d.decitre) : null; });
	referenceCyberclass.map(function(d){ return cyberclassvalue.includes(d.cyberclass) ? classid.push(d.classid) : null; });

	return baseurl + 'first=' + first + '&last=' + last + '&lang=' + lang + '&publisherid=' + publisherid + '&classid=' + classid + '&decitre=' + decitreid;
};

function ticked() {
	var radius = nodesradiusrange[1];
	var localwidth = parseInt(d3.select('.svggraph').style('width'), 10);
	var localheight = parseInt(d3.select('.svggraph').style('height'), 10);

	function xlim (a) { return Math.max(radius, Math.min(localwidth - radius, a)); };
	function ylim(b) { return Math.max(radius, Math.min(localheight - radius, b)); };
	
	//console.log(simulation.alpha());
	groupnodeupd
		.attr("cx", function(d) { return xlim(d.x); })
		.attr("cy", function(d) { return ylim(d.y); });

	textnodeupd
			.attr("dx", function(d){ return xlim(d.x); })
			.attr("dy", function(d){ return ylim(d.y + nodescale(d.nodesize)); });

	linkupd
		.attr("x1", function(d) { return xlim(d.source.x); })
		.attr("y1", function(d) { return ylim(d.source.y); })
		.attr("x2", function(d) { return xlim(d.target.x); })
		.attr("y2", function(d) { return ylim(d.target.y); });
};

function zoomed(){
	idle = 0;
	svg.attr("transform", d3.event.transform);
};

function dragstarted(d) {
	
	if (!d3.event.active) 
		simulation.alphaTarget(0.3).restart();
	d.fx = d.x;
	d.fy = d.y;
};

function dragged(d) {
	d.fx = d3.event.x;
	d.fy = d3.event.y;
};

function dragended(d) {
	if (!d3.event.active) 
	simulation.alphaTarget(0);
	d.fx = null;
	d.fy = null;
};