define(function(){var e,b=/\W/g,c=document,d=document.getElementsByTagName("head")[0]||document.documentElement;seajs.importStyle=function(a,f){if(!f||(f=f.replace(b,"-"),!c.getElementById(f))){var g;if(!e||f?(g=c.createElement("style"),f&&(g.id=f),d.appendChild(g)):g=e,void 0!==g.styleSheet){if(c.getElementsByTagName("style").length>31)throw new Error("Exceed the maximal count of style tags in IE");g.styleSheet.cssText+=a}else g.appendChild(c.createTextNode(a));f||(e=g)}}});