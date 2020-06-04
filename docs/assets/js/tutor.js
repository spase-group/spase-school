/*------------------------------------------------------------------------
 * set_cookie(name, value, days)
 * 
 * Set a cookie with the name and value passed as the first two arguments, 
 * set to expire in the number of days specified in the third argument.
 *------------------------------------------------------------------------*/

function set_cookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toGMTString();
    }
    else 
        expires = "";

    document.cookie = name + "=" + value + expires + "; path=/";
}


/*------------------------------------------------------------------------
 * get_cookie(name)
 * 
 * Returns the value of the cookie identified by the name argument.
 *------------------------------------------------------------------------*/

function get_cookie(name) {
    var namestr  = name + "=";
    var cookbits = document.cookie.split(';');
    var n;

    for(n = 0; n < cookbits.length; n++) {
        var c = cookbits[n];

        /* remove leading whitespace */
        while (c.charAt(0) == ' ') 
            c = c.substring(1, c.length);

        /* if the name start this cookie fragment, return the value */
        if (c.indexOf(namestr) == 0) 
            return c.substring(namestr.length, c.length);
    }
    return null;
}

/*------------------------------------------------------------------------
 * functions to handle multiple handler for onload and onunload events.
 *------------------------------------------------------------------------*/

var onload_functions   = new Array();
var onunload_functions = new Array();

function page_onload(func) {
    onload_functions.push(func);
}

function page_onunload(func) {
    onunload_functions.push(func);
}

function page_load() {
    for(var i = 0; i < onload_functions.length; i++) {
        try { eval(onload_functions[i]); }
        catch(err) { alert(err) }
    }
}

function page_unload() {
    for(var i = 0; i < onunload_functions.length; i++)
        eval(onunload_functions[i]);
}

window.onload   = page_load;
window.onunload = page_unload;
page_onload('load_style()');
// page_onunload('save_style()');

/*------------------------------------------------------------------------
 * load_style()
 * 
 * Initialises the stylesheet based on any cookie currently set.
 *------------------------------------------------------------------------*/

function load_style() {
    var style;
    if (style = get_cookie("stylesheet"))
        set_style(style);
    if (style = get_cookie("body"))
        document.getElementById("body").className = style;
}


/*------------------------------------------------------------------------
 * save_style()
 * 
 * Saves the stylesheet name back to a cookie
 *------------------------------------------------------------------------*/

function save_style() { 
    var style;
    if (style = get_style())
        set_cookie("stylesheet", style, 365);
}


/*------------------------------------------------------------------------
 * get_style()
 * 
 * Returns the title of the current active stylesheet.
 *------------------------------------------------------------------------*/

function get_style() {
    var elems = document.getElementsByTagName("link");
    var n, elem, title;

    for (n = 0; (elem = elems[n]); n++) {
        if (elem.getAttribute("rel").indexOf("style") != -1 
        && (title = elem.getAttribute("title"))
        && ! elem.disabled)
            return title;
    }
    return null;
}


/*------------------------------------------------------------------------
 * set_style(title)
 * 
 * Set the active stylesheet by enabling the <link rel="style" ...> 
 * element that has a title attribute matching the title argument,
 * and disabling all others.
 *------------------------------------------------------------------------*/

function set_style(title) {
    var elems = document.getElementsByTagName("link");
    var n, elem, tattr;
//    alert("SET " + title);

    set_cookie("stylesheet", title, 365);

    for (n = 0; n < elems.length; n++) {
        elem = elems[n];

        if (elem.getAttribute("rel").indexOf("style") != -1 
        && (tattr = elem.getAttribute("title"))) {
            elem.disabled = true;
            if (tattr == title) {
                elem.disabled = false;
            }
        }
    }
    return false;
}

function getPosition(obj){
    var topValue= 0,leftValue= 0;
    while(obj){
	leftValue+= obj.offsetLeft;
	topValue+= obj.offsetTop;
	obj= obj.offsetParent;
    }
    finalvalue = leftValue + "," + topValue;
    return finalvalue;
}

function createTOCItem(tag) {
	x=document.createElement("li");
	a=document.createElement("a");
	
	x.className = tag.type;
	
	a.innerHTML = tag.name;
	a.href = '#' + tag.id;
	
	x.appendChild(a);
	
	return x;
}

// Configure links and headings to show tutor box.
function setTutor() {
	var ref = new Array();
	
	// Anchors (links)
   x = document.getElementsByTagName('a');
   for (i=0;i<x.length;i++) {
   	// "top" links
   	if(x[i].className == 'top') {
   		x[i].onmouseover = new Function('showTutorText("Click this to return to the top of the page.")');
   		x[i].onmouseout = new Function('hideTutor()');
   	}
   }
   
   // Section Headings 
   x = document.getElementsByTagName('h1');
   for (i=0;i<x.length;i++) {
     if(x[i].parentNode.className == 'head') {
         // Set-up behaivor
         x[i].onmouseover = new Function('showTutorText("Click to hide or view the contents of the section.")');
         x[i].onmouseout = new Function('hideTutor()');
         x[i].onclick = new Function('switch_section(this)');
         // Save TOC entry
         if(x[i].id != 'contents') {
           // Add "Top" link
            a=document.createElement("a");
            a.href = '#body';
            a.className = 'top';
            a.title = 'Back up to the top of the page';
            a.innerHTML = 'Top';
            x[i].appendChild(a);
         }
      }
   }
   
   // Sub-section Headings 
   x = document.getElementsByTagName('h2');
   for (i=0;i<x.length;i++) {
   	if(x[i].parentNode.className == 'head') {
         // Set-up behaivor
         x[i].onmouseover = new Function('showTutorText("Click to hide or view the contents of the section.")');
         x[i].onmouseout = new Function('hideTutor()');
         x[i].onclick = new Function('switch_section(this)');
         // Add "Top" link
         a=document.createElement("a");
         a.href = '#body';
         a.className = 'top';
         a.title = 'Back up to the top of the page';
         a.innerHTML = 'Top';
         x[i].appendChild(a);
      }
   }
   
   // Tutor spans
   x = document.getElementsByTagName('span');
   for (i=0;i<x.length;i++) {
   	// "top" links
   	if(x[i].className == 'tutor') {
   		x[i].parentNode.onmouseover = new Function('showTutor(this)');
   		x[i].parentNode.onmouseout = new Function('hideTutor()');
   	}
   }
   
   // Construct table of contents
   x = document.getElementById('toc');
   if(x != null) {
      for (i=0;i<ref.length;i++) {
      	x.appendChild(createTOCItem(ref[i]));
      }
   }
}


function showTutorText(text) {
   document.getElementById("tutor").innerHTML = text;
   document.getElementById("tutor").style.display = 'block';
}

function showTutor(obj) {
   x = obj.getElementsByTagName('span');
   for (i=0;i<x.length;i++) {
      document.getElementById("tutor").innerHTML = x[i].innerHTML;
   }
   document.getElementById("tutor").style.display = 'block';
}

function hideTutor() {
	document.getElementById("tutor").style.display = 'none';
}


/*------------------------------------------------------------------------
 * fullscreen_on()
 * fullscreen_off()
 * 
 * Turn fullscreen mode on/off by setting the #body class
 *------------------------------------------------------------------------*/

function fullscreen_on() {
    document.getElementById("body").className = "wide";
    set_cookie("body", "wide", 365);
}

function fullscreen_off() {
    document.getElementById("body").className = "";
    set_cookie("body", "", 365);
}

/*------------------------------------------------------------------------
 * switch_element(node, class)
 * 
 * Toggle the node's className between "open $class" and "shut $class"
 *------------------------------------------------------------------------*/

function switch_element(node, classname) { 
    node.className =
    node.className == 'open ' + classname
                    ? 'shut ' + classname
                    : 'open ' + classname;
    return false;
}

function switch_section(section) { 
    return switch_element(section.parentNode.parentNode, 'section');
}

function switch_subsection(subsect) { 
    return switch_element(subsect.parentNode.parentNode, 'subsection');
}

/*------------------------------------------------------------------------
 * switch_tag_class(root, tag, from, to)
 * 
 * Switch all tag elements under the root from one class to another.
 *------------------------------------------------------------------------*/

function switch_tag_class(root, tag, cfrom, cto) {
    var nodes = root.getElementsByTagName(tag);
    var n, node;
 
    for (n = 0; (node = nodes[n]); n++) {
        if (node.className == cfrom) {
            node.className = cto;
        }
    }
}
  
function shut_all(root) {
    if (! root) root = document;
    switch_tag_class(root, 'div', 'section', 'shut section');
    switch_tag_class(root, 'div', 'subsection', 'shut subsection');
    switch_tag_class(root, 'div', 'open section', 'shut section');
    switch_tag_class(root, 'div', 'open subsection', 'shut subsection');
    switch_tag_class(root, 'div', 'wedged section', 'open section');
    switch_tag_class(root, 'div', 'wedged subsection', 'open subsection');
    return false;
}

function open_all(root) {
    if (! root) root = document;
    switch_tag_class(root, 'div', 'section', 'open section');
    switch_tag_class(root, 'div', 'subsection', 'open subsection');
    switch_tag_class(root, 'div', 'shut section', 'open section');
    switch_tag_class(root, 'div', 'shut subsection', 'open subsection');
    switch_tag_class(root, 'div', 'wedged section', 'open section');
    switch_tag_class(root, 'div', 'wedged subsection', 'open subsection');
    return false;
}

page_onload('open_all()');
page_onload('setTutor()');

