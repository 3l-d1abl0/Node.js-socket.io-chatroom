var socket;
$(document).ready(function(){

	//socket= io.connect('http://localhost:8080');

	socket = io();
	
	var $mBox=$('#MessageTextBox');
	var $cBox=$('#content');
	var $uname=$('#unbox');
	var username;
	

	function showDown(nicks){
		$('.dummymb').hide();	$('.main-body').show();
		$('#MessageTextBox').show();
		$('.usdummy').hide();	$('.user-stat').show();

		var onu='';

		for(var i=0;i<nicks.length;i++){
			onu +='<center><span style="color: #39FF14">'+nicks[i]+ '</span></center> <br>';
		}

		$('.onlineUsers').html(onu);
	}


	
	$mBox.keypress(function(e) {
   				 if(e.which == 13) {

   				 	if($mBox.val().trim()==''){
   				 		//alert('No Blanks');
   				 		return false;
   				 	}
   				 	else{
   				 		   				 		
   				 		socket.emit('sendMessage',$mBox.val().trim(),function(err){
   				 			$cBox.append('<div class="err"> *** Failed :'+$mBox.val().trim()+' ***</div>');
   				 		});
   				 		
   				 		$mBox.val("");
   				 	}

    			}//if
		});
	
	socket.on('newMessage',function(message){
			//alert(message);
			$(".audioDemo").trigger('play');
			var msg= '<span style="color: #33A1DE">'+message.user+ ':</span>';
   				msg+='	<span style="color: #39FF14">'+message.msg+ '</span> ';

				$cBox.append('<div class="incoming">'+msg+'</div>');
				$('#main-body').animate({
					scrollTop: $cBox.height()
				});

				//starts playing
				//$(".audioDemo").trigger('play');
				//pause playing
				//$(".audioDemo").trigger('pause');
	});

	socket.on('Oldies',function(data){
			for(var i=data.length-1;i>=0;i--){
				
				var msg= '<span style="color: #33A1DE">'+data[i].nick+ ':</span>';
   					msg+='	<span style="color: #39FF14">'+data[i].msg+ '</span> ';

					$cBox.append('<div class="incoming">'+msg+'</div>');
			}
	});

	$uname.keypress(function(e){
			if(e.which==13){
				//alert('pr');
				username=$uname.val().trim();
				if(username==''){
					$('#ermsg').html('Cannot be blank !');
					return false;
				}

					socket.emit('newUser',$uname.val());
					
					socket.on('userNames',function(nicks){
						$('.title-bar').html('Welcome '+ username);
							showDown(nicks);
					});

					socket.on('userExists',function(nick){
							$('#ermsg').html(nick +' Is Taken !');
					});
					$uname.val('');					
					
			}

	});


});