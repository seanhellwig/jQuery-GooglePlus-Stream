/**
 * TM GPlusStream widget / jQuery plugin
 * @author Sean Hellwig
 * @organization ThoughtMatrix <http://thought-matrix.com>
 */
/*jshint smarttabs:true, shadow:true, expr:true*/
!function($, window, undefined){
	var TMatrix = TMatrix || {};
		TMatrix.widgets = TMatrix.widgets || {};
	
	TMatrix.widgets.GPlusStream = function(container, options){
		var
			container = $(container),
			config = {
				'headerContainer': $('#tpmgps-widget-header'),
				'contentContainer' : $('#tpmgps-widget-container'),
				'API_KEY' : 'AIzaSyA4axePa6_b-OsuZq2Cm-JG3Up0njuv9Xw',
				'USER_ID' : '110031535020051778989',
				'NO_ITEM_TEXT' : 'No updates for this user.',
				'ADD_TO_CIRCLE_TEXT': 'Add to circles',
				'NO_PUBLIC_DATA': 'user does not have any public posts.'
			},
			/**
			 * I only use Obama's profile because it is popular and has many public posts.
			 * This was a personal choice and has NOTHING to do with my employer
			 */
			isLoaded = false,
			init = function(){
				if (isLoaded) {return this;}
				
				try	{
					gapi.client.setApiKey(config.API_KEY);
					gapi.client.load('plus', 'v1', clientLoaded);
				}catch(e){
					throw new Error('Error Setting Up G+');
				}
			
				isLoaded = true;
				
				return this;
			},
			clientLoaded = function(){
				var profileRequest = gapi.client.plus.people.get({
						'userId': config.USER_ID
				}),
				streamRequest = gapi.client.plus.activities.list({
						'userId': config.USER_ID,
						'collection': 'public'
				});
				
				profileRequest.execute(processProfileData);
				streamRequest.execute(processStreamData);
			},
			processProfileData = function(resp){
				var profileImg = $('<img class="tmgps-profile-image" />').attr('src', resp.image.url),
					profileInfoContainer = $('<div class="tmgps-profile-info" />'),
					profileName = $('<p class="tmgps-profile-name" />'),
					addToCircles = $('<div class="tmgps-profile-addtocircle"><g:plus href="https://plus.google.com/' + config.USER_ID + '" width="100" height="131" theme="light"></g:plus></div>');
								
				$.getScript('https://apis.google.com/js/plusone.js', function(script, textStatus, jqXHR){
					gapi.plus.go();
				});
				
				profileName.append(resp.displayName);
				addToCircles.attr('href', resp.url);
				
				profileInfoContainer.append(profileName, addToCircles);
				config.headerContainer.append(profileImg, profileInfoContainer);
				
			},
			processStreamData = function(resp){
				var i = 0,
					noData = $('<p/>').html(config.NO_PUBLIC_DATA);
				if (resp.items && resp.items.length) {
					for (i; i < resp.items.length; i++) {
						var item = $('<div class="tmgps-stream-item"/>'),
							title = $('<h3 />'),
							titleLink = $('<a />'),
							bodyContent = $('<p />'),
							innerContents = $('<div class="tmgps-stream-item-inner" />'),
							metaContainer = $('<div class="tmgps-stream-item-meta" />'),
							dateContainer = $('<div class="tmgps-stream-item-updated" />'),
							plusOneContainer = $('<div class="tmgps-stream-item-plusoners" />'),
							updateDate,
							j = 0;
						
						
						titleLink.attr('href', resp.items[i].url);
						titleLink.attr('target', '_blank');
						titleLink.html(resp.items[i].title);
						title.append(titleLink);
						bodyContent.html(resp.items[i].object.content);
						updateDate = resp.items[i].published.split('T')[0];
						
						dateContainer.append(updateDate);
						plusOneContainer.append('<span>+ ' + resp.items[i].object.plusoners.totalItems || 0 + '</span>');
						
						metaContainer.append(dateContainer, plusOneContainer);
						
						if (resp.items[i].object.attachments && resp.items[i].object.attachments.length) {
							for (j; j < resp.items[i].object.attachments.length; j++) {
								
								//should be an if.. but who knows what gplus will do with their api
								switch(resp.items[i].object.attachments[j].objectType){
									case 'photo':
										var img = $('<img alt="">');
										img.attr('src', resp.items[i].object.attachments[j].image.url);
										img.addClass('tmgps-stream-attachment-image tmgps-stream-attachment');
										

										innerContents.append(img);
									break;
								}
							}
						}
						
						item.append(title, innerContents, bodyContent, metaContainer);
						
						config.contentContainer.append(item);
					}
				}else{

					config.contentContainer.append(noData);
				}
			};
		
		$.extend(true, config, options || {});
		
		return {
			init: init
		}.init();
		
		
	};
	
	//why not make a jQuery plugin out of it, right?
	$.fn.TMGplusStream = function(options){
		return this.each(function(){
			var el = $(this),
				tmgps;

			if (el.data('tmgps')) { return el.data('tmgps'); }

			tmgps = new TMatrix.widgets.GPlusStream(this, options);

			el.data('tmgps', tmgps);

			return this;
		});
	};
	
	window.TMatrix = TMatrix;
}(jQuery, window);