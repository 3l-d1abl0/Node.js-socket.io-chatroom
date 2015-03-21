var socket;
$(document).ready(function(){

	//socket= io.connect('http://localhost:8080');
	socket = io();
	var $mBox=$('#MessageTextBox');
	var $cBox=$('#content');
	var $uname=$('#unbox');
	var username;
	//alert('Wohaa...!!');

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

   				 	if($mBox.val()==''){
   				 		return false;
   				 	}

   				 	var msg= '<span style="color: #33A1DE">'+username+ ':</span>';
   				 		msg+='	<span style="color: #39FF14">'+$mBox.val()+ '</span> ';
   				 	socket.emit('sendMessage',msg);
   				 	//$cBox.append('<div class="incoming">'+txt+'</div>');
   				 	$mBox.val('');

    				}//if
		});
	
	socket.on('newMessage',function(message){
			//alert(message);
			$cBox.append('<div class="incoming">'+message+'</div>');
	});

	$uname.keypress(function(e){
			if(e.which==13){
				//alert('pr');
				username=$uname.val();
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

	/*
	socket.on('MyEvent',function(message){
			alert(message);
	});

	$('#one').click(function(){
    //Some code
		$('#two').html("Hello <b>world</b>!");
	});

	$('#two').click(function(){
    //Some code
		$('#one').html("tytytyty!");
	});
	*/
});