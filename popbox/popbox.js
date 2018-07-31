class Popbox{
	constructor(config = {blur:false}){
		this.currently_opened = [];
		if('blur' in config){
			if(config.blur){
				var main_content = document.querySelector('.popbox_main_content');
				if(main_content){
					main_content.classList.add('popbox_blur');
				}
			}
		}
		this.bindEvents();

	}		
	bindEvents(){
		var triggers = document.querySelectorAll('[data-popbox-target]');
		var closers = document.querySelectorAll('[data-popbox-close]');
		var popboxs = document.querySelectorAll('[data-popbox-id]');
		var self = this;
		if(triggers){
			for (var i = 0; i < triggers.length; i++) {
			    triggers[i].addEventListener('click', function(e){
			   		e.preventDefault();
					var popbox_id = this.getAttribute('data-popbox-target');
					if(popbox_id){
						self.open(popbox_id);
					}
			    }, false);
			}
		}
		if(closers){
			for (var i = 0; i < closers.length; i++) {
			    closers[i].addEventListener('click', function(e){
			   		e.preventDefault();
					var popbox_id = this.getAttribute('data-popbox-close');
					if(popbox_id){
						self.close(popbox_id);
					}
			    }, false);
			}
		}
		if(popboxs){
			for (var i = 0; i < popboxs.length; i++) {
			    popboxs[i].addEventListener('click', function(e){
			   		e.preventDefault();
					var popbox_id = e.target.getAttribute('data-popbox-id');
					if(popbox_id){
						self.close(popbox_id);
					}
			    }, false);

				popboxs[i].addEventListener(self.transition, function(e) {
					if(this.classList.contains('opened') && !this.classList.contains('visible')){
				  		this.classList.remove('opened');
					}
				});


			}
		}
		document.addEventListener('keyup', function(e){
			if(self.current(true) && e.keyCode == 27){
				self.close(self.current(true));
			}
		});

	}
	opened(popbox){
		if(popbox){
			var event = new CustomEvent("popbox_opened",{bubbles:true,detail:{popbox:popbox}});
			popbox.dispatchEvent(event);
		}
	}
	opening(popbox){
		if(popbox){
			var event = new CustomEvent("popbox_opening",{bubbles:true,detail:{popbox:popbox}});
			popbox.dispatchEvent(event);
		}
	}
	closing(popbox){
		if(popbox){
			var event = new CustomEvent("popbox_closing",{bubbles:true,detail:{popbox:popbox}});
			popbox.dispatchEvent(event);
		}
	}
	closed(popbox){
		if(popbox){
			var event = new CustomEvent("popbox_closed",{bubbles:true,detail:{popbox:popbox}});
			popbox.dispatchEvent(event);
		}
	}
	current(last = false){
		if(last){
			var current = null;
			if(this.currently_opened.length){
				current = this.currently_opened[this.currently_opened.length-1];			
			}
			return current;
		}else{
			return this.currently_opened;
		}
	}
	add(popbox){
		var popbox_id = this.getId(popbox);
		this.remove(popbox_id);
		this.currently_opened.push(popbox_id);
	}
	remove(popbox){
		var popbox_id = this.getId(popbox);
		var index = this.currently_opened.indexOf(popbox_id);
		if (index > -1) {
		   this.currently_opened.splice(index, 1);
		}
	}
	zIndex(){
		var zindex = 9999;
		var last = this.current(true);
		if(last){
			var last = this.find(last);
			if(last){
				zindex = parseInt(last.style.zIndex);
			}
		}

		return zindex;
	}
	find(popbox_id){
		var popbox = this.select('[data-popbox-id="'+popbox_id+'"]');
		return popbox;
	}
	select(selector){
		return document.querySelector(selector);
	}
	clear(){
		var popboxes = document.querySelectorAll('[data-popbox-id].opened');
	    for (var i = 0; i < popboxes.length; i++){
	    	this.close(popboxes[i]);
	    }
	    this.currently_opened = [];
		this.select('html').classList.remove('popbox_locked');	
		this.select('html').removeAttribute('popbox');	

	}
	close(popbox){
		var popbox_id = this.getId(popbox);
		var popbox = this.getpopbox(popbox);
		if(popbox){
			this.closing(popbox);
			this.remove(popbox_id);
			popbox.classList.remove('visible');
			popbox.style.zIndex = -999;
			if(this.currently_opened.length == 0){
				this.select('html').classList.remove('popbox_locked');					
			}
			if(this.current(true)){
			this.select('html').setAttribute('popbox',this.current(true));	
			}else{
			this.select('html').removeAttribute('popbox');	
			}
			this.closed(popbox);
		}

	}
	getpopbox(popbox){
		if(popbox instanceof HTMLElement){
			return popbox;
		}else{
			return this.find(popbox);
		}
	}
	getId(popbox){
		if(popbox instanceof HTMLElement){
			return popbox.getAttribute('data-popbox-id');
		}else{
			return popbox;
		}
	}
	open(popbox){
		var popbox_id = this.getId(popbox);
		var popbox = this.getpopbox(popbox);
		if(popbox){
			this.opening(popbox);
			popbox.style.zIndex = this.zIndex()+1;
				popbox.classList.add('opened');
				setTimeout(function () {
				  popbox.classList.add('visible');
				});
				this.select('html').classList.add('popbox_locked');
				this.select('html').setAttribute('popbox',popbox_id);	
			this.add(popbox_id);
			this.opened(popbox);
		}
	}
}