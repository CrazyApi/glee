/**
 * gleeTouch: Inversed version of gleeBox for touch interfaces
 * 
 * Licensed under the GPL license (http://www.gnu.org/licenses/gpl.html)
 * Copyright (c) 2009 Ankit Ahuja
 * Copyright (c) 2009 Sameer Ahuja
 *
 **/
 
 /**
  * Note: Use http://ted.mielczarek.org/code/mozilla/bookmarklet.html to test the bookmarklet
  *       Use http://www.brainjar.com/js/crunch/demo.html to generate the bookmarklet (prepend it with javascript:)
  **/

var GleeTouch = {
    theme: "GleeThemeWhite",
    init: function(){
        this.addJQuery();
        this.addGleeCSS();
        this.open();
    },
    addGleeCSS: function(){
        var themeCSS = '.GleeThemeWhite{ background-color:#fff !important; box-shadow: 2px 2px 2px #333; border:1px solid #ccc;} .GleeThemeWhite a{border:1px solid #ccc; color: #1b1b1b !important;}';
        var fontCSS = '#gleeTouch{ font-family:Tahoma, Arial, sans-serif !important; font-size:16px !important;}';
        var optionCSS = 'a.gleeTouchOption {padding:5px; display:block; margin: 2px 0px; border-radius:2px; cursor:pointer}';
        var boxCSS = '#gleeTouch{lineheight:20px; left:35%; top:15%; margin:0; padding:5px; opacity:0.9; width:30%; position:fixed; height:40%; border-radius:2px; display:none;}';
        var cssNode = document.createElement('style');
        cssNode.setAttribute('type','text/css');
        var textNode = document.createTextNode(themeCSS + fontCSS + optionCSS + boxCSS);
        cssNode.appendChild(textNode);
        document.getElementsByTagName('head')[0].appendChild(cssNode);
    },
    addJQuery: function(){
        var scriptNode = document.createElement('script');
        scriptNode.type = 'text/javascript';
        scriptNode.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.4.1/jquery.min.js';
        document.getElementsByTagName("head")[0].appendChild(scriptNode);
    },
    open: function(){
        this.create();
        this.box.style.display = 'block';
        this.addEventHandlers();
    },
    close: function(){
        // this.box.fadeOut(100);
        this.box.style.display = 'none';
    },
    create: function(){
        this.box = document.createElement('div');
        this.box.id = 'gleeTouch';
        this.box.className = GleeTouch.theme;
        document.body.appendChild(this.box);
        this.createOption('Share');
        this.createOption('YubNub');
        this.createOption('Page Commands');
    },
    createOption: function(name){
        var option = document.createElement('a');
        option.className = 'gleeTouchOption gleeMainOption';
        option.innerHTML = name;
        this.box.appendChild(option);
    },
    addEventHandlers: function(){
        document.addEventListener('click', function(e){
            if(e.target.id != "gleeTouch" && e.target.className != "gleeTouchOption gleeMainOption")
               {
                   GleeTouch.close();
               }
        });
        var els = document.getElementsByClassName('gleeMainOption');
        var len = els.length;
        for(var i=0; i<len; i++)
        {
            els[i].addEventListener('click', function(e){
                                GleeTouch.showSubMenu(e.target.innerHTML.toLowerCase());
                            });
        }
    },
    showSubMenu: function(menu){
        var els = document.getElementsByClassName('gleeMainOption');
        var len = els.length;
        for(var i=0; i<len; i++)
        {
            els[i].style.display = 'none';
        }
        if(menu == "share")
        {
            GleeTouch.Share.open();
        }
        else if(menu == "page commands")
        {
            GleeTouch.Page.open();
        }
    },
    showMainMenu: function(){
        
    }
};

/**
 * Sharing page on different services
 */
 GleeTouch.Share = {
     services:["twitter", "facebook"],
     open: function(){
         var len = this.services.length;
         for(var i=0; i<len; i++){
             var link = document.createElement('a');
             link.className = 'gleeTouchOption gleeSubMenu';
             link.innerHTML = GleeTouch.Share.services[i];
             link.addEventListener('click', function(e){
                 GleeTouch.Share.execute(e.target.innerHTML.toLowerCase());
             });
             GleeTouch.box.appendChild(link);
         }
     },
     
     execute: function(site){
     	var loc = null;
     	//Try to get description
        // var desc = jQuery('meta[name=description],meta[name=Description],meta[name=DESCRIPTION]').attr("content");
        // if((!desc) || (desc == ""))
        //  {
        //      mailDesc = "";
        //      desc = "";
        //  }
        // else
        //  mailDesc = "  -  " + desc;
        var desc = "";
        var mailDesc = "";
        
     	// Encode
     	enUrl = encodeURIComponent(location.href);
     	enTitle = encodeURIComponent(document.title);
     	enDesc = encodeURIComponent(desc);
     	enMailDesc = encodeURIComponent(mailDesc);

     	// Short names of favorite services
     	if(site == "su")
     		site = "stumbleupon";
     	else if(site == "buzz")
     		site = "googlebuzz";
     	else if(site == "fb")
     		site = "facebook";
     	else if(site == "reader")
     	    site = "googlereader";

     	switch(site)
     	{
     		case "g":
     		case "gmail":
     			loc = "https://mail.google.com/mail/?view=cm&ui=1&tf=0&to=&fs=1&su="
     				+enTitle
     				+"&body="
     				+enUrl
     				+enMailDesc;
     			break;
     		case "m":
     		case "mail":
                 loc = "mailto:?subject="
     				+document.title
     				+"&body="
     				+location.href
     				+mailDesc;
     			break;
     		case "deli":
     		case "delicious":
                 loc = "http://delicious.com/save?title="
     				+enTitle
     				+"&url="
     				+enUrl
     				+"&notes="
     				+enDesc;
     			break;
     		case "":
     			loc = "http://api.addthis.com/oexchange/0.8/offer?url="
     				+enUrl
     				+"&title="
     				+enTitle;
     				break;
     		default:
     			loc = "http://api.addthis.com/oexchange/0.8/forward/"
     				+site 
     				+"/offer?url="
     				+enUrl
     				+"&title="
     				+enTitle;
     	}
     	if(loc)
     	{
     	    location.href = loc;
     	}
     }
 };
 
/**
 * Page Commands
 **/
GleeTouch.Page = {
    services: ["read", "rss"],
    open: function(){
        var len = this.services.length;
        for(var i=0; i<len; i++){
            var link = document.createElement('a');
            link.className = 'gleeTouchOption gleeSubMenu';
            link.innerHTML = GleeTouch.Page.services[i];
            link.addEventListener('click', function(e){
                GleeTouch.Page[e.target.innerHTML.toLowerCase()]();
            });
            GleeTouch.box.appendChild(link);
        }
    },
    read: function(){
        location.href = "javascript:(function(){readStyle='style-athelas';readSize='size-medium';readMargin='margin-medium';_readability_script=document.createElement('SCRIPT');_readability_script.type='text/javascript';_readability_script.src='http://lab.arc90.com/experiments/readability/js/readability.js?x='+(Math.random());document.getElementsByTagName('head')[0].appendChild(_readability_script);_readability_css=document.createElement('LINK');_readability_css.rel='stylesheet';_readability_css.href='http://lab.arc90.com/experiments/readability/css/readability.css';_readability_css.type='text/css';_readability_css.media='all';document.getElementsByTagName('head')[0].appendChild(_readability_css);_readability_print_css=document.createElement('LINK');_readability_print_css.rel='stylesheet';_readability_print_css.href='http://lab.arc90.com/experiments/readability/css/readability-print.css';_readability_print_css.media='print';_readability_print_css.type='text/css';document.getElementsByTagName('head')[0].appendChild(_readability_print_css);})();";
    },
    rss: function(){
        var b=document.body;var GR________bookmarklet_domain='http://www.google.com';if(b&&!document.xmlVersion){void(z=document.createElement('script'));void(z.src='http://www.google.com/reader/ui/subscribe-bookmarklet.js');void(b.appendChild(z));}else{location='http://www.google.com/reader/view/feed/'+encodeURIComponent(location.href)};
    }
};

GleeTouch.init();