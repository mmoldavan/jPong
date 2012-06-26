/*
Author: Matthew Moldavan
www.mattmoldavan.com

jQuery Pong
https://github.com/mmoldavan/jPong

*/
var s_width = 600;
var s_height = 400;
var started = false;
var version = 'v0.2';

(function($){
  var methods {
		init: function(){
      
      return this.each(function(){
        var $this = $(this);
        var data = $this.data('nebPong');
        var pongUI = $('<div class="nebpong"><div class="nebpong-player"></div><div class="nebpong-computer"></div><div class="nebpong-shenanigan1 nebpong-ball"></div><div class="nebpong-score"></div></div><div id="nebpong-fullscreen"></div>');
        
        //prevent multiple inits
        if(!data){
          
          //initialize the game objects
          $(this).data('nebPong', {
            target: $this,
            aiagent: {
              reaction: 200,
              lastr: methods.time,
              speed: 4
            },
            player: {
              e: '.player',
              x:5,
    					y:140,
    					h:120,
    					w:15
            },
            computer: {
              e: '.computer',
              x:580,
    					y:140,
    					h:120,
    					w:15
            },
            balls: {
              {
                e: '.shenanigan1',
                x:296,
      					y:196,
      					h:8,
      					dx:-3,
      					dy:0
              }
            },
            score: {
              e: '.score',
              s: 0
            }
          })
      });
		},

		start: function(){
			if(started){
				started = false;
			}
			else{
				started = true;
				$.splash.update();
			}
		},
		
		stop: function(){
			
		},
		
		death: function(){
			$.splash.score.s=0;
			$.splash.player.h=120;
			$.splash.comp.h=120;
			$.splash.player.e.css({
				'height':'120px'});
			$.splash.comp.e.css({
				'height':'120px'});	
			$.splash.reset();
		},
		
		reset: function(){
			$.splash.ball.x = s_width/2;
			$.splash.ball.y = s_height/2;
			$.splash.ball.dx = -3;
			$.splash.ball.dy = 0;
			started = false;
		},
		
		paddlecalc: function(p){
			/* Dx Math */
			$.splash.ball.dx = -$.splash.ball.dx;
			if($.splash.ball.dx < 15 && $.splash.ball.dx > -15){
				$.splash.ball.dx = $.splash.ball.dx * 1.05;
			}
			if($.splash.player.h>16){
				$.splash.player.h = $.splash.player.h-2;
				$.splash.comp.h = $.splash.comp.h+2;
				$.splash.player.e.css({'height':$.splash.player.h+'px'});
				$.splash.comp.e.css({'height':$.splash.comp.h+'px'});
			}
			/* Dy Math */
			var half = p.h/2;
			var center = p.y+half;
			var offset = -(center - $.splash.ball.y);
			var coeff = Math.abs($.splash.ball.dx*1.2);
			if(offset == 0){ $.splash.ball.dy = 0; }
			else{ $.splash.ball.dy = offset/half*coeff;}
		},
		
		/* Periodic Update */
		update: function(){
			/* Location Updates */
			$.splash.ball.x = $.splash.ball.x + $.splash.ball.dx;
			$.splash.ball.y = $.splash.ball.y + $.splash.ball.dy;
			
			/*Left / Right Hits*/
			if($.splash.ball.x < $.splash.player.x+$.splash.player.w){
				if($.splash.ball.y+$.splash.ball.h > $.splash.player.y && $.splash.ball.y < $.splash.player.y+$.splash.player.h){
					$.splash.paddlecalc($.splash.player);
				}
				else{
					/* Death */
					$.splash.death();
				}
			}
			else if($.splash.ball.x+$.splash.ball.h > $.splash.comp.x){
				if($.splash.ball.y+$.splash.ball.h > $.splash.comp.y && $.splash.ball.y < $.splash.comp.y+$.splash.comp.h){
					$.splash.paddlecalc($.splash.comp);
				}
				else{
					/* Death */
					$.splash.death();
				}
			}
			/* Wall Hits */
			if($.splash.ball.y <= 0 || $.splash.ball.y+$.splash.ball.h > s_height){
				$.splash.ball.dy = - $.splash.ball.dy;
			}
			
			$.splash.ai();
			$.splash.score.s += 1;
			$.splash.draw();
			if(started){
				setTimeout('$.splash.update()',33);
			}
		},
		
		ai: function(){
			
			if($.splash.ball.y > $.splash.comp.y+($.splash.comp.h/2))
				$.splash.comp.y = $.splash.comp.y + $.splash.aiagent.speed;
			if($.splash.ball.y < $.splash.comp.y+($.splash.comp.h/2))
				$.splash.comp.y = $.splash.comp.y - $.splash.aiagent.speed;
			if($.splash.comp.y < 0)
				$.splash.comp.y = 0;
			if($.splash.comp.y > s_height - $.splash.comp.h)
				$.splash.comp.y = s_height - $.splash.comp.h;
		},
		
		/* Draw the game */
		draw: function(){
			$.splash.ball.e.css({'left':Math.round($.splash.ball.x),
				'top':Math.round($.splash.ball.y)});
			$.splash.comp.e.css({
				'top':Math.round($.splash.comp.y)});
			$.splash.player.e.css({
				'top':Math.round($.splash.player.y)});
			$.splash.score.e.empty().append($.splash.score.s+' '+version);
		},
		
		/* Utility functions */
		mousemove: function(mouse){
			$.splash.player.y = mouse.clientY-$('#splash').offset().top-($.splash.player.h/2);
			if($.splash.player.y < 0)
				$.splash.player.y = 0;
			if(($.splash.player.y + $.splash.player.h) > s_height)
				$.splash.player.y = s_height-$.splash.player.h;
		},
		
		time: function(){
			var d = new Date();
			return d.getTime();
		}
  }
  
	$.fn.nebPong = function(options){
    var settings = $.extend({
      'height' : '400px',
      'width' : '600px',
      'maxBalls' : 3,
      'speed' : 80
    }, options);
    
    return methods.init.apply(this, arguments);
	}
})(jQuery);

$.splash = {
		
		/* Initilization */
		init: function(){
			$('#splash').append('<div id="pong"><div id="player"></div><div id="computer"></div><div id="shenanigan"></div><div id="score"></div></div><div id="fullscreen"></div>');
			$.splash.aiagent = {
					reaction:200,
					lastr:$.splash.time(),
					speed:4};
			$.splash.player = {e:$('#player'),
					x:5,
					y:140,
					h:120,
					w:15};
			$.splash.comp = {e:$('#computer'),
					x:580,
					y:140,
					h:120,
					w:15};
			$.splash.ball = {e:$('#shenanigan'),
					x:296,
					y:196,
					h:8,
					dx:-3,
					dy:0};
			$.splash.score = {e:$('#score'),
					s:0};
			$('#pong').css({
				'width': s_width+'px',
				'height': s_height+'px',
				'border': '2px solid #111111',
				'position': 'relative'});
			$.splash.comp.e.css({
				'position': 'absolute',
				'width': '15px',
				'height': '120px',
				'left': '580px',
				'top': '140px',
				'background': '#111111'});
			$.splash.player.e.css({
				'position': 'absolute',
				'width': '15px',
				'height': '120px',
				'left': '5px',
				'top': '140px',
				'background': '#111111'});
			$.splash.ball.e.css({
				'position': 'absolute',
				'width': '8px',
				'height': '8px',
				'left': '296px',
				'top': '196px',
				'background': '#111111'});
			$.splash.score.e.css ({
				'position': 'absolute',
				'bottom':'0px',
				'right':'25px',
				'text-align':'right',
				'color':'#111111',
				'font':'0.5em verdana'});
			$('#splash').delay(500).fadeIn("slow");
			$('#pong').mousemove($.splash.mousemove);
		},

		start: function(){
			if(started){
				started = false;
			}
			else{
				started = true;
				$.splash.update();
			}
		},
		
		stop: function(){
			
		},
		
		death: function(){
			$.splash.score.s=0;
			$.splash.player.h=120;
			$.splash.comp.h=120;
			$.splash.player.e.css({
				'height':'120px'});
			$.splash.comp.e.css({
				'height':'120px'});	
			$.splash.reset();
		},
		
		reset: function(){
			$.splash.ball.x = s_width/2;
			$.splash.ball.y = s_height/2;
			$.splash.ball.dx = -3;
			$.splash.ball.dy = 0;
			started = false;
		},
		
		paddlecalc: function(p){
			/* Dx Math */
			$.splash.ball.dx = -$.splash.ball.dx;
			if($.splash.ball.dx < 15 && $.splash.ball.dx > -15){
				$.splash.ball.dx = $.splash.ball.dx * 1.05;
			}
			if($.splash.player.h>16){
				$.splash.player.h = $.splash.player.h-2;
				$.splash.comp.h = $.splash.comp.h+2;
				$.splash.player.e.css({'height':$.splash.player.h+'px'});
				$.splash.comp.e.css({'height':$.splash.comp.h+'px'});
			}
			/* Dy Math */
			var half = p.h/2;
			var center = p.y+half;
			var offset = -(center - $.splash.ball.y);
			var coeff = Math.abs($.splash.ball.dx*1.2);
			if(offset == 0){ $.splash.ball.dy = 0; }
			else{ $.splash.ball.dy = offset/half*coeff;}
		},
		
		/* Periodic Update */
		update: function(){
			/* Location Updates */
			$.splash.ball.x = $.splash.ball.x + $.splash.ball.dx;
			$.splash.ball.y = $.splash.ball.y + $.splash.ball.dy;
			
			/*Left / Right Hits*/
			if($.splash.ball.x < $.splash.player.x+$.splash.player.w){
				if($.splash.ball.y+$.splash.ball.h > $.splash.player.y && $.splash.ball.y < $.splash.player.y+$.splash.player.h){
					$.splash.paddlecalc($.splash.player);
				}
				else{
					/* Death */
					$.splash.death();
				}
			}
			else if($.splash.ball.x+$.splash.ball.h > $.splash.comp.x){
				if($.splash.ball.y+$.splash.ball.h > $.splash.comp.y && $.splash.ball.y < $.splash.comp.y+$.splash.comp.h){
					$.splash.paddlecalc($.splash.comp);
				}
				else{
					/* Death */
					$.splash.death();
				}
			}
			/* Wall Hits */
			if($.splash.ball.y <= 0 || $.splash.ball.y+$.splash.ball.h > s_height){
				$.splash.ball.dy = - $.splash.ball.dy;
			}
			
			$.splash.ai();
			$.splash.score.s += 1;
			$.splash.draw();
			if(started){
				setTimeout('$.splash.update()',33);
			}
		},
		
		ai: function(){
			
			if($.splash.ball.y > $.splash.comp.y+($.splash.comp.h/2))
				$.splash.comp.y = $.splash.comp.y + $.splash.aiagent.speed;
			if($.splash.ball.y < $.splash.comp.y+($.splash.comp.h/2))
				$.splash.comp.y = $.splash.comp.y - $.splash.aiagent.speed;
			if($.splash.comp.y < 0)
				$.splash.comp.y = 0;
			if($.splash.comp.y > s_height - $.splash.comp.h)
				$.splash.comp.y = s_height - $.splash.comp.h;
		},
		
		/* Draw the game */
		draw: function(){
			$.splash.ball.e.css({'left':Math.round($.splash.ball.x),
				'top':Math.round($.splash.ball.y)});
			$.splash.comp.e.css({
				'top':Math.round($.splash.comp.y)});
			$.splash.player.e.css({
				'top':Math.round($.splash.player.y)});
			$.splash.score.e.empty().append($.splash.score.s+' '+version);
		},
		
		/* Utility functions */
		mousemove: function(mouse){
			$.splash.player.y = mouse.clientY-$('#splash').offset().top-($.splash.player.h/2);
			if($.splash.player.y < 0)
				$.splash.player.y = 0;
			if(($.splash.player.y + $.splash.player.h) > s_height)
				$.splash.player.y = s_height-$.splash.player.h;
		},
		
		time: function(){
			var d = new Date();
			return d.getTime();
		}
		
};

$(document).ready(function(){
	$.splash.init();
	$('#splash').click($.splash.start);
});