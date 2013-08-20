(function($) {
	$.jQqueryResponsiveTable = function(table_id,options){
		var table_w = $(table_id).width();
		var window_w = $(window).width();
		//do nothing if the width of table is narower than the width of window(or <div>).
		if(table_w < window_w){
			return;
		}
		if(typeof options === "undefined"){
			//default settings
			var options= {
				'auto':true,
				'interval':3000,
				'default_display':1
			};
		}
		var thcnt=$(table_id + ' th').length;
		var display_col_width = 45+'%';
		//var hidden_col_width = (45/thcnt)+'%';
		var hidden_col_width = '14px';
		var originalDatas=tableToMatrix(table_id);

		current_target_col=displayTargetCol(table_id,options['default_display'],originalDatas,display_col_width,hidden_col_width);
		$(table_id + ' td').each(function(){
			tdindx = $(table_id + ' td').index(this);
			if(0 == calcIndxBelongToCol(table_id,tdindx)){
				$(this).append('<p class="point"><span></span></p>')
			}
		});
		if(0 < options['interval'] && true==options['auto']){
			target_col=options['default_display']+1;//next
			var interval_loop = setInterval(function(){
				if(target_col > $(table_id + ' th').length-1){
					target_col=1;//reset
				}
				current_target_col=displayTargetCol(table_id,target_col,originalDatas,display_col_width,hidden_col_width);
				target_col++;
			},options['interval']);//setInterval end
		}
		$(table_id + ' th').click(function () {
			var target_col=$(table_id + ' th').index(this);
			if(0!=target_col){
				current_target_col=displayTargetCol(table_id,target_col,originalDatas,display_col_width,hidden_col_width);
				clearInterval(interval_loop);
			}
		});
		$(table_id + ' td').on('click',function(){
			if(true==$(this).hasClass('contentsAllInRow') || true==$(this).hasClass('current_target_col')){
				return;
			}
			var tdindx=$(table_id + ' td').index(this);
			target_col = calcIndxBelongToCol(table_id,tdindx);
			if(0!=target_col){
				current_target_col=displayTargetCol(table_id,target_col,originalDatas,display_col_width,hidden_col_width);
			}else{
				var targetRow = $(this).closest(table_id + ' tr').index('tr');
				i=0;
				contentsAllInRow = '';
				while(i<thcnt){
					if(0==i){
						contentsAllInRow += '<div class="nameHeadLine exclusion col'+i+'">'
					}else if(current_target_col==i){
						contentsAllInRow += '<div class="current_target_col exclusion col'+i+'">'
					}else{
						contentsAllInRow += '<div class="exclusion col'+i+'">'
					}
					contentsAllInRow += originalDatas[0][i] + ' : ' + originalDatas[targetRow][i];
					if(0==i){
						contentsAllInRow += '<p class="point close"><span></span></p></div>'
					}else{
						 contentsAllInRow += '</div>'
		  			}
					i++;
				}
				$(this).addClass('contentsAllInRow')
					.attr('colspan',thcnt)
					.html(contentsAllInRow)
					.nextAll().css("display","none");
			}
			clearInterval(interval_loop);
		});
		//close
		$('div.nameHeadLine').live('click',function(){
			var targetRow = $(this).closest('tr').index('tr');
			$(this).closest('td')
				.removeClass('contentsAllInRow')
				.removeAttr("colspan")
				.animate({height: 0,}, 500 )
				.html(originalDatas[targetRow][0])
				.append('<p class="point"><span></span></p>')
				.nextAll()
				.css("height","")
				.css("display","");
			current_target_col=displayTargetCol(table_id,current_target_col,originalDatas,display_col_width,hidden_col_width);
		});
		$(table_id + ' td div.exclusion').live('click',function(){
			if($(this).hasClass('current_target_col') || $(this).hasClass('nameHeadLine')){
				return;
			}else{
				var div_exclusion_indx = $(table_id + ' td div.exclusion').index(this);
				target_col=calcIndxBelongToCol(table_id,div_exclusion_indx);
				current_target_col=displayTargetCol(table_id,target_col,originalDatas,display_col_width,hidden_col_width);
			}
		});
	}
//---------------------------------------------------------------------------------------------------------------
	function tableToMatrix(table_id) {
	    var data = [];
	    $(table_id + ' tr').each(function(i) {
	        data[i] = [];
	        $('th', $(this)).each(function(j) {
	            data[i][j] = $(this).html();
	            
	        });
	        $('td', $(this)).each(function(k) {
	            data[i][k] = $(this).html();
	            
	        });
	    });
	    return data;
	}
	function displayTargetCol(table_id,target_col,originalDatas,display_col_width,hidden_col_width){
		$(table_id + ' th').css({ 
			width: hidden_col_width,
		});
		$(table_id + ' th:not(:first)').text('>');
		$(table_id + ' th:eq(' + target_col + ')').text(originalDatas[0][target_col]);
		$('td:not(:eq(0))',$(table_id + ' tr')).text('...');
		$("div.current_target_col").removeClass("current_target_col");
		$("td.current_target_col").removeClass("current_target_col");
	    $(table_id + ' tr').each(function(i) {
	        $('td', $(this)).each(function(j) {
	        	if(j==target_col){
	           		$(this).text(originalDatas[i][j])
	           			.css({ 
							textIndent: '-' + $(table_id + ' th').css('width'),
						})
						.addClass('current_target_col')
						.animate({ 
							textIndent: 0,
						}, 1000 );
	        	}
	        });
	    });
	    $(table_id + ' div.exclusion').each(function(e){
	    	if($(this).hasClass("col"+target_col)){
	    		$(this).addClass('current_target_col');
	    	}
	    });
	    return target_col;
	}
	function calcIndxBelongToCol(table_id,indx){
		var thcnt=$(table_id + ' th').length;
		if(indx<=thcnt){
			col = indx;
		}else{
			col = (indx)%thcnt;
		}
		if(0==col || 0==col%(thcnt+1) || col==(thcnt)){
			col = 0;
		}
		return col;
	}
})(jQuery);