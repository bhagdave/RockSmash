
//Change this to true for a stretchy canvas!
//
var RESIZEABLE_CANVAS=false;

//Start us up!
//
window.onload=function( e ){

	if( RESIZEABLE_CANVAS ){
		window.onresize=function( e ){
			var canvas=document.getElementById( "GameCanvas" );

			//This vs window.innerWidth, which apparently doesn't account for scrollbar?
			var width=document.body.clientWidth;
			
			//This vs document.body.clientHeight, which does weird things - document seems to 'grow'...perhaps canvas resize pushing page down?
			var height=window.innerHeight;			

			canvas.width=width;
			canvas.height=height;
		}
		window.onresize( null );
	}

	BBMonkeyGame.Main( document.getElementById( "GameCanvas" ) );
}

//${CONFIG_BEGIN}
CFG_BINARY_FILES="*.bin|*.dat";
CFG_BRL_GAMETARGET_IMPLEMENTED="1";
CFG_BRL_THREAD_IMPLEMENTED="1";
CFG_CD="";
CFG_CONFIG="release";
CFG_HOST="winnt";
CFG_IMAGE_FILES="*.png|*.jpg";
CFG_LANG="js";
CFG_MODPATH=".;C:/MonkeyPro70g/RockSmash;C:/MonkeyPro70g/modules;C:/MonkeyPro70g/modules_ext;C:/MonkeyPro70g/targets/html5/modules";
CFG_MOJO_AUTO_SUSPEND_ENABLED="0";
CFG_MONKEYDIR="";
CFG_MUSIC_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_OPENGL_GLES20_ENABLED="0";
CFG_SAFEMODE="0";
CFG_SOUND_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_TARGET="html5";
CFG_TEXT_FILES="*.txt|*.xml|*.json";
CFG_TRANSDIR="";
//${CONFIG_END}

//${METADATA_BEGIN}
var META_DATA="[cc_font.png];type=image/png;width=256;height=128;\n[cctiles.png];type=image/png;width=128;height=128;\n[mojo_font.png];type=image/png;width=864;height=13;\n";
//${METADATA_END}

//${TRANSCODE_BEGIN}

// Javascript Monkey runtime.
//
// Placed into the public domain 24/02/2011.
// No warranty implied; use at your own risk.

//***** JavaScript Runtime *****

var D2R=0.017453292519943295;
var R2D=57.29577951308232;

var err_info="";
var err_stack=[];

var dbg_index=0;

function push_err(){
	err_stack.push( err_info );
}

function pop_err(){
	err_info=err_stack.pop();
}

function stackTrace(){
	if( !err_info.length ) return "";
	var str=err_info+"\n";
	for( var i=err_stack.length-1;i>0;--i ){
		str+=err_stack[i]+"\n";
	}
	return str;
}

function print( str ){
	var cons=document.getElementById( "GameConsole" );
	if( cons ){
		cons.value+=str+"\n";
		cons.scrollTop=cons.scrollHeight-cons.clientHeight;
	}else if( window.console!=undefined ){
		window.console.log( str );
	}
	return 0;
}

function alertError( err ){
	if( typeof(err)=="string" && err=="" ) return;
	alert( "Monkey Runtime Error : "+err.toString()+"\n\n"+stackTrace() );
}

function error( err ){
	throw err;
}

function debugLog( str ){
	if( window.console!=undefined ) window.console.log( str );
}

function debugStop(){
	debugger;	//	error( "STOP" );
}

function dbg_object( obj ){
	if( obj ) return obj;
	error( "Null object access" );
}

function dbg_charCodeAt( str,index ){
	if( index<0 || index>=str.length ) error( "Character index out of range" );
	return str.charCodeAt( index );
}

function dbg_array( arr,index ){
	if( index<0 || index>=arr.length ) error( "Array index out of range" );
	dbg_index=index;
	return arr;
}

function new_bool_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=false;
	return arr;
}

function new_number_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=0;
	return arr;
}

function new_string_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]='';
	return arr;
}

function new_array_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=[];
	return arr;
}

function new_object_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=null;
	return arr;
}

function resize_bool_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=false;
	return arr;
}

function resize_number_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=0;
	return arr;
}

function resize_string_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]="";
	return arr;
}

function resize_array_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=[];
	return arr;
}

function resize_object_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=null;
	return arr;
}

function string_compare( lhs,rhs ){
	var n=Math.min( lhs.length,rhs.length ),i,t;
	for( i=0;i<n;++i ){
		t=lhs.charCodeAt(i)-rhs.charCodeAt(i);
		if( t ) return t;
	}
	return lhs.length-rhs.length;
}

function string_replace( str,find,rep ){	//no unregex replace all?!?
	var i=0;
	for(;;){
		i=str.indexOf( find,i );
		if( i==-1 ) return str;
		str=str.substring( 0,i )+rep+str.substring( i+find.length );
		i+=rep.length;
	}
}

function string_trim( str ){
	var i=0,i2=str.length;
	while( i<i2 && str.charCodeAt(i)<=32 ) i+=1;
	while( i2>i && str.charCodeAt(i2-1)<=32 ) i2-=1;
	return str.slice( i,i2 );
}

function string_startswith( str,substr ){
	return substr.length<=str.length && str.slice(0,substr.length)==substr;
}

function string_endswith( str,substr ){
	return substr.length<=str.length && str.slice(str.length-substr.length,str.length)==substr;
}

function string_tochars( str ){
	var arr=new Array( str.length );
	for( var i=0;i<str.length;++i ) arr[i]=str.charCodeAt(i);
	return arr;
}

function string_fromchars( chars ){
	var str="",i;
	for( i=0;i<chars.length;++i ){
		str+=String.fromCharCode( chars[i] );
	}
	return str;
}

function object_downcast( obj,clas ){
	if( obj instanceof clas ) return obj;
	return null;
}

function object_implements( obj,iface ){
	if( obj && obj.implments && obj.implments[iface] ) return obj;
	return null;
}

function extend_class( clas ){
	var tmp=function(){};
	tmp.prototype=clas.prototype;
	return new tmp;
}

function ThrowableObject(){
}

ThrowableObject.prototype.toString=function(){ 
	return "Uncaught Monkey Exception"; 
}

function BBGameEvent(){}
BBGameEvent.KeyDown=1;
BBGameEvent.KeyUp=2;
BBGameEvent.KeyChar=3;
BBGameEvent.MouseDown=4;
BBGameEvent.MouseUp=5;
BBGameEvent.MouseMove=6;
BBGameEvent.TouchDown=7;
BBGameEvent.TouchUp=8;
BBGameEvent.TouchMove=9;
BBGameEvent.MotionAccel=10;

function BBGameDelegate(){}
BBGameDelegate.prototype.StartGame=function(){}
BBGameDelegate.prototype.SuspendGame=function(){}
BBGameDelegate.prototype.ResumeGame=function(){}
BBGameDelegate.prototype.UpdateGame=function(){}
BBGameDelegate.prototype.RenderGame=function(){}
BBGameDelegate.prototype.KeyEvent=function( ev,data ){}
BBGameDelegate.prototype.MouseEvent=function( ev,data,x,y ){}
BBGameDelegate.prototype.TouchEvent=function( ev,data,x,y ){}
BBGameDelegate.prototype.MotionEvent=function( ev,data,x,y,z ){}
BBGameDelegate.prototype.DiscardGraphics=function(){}

function BBGame(){
	BBGame._game=this;
	this._delegate=null;
	this._keyboardEnabled=false;
	this._updateRate=0;
	this._started=false;
	this._suspended=false;
	this._debugExs=(CFG_CONFIG=="debug");
	this._startms=Date.now();
}

BBGame.Game=function(){
	return BBGame._game;
}

BBGame.prototype.SetDelegate=function( delegate ){
	this._delegate=delegate;
}

BBGame.prototype.Delegate=function(){
	return this._delegate;
}

BBGame.prototype.SetUpdateRate=function( updateRate ){
	this._updateRate=updateRate;
}

BBGame.prototype.SetKeyboardEnabled=function( keyboardEnabled ){
	this._keyboardEnabled=keyboardEnabled;
}

BBGame.prototype.Started=function(){
	return this._started;
}

BBGame.prototype.Suspended=function(){
	return this._suspended;
}

BBGame.prototype.Millisecs=function(){
	return Date.now()-this._startms;
}

BBGame.prototype.GetDate=function( date ){
	var n=date.length;
	if( n>0 ){
		var t=new Date();
		date[0]=t.getFullYear();
		if( n>1 ){
			date[1]=t.getMonth()+1;
			if( n>2 ){
				date[2]=t.getDate();
				if( n>3 ){
					date[3]=t.getHours();
					if( n>4 ){
						date[4]=t.getMinutes();
						if( n>5 ){
							date[5]=t.getSeconds();
							if( n>6 ){
								date[6]=t.getMilliseconds();
							}
						}
					}
				}
			}
		}
	}
}

BBGame.prototype.SaveState=function( state ){
	localStorage.setItem( "monkeystate@"+document.URL,state );	//key can't start with dot in Chrome!
	return 1;
}

BBGame.prototype.LoadState=function(){
	var state=localStorage.getItem( "monkeystate@"+document.URL );
	if( state ) return state;
	return "";
}

BBGame.prototype.LoadString=function( path ){

	var xhr=new XMLHttpRequest();
	xhr.open( "GET",this.PathToUrl( path ),false );
	
	xhr.send( null );
	
	if( xhr.status==200 || xhr.status==0 ) return xhr.responseText;
	
	return "";
}

BBGame.prototype.PollJoystick=function( port,joyx,joyy,joyz,buttons ){
	return false;
}

BBGame.prototype.OpenUrl=function( url ){
	window.location=url;
}

BBGame.prototype.SetMouseVisible=function( visible ){
	if( visible ){
		this._canvas.style.cursor='default';	
	}else{
		this._canvas.style.cursor="url('data:image/cur;base64,AAACAAEAICAAAAAAAACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAgBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA55ZXBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOeWVxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADnllcGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9////////////////////+////////f/////////8%3D'), auto";
	}
}

BBGame.prototype.PathToFilePath=function( path ){
	return "";
}

//***** js Game *****

BBGame.prototype.PathToUrl=function( path ){
	return path;
}

BBGame.prototype.LoadData=function( path ){

	var xhr=new XMLHttpRequest();
	xhr.open( "GET",this.PathToUrl( path ),false );

	if( xhr.overrideMimeType ) xhr.overrideMimeType( "text/plain; charset=x-user-defined" );

	xhr.send( null );
	if( xhr.status!=200 && xhr.status!=0 ) return null;

	var r=xhr.responseText;
	var buf=new ArrayBuffer( r.length );
	var bytes=new Int8Array( buf );
	for( var i=0;i<r.length;++i ){
		bytes[i]=r.charCodeAt( i );
	}
	return buf;
}

//***** INTERNAL ******

BBGame.prototype.Die=function( ex ){

	this._delegate=new BBGameDelegate();
	
	if( !ex.toString() ){
		return;
	}
	
	if( this._debugExs ){
		print( "Monkey Runtime Error : "+ex.toString() );
		print( stackTrace() );
	}
	
	throw ex;
}

BBGame.prototype.StartGame=function(){

	if( this._started ) return;
	this._started=true;
	
	if( this._debugExs ){
		try{
			this._delegate.StartGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.StartGame();
	}
}

BBGame.prototype.SuspendGame=function(){

	if( !this._started || this._suspended ) return;
	this._suspended=true;
	
	if( this._debugExs ){
		try{
			this._delegate.SuspendGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.SuspendGame();
	}
}

BBGame.prototype.ResumeGame=function(){

	if( !this._started || !this._suspended ) return;
	this._suspended=false;
	
	if( this._debugExs ){
		try{
			this._delegate.ResumeGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.ResumeGame();
	}
}

BBGame.prototype.UpdateGame=function(){

	if( !this._started || this._suspended ) return;

	if( this._debugExs ){
		try{
			this._delegate.UpdateGame();
		}catch( ex ){
			this.Die( ex );
		}	
	}else{
		this._delegate.UpdateGame();
	}
}

BBGame.prototype.RenderGame=function(){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.RenderGame();
		}catch( ex ){
			this.Die( ex );
		}	
	}else{
		this._delegate.RenderGame();
	}
}

BBGame.prototype.KeyEvent=function( ev,data ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.KeyEvent( ev,data );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.KeyEvent( ev,data );
	}
}

BBGame.prototype.MouseEvent=function( ev,data,x,y ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.MouseEvent( ev,data,x,y );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.MouseEvent( ev,data,x,y );
	}
}

BBGame.prototype.TouchEvent=function( ev,data,x,y ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.TouchEvent( ev,data,x,y );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.TouchEvent( ev,data,x,y );
	}
}

BBGame.prototype.MotionEvent=function( ev,data,x,y,z ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.MotionEvent( ev,data,x,y,z );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.MotionEvent( ev,data,x,y,z );
	}
}

BBGame.prototype.DiscardGraphics=function(){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.DiscardGraphics();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.DiscardGraphics();
	}
}

function BBHtml5Game( canvas ){
	BBGame.call( this );
	BBHtml5Game._game=this;
	this._canvas=canvas;
	this._loading=0;
	this._timerSeq=0;
	this._gl=null;
	if( CFG_OPENGL_GLES20_ENABLED=="1" ){
		this._gl=this._canvas.getContext( "webgl" );
		if( !this._gl ) this._gl=this._canvas.getContext( "experimental-webgl" );
		if( !this._gl ) this.Die( "Can't create WebGL" );
		gl=this._gl;
	}
}

BBHtml5Game.prototype=extend_class( BBGame );

BBHtml5Game.Html5Game=function(){
	return BBHtml5Game._game;
}

BBHtml5Game.prototype.ValidateUpdateTimer=function(){

	++this._timerSeq;

	if( !this._updateRate || this._suspended ) return;
	
	var game=this;
	var updatePeriod=1000.0/this._updateRate;
	var nextUpdate=Date.now()+updatePeriod;
	var seq=game._timerSeq;
	
	function timeElapsed(){
		if( seq!=game._timerSeq ) return;

		var time;		
		var updates;
		
		for( updates=0;updates<4;++updates ){
		
			nextUpdate+=updatePeriod;
			
			game.UpdateGame();
			if( seq!=game._timerSeq ) return;
			
			if( nextUpdate-Date.now()>0 ) break;
		}
		
		game.RenderGame();
		if( seq!=game._timerSeq ) return;
		
		if( updates==4 ){
			nextUpdate=Date.now();
			setTimeout( timeElapsed,0 );
		}else{
			var delay=nextUpdate-Date.now();
			setTimeout( timeElapsed,delay>0 ? delay : 0 );
		}
	}

	setTimeout( timeElapsed,updatePeriod );
}

//***** BBGame methods *****

BBHtml5Game.prototype.SetUpdateRate=function( updateRate ){

	BBGame.prototype.SetUpdateRate.call( this,updateRate );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.GetMetaData=function( path,key ){
	if( path.indexOf( "monkey://data/" )!=0 ) return "";
	path=path.slice(14);

	var i=META_DATA.indexOf( "["+path+"]" );
	if( i==-1 ) return "";
	i+=path.length+2;

	var e=META_DATA.indexOf( "\n",i );
	if( e==-1 ) e=META_DATA.length;

	i=META_DATA.indexOf( ";"+key+"=",i )
	if( i==-1 || i>=e ) return "";
	i+=key.length+2;

	e=META_DATA.indexOf( ";",i );
	if( e==-1 ) return "";

	return META_DATA.slice( i,e );
}

BBHtml5Game.prototype.PathToUrl=function( path ){
	if( path.indexOf( "monkey:" )!=0 ){
		return path;
	}else if( path.indexOf( "monkey://data/" )==0 ) {
		return "data/"+path.slice( 14 );
	}
	return "";
}

BBHtml5Game.prototype.GetLoading=function(){
	return this._loading;
}

BBHtml5Game.prototype.IncLoading=function(){
	++this._loading;
	return this._loading;
}

BBHtml5Game.prototype.DecLoading=function(){
	--this._loading;
	return this._loading;
}

BBHtml5Game.prototype.GetCanvas=function(){
	return this._canvas;
}

BBHtml5Game.prototype.GetWebGL=function(){
	return this._gl;
}

//***** INTERNAL *****

BBHtml5Game.prototype.UpdateGame=function(){

	if( !this._loading ) BBGame.prototype.UpdateGame.call( this );
}

BBHtml5Game.prototype.SuspendGame=function(){

	BBGame.prototype.SuspendGame.call( this );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.ResumeGame=function(){

	BBGame.prototype.ResumeGame.call( this );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.Run=function(){

	var game=this;
	var canvas=game._canvas;
	
	var touchIds=new Array( 32 );
	for( i=0;i<32;++i ) touchIds[i]=-1;
	
	function eatEvent( e ){
		if( e.stopPropagation ){
			e.stopPropagation();
			e.preventDefault();
		}else{
			e.cancelBubble=true;
			e.returnValue=false;
		}
	}
	
	function keyToChar( key ){
		switch( key ){
		case 8:case 9:case 13:case 27:case 32:return key;
		case 33:case 34:case 35:case 36:case 37:case 38:case 39:case 40:case 45:return key|0x10000;
		case 46:return 127;
		}
		return 0;
	}
	
	function mouseX( e ){
		var x=e.clientX+document.body.scrollLeft;
		var c=canvas;
		while( c ){
			x-=c.offsetLeft;
			c=c.offsetParent;
		}
		return x;
	}
	
	function mouseY( e ){
		var y=e.clientY+document.body.scrollTop;
		var c=canvas;
		while( c ){
			y-=c.offsetTop;
			c=c.offsetParent;
		}
		return y;
	}

	function touchX( touch ){
		var x=touch.pageX;
		var c=canvas;
		while( c ){
			x-=c.offsetLeft;
			c=c.offsetParent;
		}
		return x;
	}			
	
	function touchY( touch ){
		var y=touch.pageY;
		var c=canvas;
		while( c ){
			y-=c.offsetTop;
			c=c.offsetParent;
		}
		return y;
	}
	
	canvas.onkeydown=function( e ){
		game.KeyEvent( BBGameEvent.KeyDown,e.keyCode );
		var chr=keyToChar( e.keyCode );
		if( chr ) game.KeyEvent( BBGameEvent.KeyChar,chr );
		if( e.keyCode<48 || (e.keyCode>111 && e.keyCode<122) ) eatEvent( e );
	}

	canvas.onkeyup=function( e ){
		game.KeyEvent( BBGameEvent.KeyUp,e.keyCode );
	}

	canvas.onkeypress=function( e ){
		if( e.charCode ){
			game.KeyEvent( BBGameEvent.KeyChar,e.charCode );
		}else if( e.which ){
			game.KeyEvent( BBGameEvent.KeyChar,e.which );
		}
	}

	canvas.onmousedown=function( e ){
		switch( e.button ){
		case 0:game.MouseEvent( BBGameEvent.MouseDown,0,mouseX(e),mouseY(e) );break;
		case 1:game.MouseEvent( BBGameEvent.MouseDown,2,mouseX(e),mouseY(e) );break;
		case 2:game.MouseEvent( BBGameEvent.MouseDown,1,mouseX(e),mouseY(e) );break;
		}
		eatEvent( e );
	}
	
	canvas.onmouseup=function( e ){
		switch( e.button ){
		case 0:game.MouseEvent( BBGameEvent.MouseUp,0,mouseX(e),mouseY(e) );break;
		case 1:game.MouseEvent( BBGameEvent.MouseUp,2,mouseX(e),mouseY(e) );break;
		case 2:game.MouseEvent( BBGameEvent.MouseUp,1,mouseX(e),mouseY(e) );break;
		}
		eatEvent( e );
	}
	
	canvas.onmousemove=function( e ){
		game.MouseEvent( BBGameEvent.MouseMove,-1,mouseX(e),mouseY(e) );
		eatEvent( e );
	}

	canvas.onmouseout=function( e ){
		game.MouseEvent( BBGameEvent.MouseUp,0,mouseX(e),mouseY(e) );
		game.MouseEvent( BBGameEvent.MouseUp,1,mouseX(e),mouseY(e) );
		game.MouseEvent( BBGameEvent.MouseUp,2,mouseX(e),mouseY(e) );
		eatEvent( e );
	}

	canvas.ontouchstart=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=-1 ) continue;
				touchIds[j]=touch.identifier;
				game.TouchEvent( BBGameEvent.TouchDown,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	canvas.ontouchmove=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=touch.identifier ) continue;
				game.TouchEvent( BBGameEvent.TouchMove,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	canvas.ontouchend=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=touch.identifier ) continue;
				touchIds[j]=-1;
				game.TouchEvent( BBGameEvent.TouchUp,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	window.ondevicemotion=function( e ){
		var tx=e.accelerationIncludingGravity.x/9.81;
		var ty=e.accelerationIncludingGravity.y/9.81;
		var tz=e.accelerationIncludingGravity.z/9.81;
		var x,y;
		switch( window.orientation ){
		case   0:x=+tx;y=-ty;break;
		case 180:x=-tx;y=+ty;break;
		case  90:x=-ty;y=-tx;break;
		case -90:x=+ty;y=+tx;break;
		}
		game.MotionEvent( BBGameEvent.MotionAccel,0,x,y,tz );
		eatEvent( e );
	}

	canvas.onfocus=function( e ){
		if( CFG_MOJO_AUTO_SUSPEND_ENABLED=="1" ){
			game.ResumeGame();
		}
	}
	
	canvas.onblur=function( e ){
		if( CFG_MOJO_AUTO_SUSPEND_ENABLED=="1" ){
			game.SuspendGame();
		}
	}
	
	canvas.focus();
	
	game.StartGame();

	game.RenderGame();
}

function BBMonkeyGame( canvas ){
	BBHtml5Game.call( this,canvas );
}

BBMonkeyGame.prototype=extend_class( BBHtml5Game );

BBMonkeyGame.Main=function( canvas ){

	var game=new BBMonkeyGame( canvas );

	try{

		bbInit();
		bbMain();

	}catch( ex ){
	
		game.Die( ex );
		return;
	}

	if( !game.Delegate() ) return;
	
	game.Run();
}

// HTML5 mojo runtime.
//
// Copyright 2011 Mark Sibly, all rights reserved.
// No warranty implied; use at your own risk.

//***** gxtkGraphics class *****

function gxtkGraphics(){
	this.game=BBHtml5Game.Html5Game();
	this.canvas=this.game.GetCanvas()
	this.width=this.canvas.width;
	this.height=this.canvas.height;
	this.gl=null;
	this.gc=this.canvas.getContext( '2d' );
	this.tmpCanvas=null;
	this.r=255;
	this.b=255;
	this.g=255;
	this.white=true;
	this.color="rgb(255,255,255)"
	this.alpha=1;
	this.blend="source-over";
	this.ix=1;this.iy=0;
	this.jx=0;this.jy=1;
	this.tx=0;this.ty=0;
	this.tformed=false;
	this.scissorX=0;
	this.scissorY=0;
	this.scissorWidth=0;
	this.scissorHeight=0;
	this.clipped=false;
}

gxtkGraphics.prototype.BeginRender=function(){
	this.width=this.canvas.width;
	this.height=this.canvas.height;
	if( !this.gc ) return 0;
	this.gc.save();
	if( this.game.GetLoading() ) return 2;
	return 1;
}

gxtkGraphics.prototype.EndRender=function(){
	if( this.gc ) this.gc.restore();
}

gxtkGraphics.prototype.Width=function(){
	return this.width;
}

gxtkGraphics.prototype.Height=function(){
	return this.height;
}

gxtkGraphics.prototype.LoadSurface=function( path ){
	var game=this.game;

	var ty=game.GetMetaData( path,"type" );
	if( ty.indexOf( "image/" )!=0 ) return null;
	
	function onloadfun(){
		game.DecLoading();
	}
	
	game.IncLoading();

	var image=new Image();
	image.onload=onloadfun;
	image.meta_width=parseInt( game.GetMetaData( path,"width" ) );
	image.meta_height=parseInt( game.GetMetaData( path,"height" ) );
	image.src=game.PathToUrl( path );

	return new gxtkSurface( image,this );
}

gxtkGraphics.prototype.CreateSurface=function( width,height ){
	var canvas=document.createElement( 'canvas' );
	
	canvas.width=width;
	canvas.height=height;
	canvas.meta_width=width;
	canvas.meta_height=height;
	canvas.complete=true;
	
	var surface=new gxtkSurface( canvas,this );
	
	surface.gc=canvas.getContext( '2d' );
	
	return surface;
}

gxtkGraphics.prototype.SetAlpha=function( alpha ){
	this.alpha=alpha;
	this.gc.globalAlpha=alpha;
}

gxtkGraphics.prototype.SetColor=function( r,g,b ){
	this.r=r;
	this.g=g;
	this.b=b;
	this.white=(r==255 && g==255 && b==255);
	this.color="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
}

gxtkGraphics.prototype.SetBlend=function( blend ){
	switch( blend ){
	case 1:
		this.blend="lighter";
		break;
	default:
		this.blend="source-over";
	}
	this.gc.globalCompositeOperation=this.blend;
}

gxtkGraphics.prototype.SetScissor=function( x,y,w,h ){
	this.scissorX=x;
	this.scissorY=y;
	this.scissorWidth=w;
	this.scissorHeight=h;
	this.clipped=(x!=0 || y!=0 || w!=this.canvas.width || h!=this.canvas.height);
	this.gc.restore();
	this.gc.save();
	if( this.clipped ){
		this.gc.beginPath();
		this.gc.rect( x,y,w,h );
		this.gc.clip();
		this.gc.closePath();
	}
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;	
	this.gc.globalAlpha=this.alpha;	
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.SetMatrix=function( ix,iy,jx,jy,tx,ty ){
	this.ix=ix;this.iy=iy;
	this.jx=jx;this.jy=jy;
	this.tx=tx;this.ty=ty;
	this.gc.setTransform( ix,iy,jx,jy,tx,ty );
	this.tformed=(ix!=1 || iy!=0 || jx!=0 || jy!=1 || tx!=0 || ty!=0);
}

gxtkGraphics.prototype.Cls=function( r,g,b ){
	if( this.tformed ) this.gc.setTransform( 1,0,0,1,0,0 );
	this.gc.fillStyle="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.globalAlpha=1;
	this.gc.globalCompositeOperation="source-over";
	this.gc.fillRect( 0,0,this.canvas.width,this.canvas.height );
	this.gc.fillStyle=this.color;
	this.gc.globalAlpha=this.alpha;
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.DrawPoint=function( x,y ){
	if( this.tformed ){
		var px=x;
		x=px * this.ix + y * this.jx + this.tx;
		y=px * this.iy + y * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
		this.gc.fillRect( x,y,1,1 );
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
		this.gc.fillRect( x,y,1,1 );
	}
}

gxtkGraphics.prototype.DrawRect=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
	this.gc.fillRect( x,y,w,h );
}

gxtkGraphics.prototype.DrawLine=function( x1,y1,x2,y2 ){
	if( this.tformed ){
		var x1_t=x1 * this.ix + y1 * this.jx + this.tx;
		var y1_t=x1 * this.iy + y1 * this.jy + this.ty;
		var x2_t=x2 * this.ix + y2 * this.jx + this.tx;
		var y2_t=x2 * this.iy + y2 * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1_t,y1_t );
	  	this.gc.lineTo( x2_t,y2_t );
	  	this.gc.stroke();
	  	this.gc.closePath();
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1,y1 );
	  	this.gc.lineTo( x2,y2 );
	  	this.gc.stroke();
	  	this.gc.closePath();
	}
}

gxtkGraphics.prototype.DrawOval=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
  	var w2=w/2,h2=h/2;
	this.gc.save();
	this.gc.translate( x+w2,y+h2 );
	this.gc.scale( w2,h2 );
  	this.gc.beginPath();
	this.gc.arc( 0,0,1,0,Math.PI*2,false );
	this.gc.fill();
  	this.gc.closePath();
	this.gc.restore();
}

gxtkGraphics.prototype.DrawPoly=function( verts ){
	if( verts.length<2 ) return;
	this.gc.beginPath();
	this.gc.moveTo( verts[0],verts[1] );
	for( var i=2;i<verts.length;i+=2 ){
		this.gc.lineTo( verts[i],verts[i+1] );
	}
	this.gc.fill();
	this.gc.closePath();
}

gxtkGraphics.prototype.DrawPoly2=function( verts,surface,srx,srcy ){
	if( verts.length<4 ) return;
	this.gc.beginPath();
	this.gc.moveTo( verts[0],verts[1] );
	for( var i=4;i<verts.length;i+=4 ){
		this.gc.lineTo( verts[i],verts[i+1] );
	}
	this.gc.fill();
	this.gc.closePath();
}

gxtkGraphics.prototype.DrawSurface=function( surface,x,y ){
	if( !surface.image.complete ) return;
	
	if( this.white ){
		this.gc.drawImage( surface.image,x,y );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,0,0,surface.swidth,surface.sheight );
}

gxtkGraphics.prototype.DrawSurface2=function( surface,x,y,srcx,srcy,srcw,srch ){
	if( !surface.image.complete ) return;

	if( srcw<0 ){ srcx+=srcw;srcw=-srcw; }
	if( srch<0 ){ srcy+=srch;srch=-srch; }
	if( srcw<=0 || srch<=0 ) return;

	if( this.white ){
		this.gc.drawImage( surface.image,srcx,srcy,srcw,srch,x,y,srcw,srch );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,srcx,srcy,srcw,srch  );
}

gxtkGraphics.prototype.DrawImageTinted=function( image,dx,dy,sx,sy,sw,sh ){

	if( !this.tmpCanvas ){
		this.tmpCanvas=document.createElement( "canvas" );
	}

	if( sw>this.tmpCanvas.width || sh>this.tmpCanvas.height ){
		this.tmpCanvas.width=Math.max( sw,this.tmpCanvas.width );
		this.tmpCanvas.height=Math.max( sh,this.tmpCanvas.height );
	}
	
	var tmpGC=this.tmpCanvas.getContext( "2d" );
	tmpGC.globalCompositeOperation="copy";
	
	tmpGC.drawImage( image,sx,sy,sw,sh,0,0,sw,sh );
	
	var imgData=tmpGC.getImageData( 0,0,sw,sh );
	
	var p=imgData.data,sz=sw*sh*4,i;
	
	for( i=0;i<sz;i+=4 ){
		p[i]=p[i]*this.r/255;
		p[i+1]=p[i+1]*this.g/255;
		p[i+2]=p[i+2]*this.b/255;
	}
	
	tmpGC.putImageData( imgData,0,0 );
	
	this.gc.drawImage( this.tmpCanvas,0,0,sw,sh,dx,dy,sw,sh );
}

gxtkGraphics.prototype.ReadPixels=function( pixels,x,y,width,height,offset,pitch ){

	var imgData=this.gc.getImageData( x,y,width,height );
	
	var p=imgData.data,i=0,j=offset,px,py;
	
	for( py=0;py<height;++py ){
		for( px=0;px<width;++px ){
			pixels[j++]=(p[i+3]<<24)|(p[i]<<16)|(p[i+1]<<8)|p[i+2];
			i+=4;
		}
		j+=pitch-width;
	}
}

gxtkGraphics.prototype.WritePixels2=function( surface,pixels,x,y,width,height,offset,pitch ){

	if( !surface.gc ){
		if( !surface.image.complete ) return;
		var canvas=document.createElement( "canvas" );
		canvas.width=surface.swidth;
		canvas.height=surface.sheight;
		surface.gc=canvas.getContext( "2d" );
		surface.gc.globalCompositeOperation="copy";
		surface.gc.drawImage( surface.image,0,0 );
		surface.image=canvas;
	}

	var imgData=surface.gc.createImageData( width,height );

	var p=imgData.data,i=0,j=offset,px,py,argb;
	
	for( py=0;py<height;++py ){
		for( px=0;px<width;++px ){
			argb=pixels[j++];
			p[i]=(argb>>16) & 0xff;
			p[i+1]=(argb>>8) & 0xff;
			p[i+2]=argb & 0xff;
			p[i+3]=(argb>>24) & 0xff;
			i+=4;
		}
		j+=pitch-width;
	}
	
	surface.gc.putImageData( imgData,x,y );
}

//***** gxtkSurface class *****

function gxtkSurface( image,graphics ){
	this.image=image;
	this.graphics=graphics;
	this.swidth=image.meta_width;
	this.sheight=image.meta_height;
}

//***** GXTK API *****

gxtkSurface.prototype.Discard=function(){
	if( this.image ){
		this.image=null;
	}
}

gxtkSurface.prototype.Width=function(){
	return this.swidth;
}

gxtkSurface.prototype.Height=function(){
	return this.sheight;
}

gxtkSurface.prototype.Loaded=function(){
	return this.image.complete;
}

gxtkSurface.prototype.OnUnsafeLoadComplete=function(){
	return true;
}

//***** gxtkChannel class *****
function gxtkChannel(){
	this.sample=null;
	this.audio=null;
	this.volume=1;
	this.pan=0;
	this.rate=1;
	this.flags=0;
	this.state=0;
}

//***** gxtkAudio class *****
function gxtkAudio(){
	this.game=BBHtml5Game.Html5Game();
	this.okay=typeof(Audio)!="undefined";
	this.music=null;
	this.channels=new Array(33);
	for( var i=0;i<33;++i ){
		this.channels[i]=new gxtkChannel();
		if( !this.okay ) this.channels[i].state=-1;
	}
}

gxtkAudio.prototype.Suspend=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.state==1 ) chan.audio.pause();
	}
}

gxtkAudio.prototype.Resume=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.state==1 ) chan.audio.play();
	}
}

gxtkAudio.prototype.LoadSample=function( path ){
	if( !this.okay ) return null;

	var audio=new Audio( this.game.PathToUrl( path ) );
	if( !audio ) return null;
	
	return new gxtkSample( audio );
}

gxtkAudio.prototype.PlaySample=function( sample,channel,flags ){
	if( !this.okay ) return;
	
	var chan=this.channels[channel];

	if( chan.state>0 ){
		chan.audio.pause();
		chan.state=0;
	}
	
	for( var i=0;i<33;++i ){
		var chan2=this.channels[i];
		if( chan2.state==1 && chan2.audio.ended && !chan2.audio.loop ) chan.state=0;
		if( chan2.state==0 && chan2.sample ){
			chan2.sample.FreeAudio( chan2.audio );
			chan2.sample=null;
			chan2.audio=null;
		}
	}

	var audio=sample.AllocAudio();
	if( !audio ) return;

	audio.loop=(flags&1)!=0;
	audio.volume=chan.volume;
	audio.play();

	chan.sample=sample;
	chan.audio=audio;
	chan.flags=flags;
	chan.state=1;
}

gxtkAudio.prototype.StopChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state>0 ){
		chan.audio.pause();
		chan.state=0;
	}
}

gxtkAudio.prototype.PauseChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state==1 ){
		if( chan.audio.ended && !chan.audio.loop ){
			chan.state=0;
		}else{
			chan.audio.pause();
			chan.state=2;
		}
	}
}

gxtkAudio.prototype.ResumeChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state==2 ){
		chan.audio.play();
		chan.state=1;
	}
}

gxtkAudio.prototype.ChannelState=function( channel ){
	var chan=this.channels[channel];
	if( chan.state==1 && chan.audio.ended && !chan.audio.loop ) chan.state=0;
	return chan.state;
}

gxtkAudio.prototype.SetVolume=function( channel,volume ){
	var chan=this.channels[channel];
	if( chan.state>0 ) chan.audio.volume=volume;
	chan.volume=volume;
}

gxtkAudio.prototype.SetPan=function( channel,pan ){
	var chan=this.channels[channel];
	chan.pan=pan;
}

gxtkAudio.prototype.SetRate=function( channel,rate ){
	var chan=this.channels[channel];
	chan.rate=rate;
}

gxtkAudio.prototype.PlayMusic=function( path,flags ){
	this.StopMusic();
	
	this.music=this.LoadSample( path );
	if( !this.music ) return;
	
	this.PlaySample( this.music,32,flags );
}

gxtkAudio.prototype.StopMusic=function(){
	this.StopChannel( 32 );

	if( this.music ){
		this.music.Discard();
		this.music=null;
	}
}

gxtkAudio.prototype.PauseMusic=function(){
	this.PauseChannel( 32 );
}

gxtkAudio.prototype.ResumeMusic=function(){
	this.ResumeChannel( 32 );
}

gxtkAudio.prototype.MusicState=function(){
	return this.ChannelState( 32 );
}

gxtkAudio.prototype.SetMusicVolume=function( volume ){
	this.SetVolume( 32,volume );
}

//***** gxtkSample class *****

function gxtkSample( audio ){
	this.audio=audio;
	this.free=new Array();
	this.insts=new Array();
}

gxtkSample.prototype.FreeAudio=function( audio ){
	this.free.push( audio );
}

gxtkSample.prototype.AllocAudio=function(){
	var audio;
	while( this.free.length ){
		audio=this.free.pop();
		try{
			audio.currentTime=0;
			return audio;
		}catch( ex ){
			print( "AUDIO ERROR1!" );
		}
	}
	
	//Max out?
	if( this.insts.length==8 ) return null;
	
	audio=new Audio( this.audio.src );
	
	//yucky loop handler for firefox!
	//
	audio.addEventListener( 'ended',function(){
		if( this.loop ){
			try{
				this.currentTime=0;
				this.play();
			}catch( ex ){
				print( "AUDIO ERROR2!" );
			}
		}
	},false );

	this.insts.push( audio );
	return audio;
}

gxtkSample.prototype.Discard=function(){
}

function BBThread(){
	this.running=false;
}

BBThread.prototype.Start=function(){
	this.running=true;
	this.Run__UNSAFE__();
}

BBThread.prototype.IsRunning=function(){
	return this.running;
}

BBThread.prototype.Run__UNSAFE__=function(){
	this.running=false;
}

function BBAsyncImageLoaderThread(){
	BBThread.call(this);
}

BBAsyncImageLoaderThread.prototype=extend_class( BBThread );

BBAsyncImageLoaderThread.prototype.Start=function(){

	var thread=this;

	var image=new Image();
	
	image.onload=function( e ){
		image.meta_width=image.width;
		image.meta_height=image.height;
		thread._surface=new gxtkSurface( image,thread._device )
		thread.running=false;
	}
	
	image.onerror=function( e ){
		thread._surface=null;
		thread.running=false;
	}
	
	thread.running=true;
	
	image.src=BBGame.Game().PathToUrl( thread._path );
}


function BBAsyncSoundLoaderThread(){
	BBThread.call(this);
}

BBAsyncSoundLoaderThread.prototype=extend_class( BBThread );

BBAsyncSoundLoaderThread.prototype.Start=function(){
	this._sample=this._device.LoadSample( this._path );
}

var fantomengine = new Object();

fantomengine.DeviceName=function(){
	return "";
};

fantomengine.Hardware=function(){
	return "";
};

fantomengine.Product=function(){
	return "";
};

fantomengine.Serial=function(){
	return "";
};

fantomengine.User=function(){
	return "";
};



fantomengine.GetBrowserName=function(){
//Based on code from here: h t t p://stackoverflow.com/questions/2400935/browser-detection-in-javascript
	var ret = "";
	if (navigator.userAgent.search("MSIE") >= 0){
	    ret = "MS Internet Explorer";
	}
	else if (navigator.userAgent.search("Chrome") >= 0){
	    ret = "Google Chrome";
	}
	else if (navigator.userAgent.search("Firefox") >= 0){
		ret = "Mozilla Firefox";
	}
	else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0){
	    ret = "Apple Safari";
	}
	else if (navigator.userAgent.search("Opera") >= 0){
	    ret = "Opera";
	}
	else{
	    ret = "Other";
	}


	return ret;
};

fantomengine.GetBrowserVersion=function(){
	var ret = "";
	if (navigator.userAgent.search("MSIE") >= 0){
	    var position = navigator.userAgent.search("MSIE") + 5;
	    var end = navigator.userAgent.search("; Windows");
	    var version = navigator.userAgent.substring(position,end);
	    ret = version;
	}
	else if (navigator.userAgent.search("Chrome") >= 0){
	    var position = navigator.userAgent.search("Chrome") + 7;
	    var end = navigator.userAgent.search(" Safari");
	    var version = navigator.userAgent.substring(position,end);
	    ret = version;
	}
	else if (navigator.userAgent.search("Firefox") >= 0){
	    var position = navigator.userAgent.search("Firefox") + 8;
	    var version = navigator.userAgent.substring(position);
	    ret = version;
	}
	else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0){//<< Here
	    var position = navigator.userAgent.search("Version") + 8;
	    var end = navigator.userAgent.search(" Safari");
	    var version = navigator.userAgent.substring(position,end);
	    ret = version;
	}
	else if (navigator.userAgent.search("Opera") >= 0){
	    var position = navigator.userAgent.search("Version") + 8;
	    var version = navigator.userAgent.substring(position);
	    ret = version;
	}
	else{
	    ret = "";
	}
	return ret;
};

fantomengine.GetBrowserPlatform=function(){
	return navigator.platform;
};

fantomengine.MaximizeCanvas=function(){
	var canvas = document.getElementById("GameCanvas");
	if (canvas)
	{
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.ontouchmove = function(ev){  
                 // we don't want to have the default iphone scrolling behaviour ontouchmove  
                 ev.preventDefault();  
             };	
	}
	var console = document.getElementById("GameConsole");
	if (console)
	{
		console.style.width = "0px";
		console.style.height = "0px";
	}
};
function c_App(){
	Object.call(this);
}
c_App.m_new=function(){
	if((bb_app__app)!=null){
		error("App has already been created");
	}
	bb_app__app=this;
	bb_app__delegate=c_GameDelegate.m_new.call(new c_GameDelegate);
	bb_app__game.SetDelegate(bb_app__delegate);
	return this;
}
c_App.prototype.p_OnCreate=function(){
	return 0;
}
c_App.prototype.p_OnSuspend=function(){
	return 0;
}
c_App.prototype.p_OnResume=function(){
	return 0;
}
c_App.prototype.p_OnUpdate=function(){
	return 0;
}
c_App.prototype.p_OnLoading=function(){
	return 0;
}
c_App.prototype.p_OnRender=function(){
	return 0;
}
c_App.prototype.p_OnClose=function(){
	bb_app_EndApp();
	return 0;
}
c_App.prototype.p_OnBack=function(){
	this.p_OnClose();
	return 0;
}
function c_game(){
	c_App.call(this);
	this.m_eng=null;
	this.m_atlas=null;
	this.m_layerBackground=null;
	this.m_layerGame=null;
	this.m_layerFX=null;
	this.m_layerUI=null;
	this.m_layerTitle=null;
	this.m_layerScore=null;
	this.m_player=null;
	this.m_shield=null;
	this.m_sndExplo=null;
	this.m_sndShot=null;
	this.m_font1=null;
	this.m_score=0;
	this.m_txtScore=null;
	this.m_levelNumber=0;
	this.m_txtLevel=null;
	this.m_cometCount=0;
	this.m_txtComets=null;
	this.m_lives=0;
	this.m_txtLives=null;
	this.m_txtHighScores=new_object_array(10);
	this.m_gameMode=1;
	this.m_lastTime=0;
	this.m_deltaTime=0;
	this.m_obj=null;
}
c_game.prototype=extend_class(c_App);
c_game.m_new=function(){
	c_App.m_new.call(this);
	return this;
}
c_game.prototype.p_CreateLayers=function(){
	this.m_layerBackground=this.m_eng.p_CreateLayer(null);
	this.m_layerGame=this.m_eng.p_CreateLayer(null);
	this.m_layerFX=this.m_eng.p_CreateLayer(null);
	this.m_layerUI=this.m_eng.p_CreateLayer(null);
	this.m_layerTitle=this.m_eng.p_CreateLayer(null);
	this.m_layerScore=this.m_eng.p_CreateLayer(null);
	return 0;
}
c_game.prototype.p_CreateStars=function(t_count){
	for(var t_i=1;t_i<=t_count;t_i=t_i+1){
		var t_star=this.m_eng.p_CreateImage3(this.m_atlas,16,112,16,16,bb_random_Rnd2(0.0,this.m_eng.m_canvasWidth),bb_random_Rnd2(0.0,this.m_eng.m_canvasHeight),null);
		t_star.p_SetScale(bb_random_Rnd2(1.0,3.0)/10.0,0);
		t_star.p_SetAngle(bb_random_Rnd2(0.0,359.0),0);
		t_star.p_SetSpin(5.0,0);
		t_star.p_SetLayer(this.m_layerBackground);
	}
	return 0;
}
c_game.prototype.p_CreatePlayer=function(){
	this.m_player=this.m_eng.p_CreateImage3(this.m_atlas,0,0,32,32,0.0,0.0,null);
	this.m_player.p_SetFriction(0.2,0);
	this.m_player.p_SetMaxSpeed(20.0);
	this.m_player.p_SetWrapScreen(true);
	this.m_player.p_SetLayer(this.m_layerGame);
	this.m_player.p_SetColGroup(3);
	this.m_player.p_SetColWith2(2,1);
	this.m_player.p_SetColWith2(10,1);
	this.m_player.p_SetRadius(12.0,0);
	this.m_player.p_SetActive(false);
	this.m_shield=this.m_eng.p_CreateImage3(this.m_atlas,32,96,32,32,0.0,0.0,null);
	this.m_shield.p_SetScale(2.0,0);
	this.m_shield.p_SetSpin(15.0,0);
	this.m_shield.p_SetLayer(this.m_layerGame);
	this.m_shield.p_SetParent(this.m_player);
	this.m_shield.p_SetColGroup(6);
	this.m_shield.p_SetColWith2(2,1);
	this.m_shield.p_SetRadius(13.0,0);
	this.m_shield.p_SetActive(false);
	return 0;
}
c_game.prototype.p_LoadSounds=function(){
	this.m_sndExplo=this.m_eng.p_LoadSound("explosion",false);
	this.m_sndShot=this.m_eng.p_LoadSound("shoot1",false);
	return 0;
}
c_game.prototype.p_CreateInfoText=function(){
	this.m_txtScore=this.m_eng.p_CreateText(this.m_font1,"Score:    "+String(this.m_score),0.0,0.0,0);
	this.m_txtScore.p_SetLayer(this.m_layerUI);
	this.m_txtLevel=this.m_eng.p_CreateText(this.m_font1,"Level:    "+String(this.m_levelNumber),this.m_eng.m_canvasWidth-5.0,0.0,2);
	this.m_txtLevel.p_SetLayer(this.m_layerUI);
	this.m_txtComets=this.m_eng.p_CreateText(this.m_font1,"Comets:    "+String(this.m_cometCount),0.0,this.m_eng.m_canvasHeight-(this.m_font1.m_lineHeight),0);
	this.m_txtComets.p_SetLayer(this.m_layerUI);
	this.m_txtLives=this.m_eng.p_CreateText(this.m_font1,"Lives:    "+String(this.m_lives),this.m_eng.m_canvasWidth-5.0,this.m_eng.m_canvasHeight-(this.m_font1.m_lineHeight),2);
	this.m_txtLives.p_SetLayer(this.m_layerUI);
	return 0;
}
c_game.prototype.p_CreateTitleScreen=function(){
	var t_txtTitle=this.m_eng.p_CreateText(this.m_font1,"RockSmash",this.m_eng.m_canvasWidth/2.0,this.m_eng.m_canvasHeight/2.0-40.0,1);
	t_txtTitle.p_SetLayer(this.m_layerTitle);
	var t_txtTitle2=this.m_eng.p_CreateText(this.m_font1,"*** Press 'P' to play ***",this.m_eng.m_canvasWidth/2.0,this.m_eng.m_canvasHeight/2.0+10.0,1);
	t_txtTitle2.p_SetLayer(this.m_layerTitle);
	var t_txtTitle3=this.m_eng.p_CreateText(this.m_font1,"*** Press 'H' to see the highscore list ***",this.m_eng.m_canvasWidth/2.0,this.m_eng.m_canvasHeight/2.0+40.0,1);
	t_txtTitle3.p_SetLayer(this.m_layerTitle);
	return 0;
}
c_game.prototype.p_CreateHighScoreList=function(){
	var t_txtTitleHightScore=this.m_eng.p_CreateText(this.m_font1,"H I G H S C O R E S",this.m_eng.m_canvasWidth/2.0,70.0,1);
	t_txtTitleHightScore.p_SetLayer(this.m_layerScore);
	for(var t_y=1;t_y<=10;t_y=t_y+1){
		var t_txtScoreNum=this.m_eng.p_CreateText(this.m_font1,"#"+String(t_y),this.m_eng.m_canvasWidth/4.0+50.0,80.0+this.m_eng.m_canvasHeight/20.0*(t_y),0);
		t_txtScoreNum.p_SetLayer(this.m_layerScore);
		this.m_txtHighScores[t_y-1]=this.m_eng.p_CreateText(this.m_font1,"0000000",this.m_eng.m_canvasWidth/4.0*3.0-50.0,80.0+this.m_eng.m_canvasHeight/20.0*(t_y),2);
		this.m_txtHighScores[t_y-1].p_SetLayer(this.m_layerScore);
	}
	this.m_layerScore.p_SetActive(false);
	return 0;
}
c_game.prototype.p_OnCreate=function(){
	bb_app_SetUpdateRate(60);
	this.m_eng=c_engine.m_new.call(new c_engine);
	this.m_atlas=bb_graphics_LoadImage("cctiles.png",1,c_Image.m_DefaultFlags);
	this.p_CreateLayers();
	this.p_CreateStars(60);
	this.p_CreatePlayer();
	this.p_LoadSounds();
	this.m_font1=this.m_eng.p_LoadFont("cc_font");
	this.p_CreateInfoText();
	this.p_CreateTitleScreen();
	this.p_CreateHighScoreList();
	return 0;
}
c_game.prototype.p_PauseGame=function(){
	this.m_gameMode=5;
	return 0;
}
c_game.prototype.p_UpdateGameTime=function(){
	if(this.m_gameMode==2){
		this.m_deltaTime=bb_app_Millisecs()-this.m_lastTime;
		this.m_lastTime+=this.m_deltaTime;
		return this.m_deltaTime;
	}
	return 0;
}
c_game.prototype.p_UpdateInfoText=function(){
	this.m_txtScore.p_SetText("Score:   "+String(this.m_score));
	this.m_txtComets.p_SetText("Comets:  "+String(this.m_cometCount));
	this.m_txtLevel.p_SetText("Level:   "+String(this.m_levelNumber));
	this.m_txtLives.p_SetText("Lives:   "+String(this.m_lives));
	return 0;
}
c_game.prototype.p_ActivateShield=function(){
	this.m_eng.p_CreateObjTimer(bb_RockSmash_g.m_shield,3,4500,0);
	bb_RockSmash_g.m_player.p_SetColGroup(0);
	bb_RockSmash_g.m_shield.p_SetActive(true);
	return 0;
}
c_game.prototype.p_CreateComet=function(t_k,t_xp,t_yp,t_speed,t_speedAngle){
	var t_com=null;
	if(t_k==1){
		t_com=this.m_eng.p_CreateImage3(this.m_atlas,0,32,16,16,t_xp,t_yp,null);
		t_com.p_SetRadius(4.0,0);
	}
	if(t_k==2){
		t_com=this.m_eng.p_CreateImage3(this.m_atlas,32,0,32,32,t_xp,t_yp,null);
		t_com.p_SetRadius(12.0,0);
	}
	if(t_k==3){
		var t_imgRnd=((bb_random_Rnd2(0.0,99.0))|0);
		if(t_imgRnd>49){
			t_com=this.m_eng.p_CreateImage3(this.m_atlas,64,0,64,64,t_xp,t_yp,null);
		}else{
			t_com=this.m_eng.p_CreateImage3(this.m_atlas,64,64,64,64,t_xp,t_yp,null);
		}
		t_com.p_SetRadius(24.0,0);
	}
	t_com.p_SetSpeed(t_speed,t_speedAngle);
	t_com.p_SetAngle(bb_random_Rnd2(0.0,359.0),0);
	t_com.p_SetSpin(bb_random_Rnd2(-5.0,5.0),0);
	t_com.p_SetTag(t_k);
	t_com.p_SetWrapScreen(true);
	t_com.p_SetLayer(this.m_layerGame);
	t_com.p_SetColGroup(2);
	t_com.p_SetID(2);
	this.m_cometCount+=1;
	return t_com;
}
c_game.prototype.p_SpawnComets=function(t_ccount){
	for(var t_i=1;t_i<=t_ccount;t_i=t_i+1){
		this.m_obj=this.p_CreateComet(3,bb_random_Rnd2(64.0,this.m_eng.m_canvasWidth-64.0),bb_random_Rnd2(64.0,this.m_eng.m_canvasHeight-64.0),bb_random_Rnd2(1.0,(this.m_levelNumber+4))/2.0,bb_random_Rnd2(0.0,359.0));
	}
	return 0;
}
c_game.prototype.p_StartNewGame=function(){
	this.m_cometCount=0;
	this.m_lives=3;
	this.m_score=0;
	this.m_levelNumber=1;
	this.m_layerTitle.p_SetActive(false);
	this.m_layerScore.p_SetActive(false);
	this.m_player.p_SetPos(this.m_eng.m_canvasWidth/2.0,this.m_eng.m_canvasHeight/2.0,0);
	this.m_player.p_SetAngle(0.0,0);
	this.m_player.p_SetSpeed(0.0,9876.5);
	this.m_player.p_SetActive(true);
	this.p_ActivateShield();
	this.p_SpawnComets(5);
	this.m_eng.p_CreateObjTimer(this.m_obj,4,((1000.0+bb_random_Rnd2(0.0,10000.0))|0),0);
	this.m_gameMode=2;
	return 0;
}
c_game.prototype.p_LoadHighScore=function(){
	var t_state=bb_app_LoadState();
	if((t_state).length!=0){
		this.m_eng.m_scoreList.p_LoadFromString(t_state);
	}
	return 0;
}
c_game.prototype.p_ShowScoreList=function(){
	this.p_LoadHighScore();
	for(var t_y=1;t_y<=this.m_eng.m_scoreList.p_Count();t_y=t_y+1){
		this.m_txtHighScores[t_y-1].p_SetText(String(this.m_eng.m_scoreList.p_GetValue(t_y)));
	}
	this.m_layerScore.p_SetActive(true);
	this.m_layerTitle.p_SetActive(false);
	return 0;
}
c_game.prototype.p_OnUpdate=function(){
	var t_1=this.m_gameMode;
	if(t_1==2){
		if((bb_input_KeyHit(80))!=0){
			this.p_PauseGame();
		}else{
			this.m_eng.p_Update((this.p_UpdateGameTime())/60.0);
			this.m_eng.p_CollisionCheck2(this.m_layerGame);
			this.p_UpdateInfoText();
		}
	}else{
		if(t_1==1 || t_1==3){
			if((bb_input_KeyHit(80))!=0){
				this.p_StartNewGame();
			}
			if((bb_input_KeyHit(72))!=0){
				this.p_ShowScoreList();
			}
		}else{
			if(t_1==4){
				if((bb_input_KeyHit(80))!=0){
					this.p_StartNewGame();
				}
			}else{
				if(t_1==5){
					if((bb_input_KeyHit(80))!=0){
						this.m_eng.p_Update(0.0);
						this.m_gameMode=2;
					}
				}
			}
		}
	}
	return 0;
}
c_game.prototype.p_OnRender=function(){
	bb_graphics_Cls(0.0,0.0,0.0);
	this.m_eng.p_Render();
	return 0;
}
c_game.prototype.p_SpawnExplosion=function(t_c,t_xp,t_yp){
	for(var t_i=1;t_i<=t_c;t_i=t_i+1){
		var t_explo=this.m_eng.p_CreateImage3(this.m_atlas,0,112,16,16,t_xp,t_yp,null);
		t_explo.p_SetScale(bb_random_Rnd2(3.0,15.0)/10.0,0);
		t_explo.p_SetAngle(bb_random_Rnd2(0.0,359.0),0);
		t_explo.p_SetSpin(bb_random_Rnd2(-4.0,4.0),0);
		t_explo.p_SetSpeed(bb_random_Rnd2(1.0,2.0),9876.5);
		t_explo.p_SetLayer(this.m_layerFX);
		this.m_eng.p_CreateObjTimer(t_explo,2,((bb_random_Rnd2(100.0,2000.0))|0),0);
	}
	this.m_sndExplo.p_Play(-1);
	return 0;
}
c_game.prototype.p_SpawnPlayerEngine=function(){
	var t_d=this.m_player.p_GetVector(20.0,180.0+this.m_player.m_angle,false);
	this.m_obj=this.m_eng.p_CreateImage3(this.m_atlas,16,96,16,16,t_d[0],t_d[1],null);
	this.m_obj.p_SetAngle(this.m_player.m_angle,0);
	this.m_obj.p_SetScale(0.5,0);
	this.m_obj.p_SetLayer(this.m_layerFX);
	this.m_eng.p_CreateObjTimer(this.m_obj,2,100,0);
	return 0;
}
c_game.prototype.p_SpawnPlayerShot=function(){
	var t_ds=this.m_player.p_GetVector(20.0,this.m_player.m_angle,false);
	var t_sht=this.m_eng.p_CreateImage3(this.m_atlas,0,96,16,16,t_ds[0],t_ds[1],null);
	t_sht.p_SetAngle(this.m_player.m_angle,0);
	t_sht.p_SetMaxSpeed(25.0);
	t_sht.p_SetSpeed(this.m_player.m_speed+10.0,9876.5);
	t_sht.p_SetLayer(this.m_layerGame);
	t_sht.p_SetWrapScreen(true);
	this.m_eng.p_CreateObjTimer(t_sht,2,2100,0);
	t_sht.p_SetColGroup(1);
	t_sht.p_SetColWith2(2,1);
	t_sht.p_SetRadius(3.0,0);
	this.m_sndShot.p_Play(-1);
	return 0;
}
c_game.prototype.p_SaveHighScore=function(){
	var t_hs=bb_RockSmash_g.m_eng.m_scoreList.p_SaveToString();
	bb_app_SaveState(t_hs);
	return 0;
}
var bb_app__app=null;
function c_GameDelegate(){
	BBGameDelegate.call(this);
	this.m__graphics=null;
	this.m__audio=null;
	this.m__input=null;
}
c_GameDelegate.prototype=extend_class(BBGameDelegate);
c_GameDelegate.m_new=function(){
	return this;
}
c_GameDelegate.prototype.StartGame=function(){
	this.m__graphics=(new gxtkGraphics);
	bb_graphics_SetGraphicsDevice(this.m__graphics);
	bb_graphics_SetFont(null,32);
	this.m__audio=(new gxtkAudio);
	bb_audio_SetAudioDevice(this.m__audio);
	this.m__input=c_InputDevice.m_new.call(new c_InputDevice);
	bb_input_SetInputDevice(this.m__input);
	bb_app__app.p_OnCreate();
}
c_GameDelegate.prototype.SuspendGame=function(){
	bb_app__app.p_OnSuspend();
	this.m__audio.Suspend();
}
c_GameDelegate.prototype.ResumeGame=function(){
	this.m__audio.Resume();
	bb_app__app.p_OnResume();
}
c_GameDelegate.prototype.UpdateGame=function(){
	this.m__input.p_BeginUpdate();
	bb_app__app.p_OnUpdate();
	this.m__input.p_EndUpdate();
}
c_GameDelegate.prototype.RenderGame=function(){
	var t_mode=this.m__graphics.BeginRender();
	if((t_mode)!=0){
		bb_graphics_BeginRender();
	}
	if(t_mode==2){
		bb_app__app.p_OnLoading();
	}else{
		bb_app__app.p_OnRender();
	}
	if((t_mode)!=0){
		bb_graphics_EndRender();
	}
	this.m__graphics.EndRender();
}
c_GameDelegate.prototype.KeyEvent=function(t_event,t_data){
	this.m__input.p_KeyEvent(t_event,t_data);
	if(t_event!=1){
		return;
	}
	var t_1=t_data;
	if(t_1==432){
		bb_app__app.p_OnClose();
	}else{
		if(t_1==416){
			bb_app__app.p_OnBack();
		}
	}
}
c_GameDelegate.prototype.MouseEvent=function(t_event,t_data,t_x,t_y){
	this.m__input.p_MouseEvent(t_event,t_data,t_x,t_y);
}
c_GameDelegate.prototype.TouchEvent=function(t_event,t_data,t_x,t_y){
	this.m__input.p_TouchEvent(t_event,t_data,t_x,t_y);
}
c_GameDelegate.prototype.MotionEvent=function(t_event,t_data,t_x,t_y,t_z){
	this.m__input.p_MotionEvent(t_event,t_data,t_x,t_y,t_z);
}
c_GameDelegate.prototype.DiscardGraphics=function(){
	this.m__graphics.DiscardGraphics();
}
var bb_app__delegate=null;
var bb_app__game=null;
var bb_RockSmash_g=null;
function bbMain(){
	bb_RockSmash_g=c_game.m_new.call(new c_game);
	return 0;
}
var bb_graphics_device=null;
function bb_graphics_SetGraphicsDevice(t_dev){
	bb_graphics_device=t_dev;
	return 0;
}
function c_Image(){
	Object.call(this);
	this.m_surface=null;
	this.m_width=0;
	this.m_height=0;
	this.m_frames=[];
	this.m_flags=0;
	this.m_tx=.0;
	this.m_ty=.0;
	this.m_source=null;
}
c_Image.m_DefaultFlags=0;
c_Image.m_new=function(){
	return this;
}
c_Image.prototype.p_SetHandle=function(t_tx,t_ty){
	this.m_tx=t_tx;
	this.m_ty=t_ty;
	this.m_flags=this.m_flags&-2;
	return 0;
}
c_Image.prototype.p_ApplyFlags=function(t_iflags){
	this.m_flags=t_iflags;
	if((this.m_flags&2)!=0){
		var t_=this.m_frames;
		var t_2=0;
		while(t_2<t_.length){
			var t_f=t_[t_2];
			t_2=t_2+1;
			t_f.m_x+=1;
		}
		this.m_width-=2;
	}
	if((this.m_flags&4)!=0){
		var t_3=this.m_frames;
		var t_4=0;
		while(t_4<t_3.length){
			var t_f2=t_3[t_4];
			t_4=t_4+1;
			t_f2.m_y+=1;
		}
		this.m_height-=2;
	}
	if((this.m_flags&1)!=0){
		this.p_SetHandle((this.m_width)/2.0,(this.m_height)/2.0);
	}
	if(this.m_frames.length==1 && this.m_frames[0].m_x==0 && this.m_frames[0].m_y==0 && this.m_width==this.m_surface.Width() && this.m_height==this.m_surface.Height()){
		this.m_flags|=65536;
	}
	return 0;
}
c_Image.prototype.p_Init=function(t_surf,t_nframes,t_iflags){
	this.m_surface=t_surf;
	this.m_width=((this.m_surface.Width()/t_nframes)|0);
	this.m_height=this.m_surface.Height();
	this.m_frames=new_object_array(t_nframes);
	for(var t_i=0;t_i<t_nframes;t_i=t_i+1){
		this.m_frames[t_i]=c_Frame.m_new.call(new c_Frame,t_i*this.m_width,0);
	}
	this.p_ApplyFlags(t_iflags);
	return this;
}
c_Image.prototype.p_Grab=function(t_x,t_y,t_iwidth,t_iheight,t_nframes,t_iflags,t_source){
	this.m_source=t_source;
	this.m_surface=t_source.m_surface;
	this.m_width=t_iwidth;
	this.m_height=t_iheight;
	this.m_frames=new_object_array(t_nframes);
	var t_ix=t_x;
	var t_iy=t_y;
	for(var t_i=0;t_i<t_nframes;t_i=t_i+1){
		if(t_ix+this.m_width>t_source.m_width){
			t_ix=0;
			t_iy+=this.m_height;
		}
		if(t_ix+this.m_width>t_source.m_width || t_iy+this.m_height>t_source.m_height){
			error("Image frame outside surface");
		}
		this.m_frames[t_i]=c_Frame.m_new.call(new c_Frame,t_ix+t_source.m_frames[0].m_x,t_iy+t_source.m_frames[0].m_y);
		t_ix+=this.m_width;
	}
	this.p_ApplyFlags(t_iflags);
	return this;
}
c_Image.prototype.p_GrabImage=function(t_x,t_y,t_width,t_height,t_frames,t_flags){
	if(this.m_frames.length!=1){
		return null;
	}
	return (c_Image.m_new.call(new c_Image)).p_Grab(t_x,t_y,t_width,t_height,t_frames,t_flags,this);
}
c_Image.prototype.p_Height=function(){
	return this.m_height;
}
c_Image.prototype.p_Width=function(){
	return this.m_width;
}
c_Image.prototype.p_Frames=function(){
	return this.m_frames.length;
}
function c_GraphicsContext(){
	Object.call(this);
	this.m_defaultFont=null;
	this.m_font=null;
	this.m_firstChar=0;
	this.m_matrixSp=0;
	this.m_ix=1.0;
	this.m_iy=.0;
	this.m_jx=.0;
	this.m_jy=1.0;
	this.m_tx=.0;
	this.m_ty=.0;
	this.m_tformed=0;
	this.m_matDirty=0;
	this.m_color_r=.0;
	this.m_color_g=.0;
	this.m_color_b=.0;
	this.m_alpha=.0;
	this.m_blend=0;
	this.m_scissor_x=.0;
	this.m_scissor_y=.0;
	this.m_scissor_width=.0;
	this.m_scissor_height=.0;
	this.m_matrixStack=new_number_array(192);
}
c_GraphicsContext.m_new=function(){
	return this;
}
c_GraphicsContext.prototype.p_Validate=function(){
	if((this.m_matDirty)!=0){
		bb_graphics_renderDevice.SetMatrix(bb_graphics_context.m_ix,bb_graphics_context.m_iy,bb_graphics_context.m_jx,bb_graphics_context.m_jy,bb_graphics_context.m_tx,bb_graphics_context.m_ty);
		this.m_matDirty=0;
	}
	return 0;
}
var bb_graphics_context=null;
function bb_data_FixDataPath(t_path){
	var t_i=t_path.indexOf(":/",0);
	if(t_i!=-1 && t_path.indexOf("/",0)==t_i+1){
		return t_path;
	}
	if(string_startswith(t_path,"./") || string_startswith(t_path,"/")){
		return t_path;
	}
	return "monkey://data/"+t_path;
}
function c_Frame(){
	Object.call(this);
	this.m_x=0;
	this.m_y=0;
}
c_Frame.m_new=function(t_x,t_y){
	this.m_x=t_x;
	this.m_y=t_y;
	return this;
}
c_Frame.m_new2=function(){
	return this;
}
function bb_graphics_LoadImage(t_path,t_frameCount,t_flags){
	var t_surf=bb_graphics_device.LoadSurface(bb_data_FixDataPath(t_path));
	if((t_surf)!=null){
		return (c_Image.m_new.call(new c_Image)).p_Init(t_surf,t_frameCount,t_flags);
	}
	return null;
}
function bb_graphics_LoadImage2(t_path,t_frameWidth,t_frameHeight,t_frameCount,t_flags){
	var t_atlas=bb_graphics_LoadImage(t_path,1,0);
	if((t_atlas)!=null){
		return t_atlas.p_GrabImage(0,0,t_frameWidth,t_frameHeight,t_frameCount,t_flags);
	}
	return null;
}
function bb_graphics_SetFont(t_font,t_firstChar){
	if(!((t_font)!=null)){
		if(!((bb_graphics_context.m_defaultFont)!=null)){
			bb_graphics_context.m_defaultFont=bb_graphics_LoadImage("mojo_font.png",96,2);
		}
		t_font=bb_graphics_context.m_defaultFont;
		t_firstChar=32;
	}
	bb_graphics_context.m_font=t_font;
	bb_graphics_context.m_firstChar=t_firstChar;
	return 0;
}
var bb_audio_device=null;
function bb_audio_SetAudioDevice(t_dev){
	bb_audio_device=t_dev;
	return 0;
}
function c_InputDevice(){
	Object.call(this);
	this.m__joyStates=new_object_array(4);
	this.m__keyDown=new_bool_array(512);
	this.m__keyHitPut=0;
	this.m__keyHitQueue=new_number_array(33);
	this.m__keyHit=new_number_array(512);
	this.m__charGet=0;
	this.m__charPut=0;
	this.m__charQueue=new_number_array(32);
	this.m__mouseX=.0;
	this.m__mouseY=.0;
	this.m__touchX=new_number_array(32);
	this.m__touchY=new_number_array(32);
	this.m__accelX=.0;
	this.m__accelY=.0;
	this.m__accelZ=.0;
}
c_InputDevice.m_new=function(){
	for(var t_i=0;t_i<4;t_i=t_i+1){
		this.m__joyStates[t_i]=c_JoyState.m_new.call(new c_JoyState);
	}
	return this;
}
c_InputDevice.prototype.p_PutKeyHit=function(t_key){
	if(this.m__keyHitPut==this.m__keyHitQueue.length){
		return;
	}
	this.m__keyHit[t_key]+=1;
	this.m__keyHitQueue[this.m__keyHitPut]=t_key;
	this.m__keyHitPut+=1;
}
c_InputDevice.prototype.p_BeginUpdate=function(){
	for(var t_i=0;t_i<4;t_i=t_i+1){
		var t_state=this.m__joyStates[t_i];
		if(!BBGame.Game().PollJoystick(t_i,t_state.m_joyx,t_state.m_joyy,t_state.m_joyz,t_state.m_buttons)){
			break;
		}
		for(var t_j=0;t_j<32;t_j=t_j+1){
			var t_key=256+t_i*32+t_j;
			if(t_state.m_buttons[t_j]){
				if(!this.m__keyDown[t_key]){
					this.m__keyDown[t_key]=true;
					this.p_PutKeyHit(t_key);
				}
			}else{
				this.m__keyDown[t_key]=false;
			}
		}
	}
}
c_InputDevice.prototype.p_EndUpdate=function(){
	for(var t_i=0;t_i<this.m__keyHitPut;t_i=t_i+1){
		this.m__keyHit[this.m__keyHitQueue[t_i]]=0;
	}
	this.m__keyHitPut=0;
	this.m__charGet=0;
	this.m__charPut=0;
}
c_InputDevice.prototype.p_KeyEvent=function(t_event,t_data){
	var t_1=t_event;
	if(t_1==1){
		if(!this.m__keyDown[t_data]){
			this.m__keyDown[t_data]=true;
			this.p_PutKeyHit(t_data);
			if(t_data==1){
				this.m__keyDown[384]=true;
				this.p_PutKeyHit(384);
			}else{
				if(t_data==384){
					this.m__keyDown[1]=true;
					this.p_PutKeyHit(1);
				}
			}
		}
	}else{
		if(t_1==2){
			if(this.m__keyDown[t_data]){
				this.m__keyDown[t_data]=false;
				if(t_data==1){
					this.m__keyDown[384]=false;
				}else{
					if(t_data==384){
						this.m__keyDown[1]=false;
					}
				}
			}
		}else{
			if(t_1==3){
				if(this.m__charPut<this.m__charQueue.length){
					this.m__charQueue[this.m__charPut]=t_data;
					this.m__charPut+=1;
				}
			}
		}
	}
}
c_InputDevice.prototype.p_MouseEvent=function(t_event,t_data,t_x,t_y){
	var t_2=t_event;
	if(t_2==4){
		this.p_KeyEvent(1,1+t_data);
	}else{
		if(t_2==5){
			this.p_KeyEvent(2,1+t_data);
			return;
		}else{
			if(t_2==6){
			}else{
				return;
			}
		}
	}
	this.m__mouseX=t_x;
	this.m__mouseY=t_y;
	this.m__touchX[0]=t_x;
	this.m__touchY[0]=t_y;
}
c_InputDevice.prototype.p_TouchEvent=function(t_event,t_data,t_x,t_y){
	var t_3=t_event;
	if(t_3==7){
		this.p_KeyEvent(1,384+t_data);
	}else{
		if(t_3==8){
			this.p_KeyEvent(2,384+t_data);
			return;
		}else{
			if(t_3==9){
			}else{
				return;
			}
		}
	}
	this.m__touchX[t_data]=t_x;
	this.m__touchY[t_data]=t_y;
	if(t_data==0){
		this.m__mouseX=t_x;
		this.m__mouseY=t_y;
	}
}
c_InputDevice.prototype.p_MotionEvent=function(t_event,t_data,t_x,t_y,t_z){
	var t_4=t_event;
	if(t_4==10){
	}else{
		return;
	}
	this.m__accelX=t_x;
	this.m__accelY=t_y;
	this.m__accelZ=t_z;
}
c_InputDevice.prototype.p_KeyHit=function(t_key){
	if(t_key>0 && t_key<512){
		return this.m__keyHit[t_key];
	}
	return 0;
}
c_InputDevice.prototype.p_KeyDown=function(t_key){
	if(t_key>0 && t_key<512){
		return this.m__keyDown[t_key];
	}
	return false;
}
function c_JoyState(){
	Object.call(this);
	this.m_joyx=new_number_array(2);
	this.m_joyy=new_number_array(2);
	this.m_joyz=new_number_array(2);
	this.m_buttons=new_bool_array(32);
}
c_JoyState.m_new=function(){
	return this;
}
var bb_input_device=null;
function bb_input_SetInputDevice(t_dev){
	bb_input_device=t_dev;
	return 0;
}
var bb_graphics_renderDevice=null;
function bb_graphics_SetMatrix(t_ix,t_iy,t_jx,t_jy,t_tx,t_ty){
	bb_graphics_context.m_ix=t_ix;
	bb_graphics_context.m_iy=t_iy;
	bb_graphics_context.m_jx=t_jx;
	bb_graphics_context.m_jy=t_jy;
	bb_graphics_context.m_tx=t_tx;
	bb_graphics_context.m_ty=t_ty;
	bb_graphics_context.m_tformed=((t_ix!=1.0 || t_iy!=0.0 || t_jx!=0.0 || t_jy!=1.0 || t_tx!=0.0 || t_ty!=0.0)?1:0);
	bb_graphics_context.m_matDirty=1;
	return 0;
}
function bb_graphics_SetMatrix2(t_m){
	bb_graphics_SetMatrix(t_m[0],t_m[1],t_m[2],t_m[3],t_m[4],t_m[5]);
	return 0;
}
function bb_graphics_SetColor(t_r,t_g,t_b){
	bb_graphics_context.m_color_r=t_r;
	bb_graphics_context.m_color_g=t_g;
	bb_graphics_context.m_color_b=t_b;
	bb_graphics_renderDevice.SetColor(t_r,t_g,t_b);
	return 0;
}
function bb_graphics_SetAlpha(t_alpha){
	bb_graphics_context.m_alpha=t_alpha;
	bb_graphics_renderDevice.SetAlpha(t_alpha);
	return 0;
}
function bb_graphics_SetBlend(t_blend){
	bb_graphics_context.m_blend=t_blend;
	bb_graphics_renderDevice.SetBlend(t_blend);
	return 0;
}
function bb_graphics_DeviceWidth(){
	return bb_graphics_device.Width();
}
function bb_graphics_DeviceHeight(){
	return bb_graphics_device.Height();
}
function bb_graphics_SetScissor(t_x,t_y,t_width,t_height){
	bb_graphics_context.m_scissor_x=t_x;
	bb_graphics_context.m_scissor_y=t_y;
	bb_graphics_context.m_scissor_width=t_width;
	bb_graphics_context.m_scissor_height=t_height;
	bb_graphics_renderDevice.SetScissor(((t_x)|0),((t_y)|0),((t_width)|0),((t_height)|0));
	return 0;
}
function bb_graphics_BeginRender(){
	bb_graphics_renderDevice=bb_graphics_device;
	bb_graphics_context.m_matrixSp=0;
	bb_graphics_SetMatrix(1.0,0.0,0.0,1.0,0.0,0.0);
	bb_graphics_SetColor(255.0,255.0,255.0);
	bb_graphics_SetAlpha(1.0);
	bb_graphics_SetBlend(0);
	bb_graphics_SetScissor(0.0,0.0,(bb_graphics_DeviceWidth()),(bb_graphics_DeviceHeight()));
	return 0;
}
function bb_graphics_EndRender(){
	bb_graphics_renderDevice=null;
	return 0;
}
function c_BBGameEvent(){
	Object.call(this);
}
function bb_app_EndApp(){
	error("");
	return 0;
}
var bb_app__updateRate=0;
function bb_app_SetUpdateRate(t_hertz){
	bb_app__updateRate=t_hertz;
	bb_app__game.SetUpdateRate(t_hertz);
	return 0;
}
function c_ftEngine(){
	Object.call(this);
	this.m_defaultLayer=null;
	this.m_layerList=c_List2.m_new.call(new c_List2);
	this.m_defaultScene=null;
	this.m_sceneList=c_List3.m_new.call(new c_List3);
	this.m_screenWidth=.0;
	this.m_screenHeight=.0;
	this.m_canvasWidth=.0;
	this.m_canvasHeight=.0;
	this.m_lastMillisecs=bb_app_Millisecs();
	this.m_timeScale=1.0;
	this.m_engineTime=0.0;
	this.m_time=0;
	this.m_lastTime=0;
	this.m_swiper=null;
	this.m_imgMng=null;
	this.m_defaultActive=true;
	this.m_defaultVisible=true;
	this.m_soundList=c_List5.m_new.call(new c_List5);
	this.m_fontList=c_List6.m_new.call(new c_List6);
	this.m_timerList=c_List7.m_new.call(new c_List7);
	this.m_isPaused=false;
	this.m_delta=1.0;
	this.m_scoreList=c_ftHighScoreList.m_new.call(new c_ftHighScoreList);
	this.m_red=255.0;
	this.m_green=255.0;
	this.m_blue=255.0;
	this.m_autofitX=0;
	this.m_autofitY=0;
	this.m_scaleX=1.0;
	this.m_scaleY=1.0;
	this.m_lastLayerAngle=0.0;
	this.m_lastLayerScale=1.0;
	this.m_alpha=1.0;
	this.m_blendMode=0;
	this.m_camX=0.0;
	this.m_camY=0.0;
	this.m_maxSoundChannel=32;
	this.m_firstSoundChannel=0;
	this.m_nextSoundChannel=99;
	this.m_volumeSFX=1.0;
	this.m_volumeMUS=1.0;
}
c_ftEngine.prototype.p_GetTime=function(){
	var t_newMilliSecs=bb_app_Millisecs();
	this.m_engineTime+=(t_newMilliSecs-this.m_lastMillisecs)*this.m_timeScale;
	this.m_lastMillisecs=t_newMilliSecs;
	return ((this.m_engineTime)|0);
}
c_ftEngine.m_new=function(){
	this.m_defaultLayer=c_ftLayer.m_new.call(new c_ftLayer);
	this.m_defaultLayer.m_engine=this;
	this.m_layerList.p_AddLast2(this.m_defaultLayer);
	this.m_defaultScene=c_ftScene.m_new.call(new c_ftScene);
	this.m_defaultScene.m_engine=this;
	this.m_sceneList.p_AddLast3(this.m_defaultScene);
	this.m_screenWidth=(bb_graphics_DeviceWidth());
	this.m_screenHeight=(bb_graphics_DeviceHeight());
	this.m_canvasWidth=this.m_screenWidth;
	this.m_canvasHeight=this.m_screenHeight;
	this.m_time=this.p_GetTime();
	this.m_lastTime=this.m_time;
	this.m_swiper=c_ftSwipe.m_new.call(new c_ftSwipe);
	this.m_swiper.m_engine=this;
	this.m_imgMng=c_ftImageManager.m_new.call(new c_ftImageManager);
	this.m_imgMng.m_engine=this;
	return this;
}
c_ftEngine.prototype.p_CreateLayer=function(t__ucla){
	var t_layer=null;
	if(t__ucla==null){
		t_layer=c_ftLayer.m_new.call(new c_ftLayer);
	}else{
		t_layer=object_downcast((t__ucla),c_ftLayer);
	}
	t_layer.m_engine=this;
	t_layer.m_engineNode=this.m_layerList.p_AddLast2(t_layer);
	this.m_defaultScene.p_AddLayer(t_layer);
	return t_layer;
}
c_ftEngine.prototype.p_CreateImage=function(t_filename,t_xpos,t_ypos,t__ucob){
	var t_obj=null;
	if(t__ucob==null){
		t_obj=c_ftObject.m_new.call(new c_ftObject);
	}else{
		t_obj=object_downcast((t__ucob),c_ftObject);
	}
	t_obj.m_engine=this;
	t_obj.m_xPos=t_xpos;
	t_obj.m_yPos=t_ypos;
	t_obj.m_type=0;
	t_obj.m_objImg=this.m_imgMng.p_LoadImage2(t_filename,1,1);
	if(t_obj.m_objImg==null){
		error("Image "+t_filename+" not found!");
	}
	t_obj.m_radius=(bb_math_Max(t_obj.m_objImg.m_img.p_Height(),t_obj.m_objImg.m_img.p_Width()))/2.0;
	t_obj.m_w=(t_obj.m_objImg.m_img.p_Width());
	t_obj.m_h=(t_obj.m_objImg.m_img.p_Height());
	t_obj.m_rw=t_obj.m_w;
	t_obj.m_rh=t_obj.m_h;
	t_obj.p_SetLayer(this.m_defaultLayer);
	t_obj.p_SetActive(this.m_defaultActive);
	t_obj.p_SetVisible(this.m_defaultVisible);
	t_obj.m_collType=0;
	t_obj.p_internal_RotateSpriteCol(t_obj);
	return t_obj;
}
c_ftEngine.prototype.p_CreateImage2=function(t_image,t_xpos,t_ypos,t__ucob){
	var t_obj=null;
	if(t__ucob==null){
		t_obj=c_ftObject.m_new.call(new c_ftObject);
	}else{
		t_obj=object_downcast((t__ucob),c_ftObject);
	}
	t_obj.m_engine=this;
	t_obj.m_xPos=t_xpos;
	t_obj.m_yPos=t_ypos;
	t_obj.m_type=0;
	t_obj.m_objImg=this.m_imgMng.p_LoadImage(t_image);
	t_obj.m_radius=(bb_math_Max(t_obj.m_objImg.m_img.p_Height(),t_obj.m_objImg.m_img.p_Width()))/2.0;
	t_obj.m_w=(t_obj.m_objImg.m_img.p_Width());
	t_obj.m_h=(t_obj.m_objImg.m_img.p_Height());
	t_obj.m_rw=t_obj.m_w;
	t_obj.m_rh=t_obj.m_h;
	t_obj.p_SetLayer(this.m_defaultLayer);
	t_obj.p_SetActive(this.m_defaultActive);
	t_obj.p_SetVisible(this.m_defaultVisible);
	t_obj.m_collType=0;
	t_obj.p_internal_RotateSpriteCol(t_obj);
	return t_obj;
}
c_ftEngine.prototype.p_CreateImage3=function(t_atlas,t_x,t_y,t_width,t_height,t_xpos,t_ypos,t__ucob){
	var t_obj=null;
	if(t__ucob==null){
		t_obj=c_ftObject.m_new.call(new c_ftObject);
	}else{
		t_obj=object_downcast((t__ucob),c_ftObject);
	}
	t_obj.m_engine=this;
	t_obj.m_xPos=t_xpos;
	t_obj.m_yPos=t_ypos;
	t_obj.m_type=0;
	t_obj.m_objImg=this.m_imgMng.p_GrabImage3(t_atlas,t_x,t_y,t_width,t_height,1,1);
	t_obj.m_radius=(bb_math_Max(t_obj.m_objImg.m_img.p_Height(),t_obj.m_objImg.m_img.p_Width()))/2.0;
	t_obj.m_w=(t_obj.m_objImg.m_img.p_Width());
	t_obj.m_h=(t_obj.m_objImg.m_img.p_Height());
	t_obj.m_rw=t_obj.m_w;
	t_obj.m_rh=t_obj.m_h;
	t_obj.p_SetLayer(this.m_defaultLayer);
	t_obj.p_SetActive(this.m_defaultActive);
	t_obj.p_SetVisible(this.m_defaultVisible);
	t_obj.m_collType=0;
	t_obj.p_internal_RotateSpriteCol(t_obj);
	return t_obj;
}
c_ftEngine.prototype.p_CreateImage4=function(t_atlas,t_dataFileName,t_subImageName,t_xpos,t_ypos,t__ucob){
	var t_obj=null;
	if(t__ucob==null){
		t_obj=c_ftObject.m_new.call(new c_ftObject);
	}else{
		t_obj=object_downcast((t__ucob),c_ftObject);
	}
	var t_tpStringFromFile=bb_app_LoadString(t_dataFileName);
	var t_tpAllStrings=t_tpStringFromFile.split(String.fromCharCode(10));
	var t_tpXPos=0;
	var t_tpYPos=0;
	var t_tpWidth=0;
	var t_tpHeight=0;
	var t_aslen=0;
	if(t_dataFileName.toLowerCase().indexOf(".txt",0)>0){
		t_aslen=t_tpAllStrings.length;
		for(var t_count=0;t_count<=t_aslen-1;t_count=t_count+1){
			if(t_tpAllStrings[t_count].toLowerCase()==t_subImageName.toLowerCase()){
				var t_strRot=t_tpAllStrings[t_count+1];
				t_strRot=string_trim(string_replace(t_strRot,"rotate:",""));
				if(t_strRot.toLowerCase()=="true"){
					t_obj.m_offAngle=-90.0;
				}
				var t_strXY=t_tpAllStrings[t_count+2];
				t_strXY=string_trim(string_replace(t_strXY,"xy:",""));
				var t_strXYsplit=t_strXY.split(",");
				t_tpXPos=parseInt((t_strXYsplit[0]),10);
				t_tpYPos=parseInt((t_strXYsplit[1]),10);
				var t_strWH=t_tpAllStrings[t_count+3];
				t_strWH=string_trim(string_replace(t_strWH,"size:",""));
				var t_strWHsplit=t_strWH.split(",");
				t_tpWidth=parseInt((t_strWHsplit[0]),10);
				t_tpHeight=parseInt((t_strWHsplit[1]),10);
			}
		}
	}else{
		t_aslen=t_tpAllStrings.length;
		for(var t_count2=0;t_count2<=t_aslen-1;t_count2=t_count2+1){
			var t_s=string_trim(t_tpAllStrings[t_count2].toLowerCase());
			if(t_s.indexOf(string_fromchars([34])+t_subImageName.toLowerCase()+string_fromchars([34]))!=-1){
				print(t_s);
				t_s=string_replace(t_s,string_fromchars([34]),"");
				print(t_s);
				t_s=string_replace(t_s,"<subtexture ","");
				print(t_s);
				t_s=string_replace(t_s,"/>","");
				print(t_s);
				var t_strSplit=t_s.split(" ");
				var t_strX=t_strSplit[1];
				var t_strXsplit=t_strX.split("=");
				t_tpXPos=parseInt((t_strXsplit[1]),10);
				var t_strY=t_strSplit[2];
				var t_strYsplit=t_strY.split("=");
				t_tpYPos=parseInt((t_strYsplit[1]),10);
				var t_strW=t_strSplit[3];
				var t_strWsplit=t_strW.split("=");
				t_tpWidth=parseInt((t_strWsplit[1]),10);
				var t_strH=t_strSplit[4];
				var t_strHsplit=t_strH.split("=");
				t_tpHeight=parseInt((t_strHsplit[1]),10);
			}
		}
	}
	t_obj.m_engine=this;
	t_obj.m_xPos=t_xpos;
	t_obj.m_yPos=t_ypos;
	t_obj.m_type=0;
	t_obj.m_objImg=this.m_imgMng.p_GrabImage3(t_atlas,t_tpXPos,t_tpYPos,t_tpWidth,t_tpHeight,1,1);
	t_obj.m_radius=(bb_math_Max(t_obj.m_objImg.m_img.p_Height(),t_obj.m_objImg.m_img.p_Width()))/2.0;
	if(t_obj.m_offAngle<0.0){
		t_obj.m_h=(t_obj.m_objImg.m_img.p_Width());
		t_obj.m_w=(t_obj.m_objImg.m_img.p_Height());
	}else{
		t_obj.m_w=(t_obj.m_objImg.m_img.p_Width());
		t_obj.m_h=(t_obj.m_objImg.m_img.p_Height());
	}
	t_obj.m_rw=(t_obj.m_objImg.m_img.p_Width());
	t_obj.m_rh=(t_obj.m_objImg.m_img.p_Height());
	t_obj.p_SetLayer(this.m_defaultLayer);
	t_obj.p_SetActive(this.m_defaultActive);
	t_obj.p_SetVisible(this.m_defaultVisible);
	t_obj.m_collType=0;
	t_obj.p_internal_RotateSpriteCol(t_obj);
	return t_obj;
}
c_ftEngine.prototype.p_LoadSound=function(t_filename,t_loopFlag){
	var t_snd=c_ftSound.m_new.call(new c_ftSound);
	t_snd.m_engine=this;
	t_snd.m_name=t_filename;
	t_snd.m_loop=t_loopFlag;
	t_snd.m_isMusic=false;
	if(t_filename.lastIndexOf(".")<1){
		t_snd.m_sound=bb_audio_LoadSound(t_filename+".ogg");
	}else{
		t_snd.m_sound=bb_audio_LoadSound(t_filename);
	}
	t_snd.m_soundNode=this.m_soundList.p_AddLast5(t_snd);
	return t_snd;
}
c_ftEngine.prototype.p_LoadFont=function(t_filename){
	var t_font=c_ftFont.m_new.call(new c_ftFont);
	t_font.p_Load(t_filename);
	this.m_fontList.p_AddLast6(t_font);
	return t_font;
}
c_ftEngine.prototype.p_CreateText=function(t_font,t_txt,t_xpos,t_ypos,t_textmode){
	var t_obj=c_ftObject.m_new.call(new c_ftObject);
	t_obj.m_objFont=t_font;
	t_obj.m_engine=this;
	t_obj.m_textMode=t_textmode;
	t_obj.m_xPos=t_xpos;
	t_obj.m_yPos=t_ypos;
	t_obj.m_type=1;
	t_obj.p_SetText(t_txt);
	t_obj.p_SetLayer(this.m_defaultLayer);
	t_obj.p_SetActive(this.m_defaultActive);
	t_obj.p_SetVisible(this.m_defaultVisible);
	t_obj.m_collType=2;
	t_obj.p_internal_RotateSpriteCol(t_obj);
	return t_obj;
}
c_ftEngine.prototype.p_OnTimer=function(t_timerId){
	return 0;
}
c_ftEngine.prototype.p_OnObjectTimer=function(t_timerId,t_obj){
	return 0;
}
c_ftEngine.prototype.p_OnObjectTransition=function(t_transId,t_obj){
	return 0;
}
c_ftEngine.prototype.p_OnLayerTransition=function(t_transId,t_layer){
	return 0;
}
c_ftEngine.prototype.p_OnObjectUpdate=function(t_obj){
	return 0;
}
c_ftEngine.prototype.p_OnLayerUpdate=function(t_layer){
	return 0;
}
c_ftEngine.prototype.p_OnObjectDelete=function(t_obj){
	return 0;
}
c_ftEngine.prototype.p_Update=function(t_speed){
	this.m_time=this.p_GetTime();
	var t_=this.m_timerList.p_Backwards().p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_timer=t_.p_NextObject();
		t_timer.p_Update3();
	}
	var t_2=this.m_layerList.p_ObjectEnumerator();
	while(t_2.p_HasNext()){
		var t_layer=t_2.p_NextObject();
		if(t_layer.m_isActive){
			t_layer.p_Update(t_speed);
		}
	}
}
c_ftEngine.prototype.p_Update2=function(t_layer,t_speed){
	this.m_time=this.p_GetTime();
	var t_=this.m_timerList.p_Backwards().p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_timer=t_.p_NextObject();
		t_timer.p_Update3();
	}
	if(t_layer.m_isActive){
		t_layer.p_Update(t_speed);
	}
}
c_ftEngine.prototype.p_OnObjectCollision=function(t_obj,t_obj2){
	return 0;
}
c_ftEngine.prototype.p_CollisionCheck=function(){
	var t_=this.m_layerList.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_layer=t_.p_NextObject();
		if(t_layer.m_isActive){
			t_layer.p_CollisionCheck();
		}
	}
}
c_ftEngine.prototype.p_CollisionCheck2=function(t_layer){
	if(t_layer.m_isActive){
		t_layer.p_CollisionCheck();
	}
}
c_ftEngine.prototype.p_CollisionCheck3=function(t_obj){
	if(t_obj.m_layer.m_isActive){
		t_obj.m_layer.p_CollisionCheck3(t_obj);
	}
}
c_ftEngine.prototype.p_CreateObjTimer=function(t_obj,t_timerID,t_duration,t_repeatCount){
	var t_retTimer=null;
	t_retTimer=t_obj.p_CreateTimer(t_timerID,t_duration,t_repeatCount);
	return t_retTimer;
}
c_ftEngine.prototype.p_GetCanvasWidth=function(){
	return ((this.m_canvasWidth)|0);
}
c_ftEngine.prototype.p_GetCanvasHeight=function(){
	return ((this.m_canvasHeight)|0);
}
c_ftEngine.prototype.p_OnObjectRender=function(t_obj){
	return 0;
}
c_ftEngine.prototype.p_Render=function(){
	this.m_red=255.0;
	this.m_green=255.0;
	this.m_blue=255.0;
	bb_graphics_SetColor(255.0,255.0,255.0);
	bb_graphics_PushMatrix();
	bb_graphics_Translate((this.m_autofitX),(this.m_autofitY));
	bb_graphics_Scale(this.m_scaleX,this.m_scaleY);
	bb_graphics_SetScissor((this.m_autofitX),(this.m_autofitY),this.m_canvasWidth*this.m_scaleX,this.m_canvasHeight*this.m_scaleY);
	var t_=this.m_layerList.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_layer=t_.p_NextObject();
		if(t_layer.m_isVisible && t_layer.m_isActive){
			t_layer.p_Render();
		}
	}
	bb_graphics_PopMatrix();
}
c_ftEngine.prototype.p_Render2=function(t_layer){
	this.m_red=255.0;
	this.m_green=255.0;
	this.m_blue=255.0;
	bb_graphics_SetColor(255.0,255.0,255.0);
	bb_graphics_PushMatrix();
	bb_graphics_Translate((this.m_autofitX),(this.m_autofitY));
	bb_graphics_Scale(this.m_scaleX,this.m_scaleY);
	bb_graphics_SetScissor((this.m_autofitX),(this.m_autofitY),this.m_canvasWidth*this.m_scaleX,this.m_canvasHeight*this.m_scaleY);
	if(t_layer.m_isVisible && t_layer.m_isActive){
		t_layer.p_Render();
	}
	bb_graphics_PopMatrix();
}
function c_engine(){
	c_ftEngine.call(this);
}
c_engine.prototype=extend_class(c_ftEngine);
c_engine.m_new=function(){
	c_ftEngine.m_new.call(this);
	return this;
}
c_engine.prototype.p_OnObjectCollision=function(t_obj,t_obj2){
	var t_i=0;
	if(t_obj2.m_collGroup==2){
		if(t_obj2.m_tag==3){
			bb_RockSmash_g.p_SpawnExplosion(15,t_obj.m_xPos,t_obj.m_yPos);
			for(t_i=1;t_i<=2;t_i=t_i+1){
				bb_RockSmash_g.p_CreateComet(2,t_obj2.m_xPos,t_obj2.m_yPos,bb_random_Rnd2(1.0,(bb_RockSmash_g.m_levelNumber+5))/2.0,bb_random_Rnd2(0.0,359.0));
			}
			bb_RockSmash_g.m_score=bb_RockSmash_g.m_score+100;
		}
		if(t_obj2.m_tag==2){
			bb_RockSmash_g.p_SpawnExplosion(10,t_obj.m_xPos,t_obj.m_yPos);
			for(t_i=1;t_i<=4;t_i=t_i+1){
				bb_RockSmash_g.p_CreateComet(1,t_obj2.m_xPos,t_obj2.m_yPos,bb_random_Rnd2(1.0,(bb_RockSmash_g.m_levelNumber+6))/2.0,bb_random_Rnd2(0.0,359.0));
			}
			bb_RockSmash_g.m_score=bb_RockSmash_g.m_score+250;
		}
		if(t_obj2.m_tag==1){
			bb_RockSmash_g.p_SpawnExplosion(5,t_obj.m_xPos,t_obj.m_yPos);
			bb_RockSmash_g.m_score=bb_RockSmash_g.m_score+500;
		}
		bb_RockSmash_g.m_cometCount-=1;
		t_obj2.p_Remove(false);
	}
	if(t_obj.m_collGroup==1){
		t_obj.p_Remove(false);
	}
	if(t_obj.m_collGroup==3){
		bb_RockSmash_g.p_SpawnExplosion(5,t_obj.m_xPos,t_obj.m_yPos);
		bb_RockSmash_g.m_lives-=1;
		t_obj2.p_Remove(false);
	}
	if(t_obj2.m_collGroup==10){
		t_obj2.p_Remove(false);
	}
	if(t_obj2.m_collGroup==10){
		print("Boss Hit");
	}
	return 0;
}
c_engine.prototype.p_OnObjectTimer=function(t_timerId,t_obj){
	if(t_timerId==2){
		t_obj.p_Remove(false);
	}
	if(t_timerId==3){
		t_obj.p_SetActive(false);
		bb_RockSmash_g.m_player.p_SetColGroup(3);
	}
	if(t_timerId==4){
	}
	return 0;
}
c_engine.prototype.p_OnObjectUpdate=function(t_obj){
	if(bb_RockSmash_g.m_gameMode==2){
		if(t_obj==bb_RockSmash_g.m_player){
			if((bb_input_KeyDown(38))!=0){
				t_obj.p_AddSpeed(1.5*this.m_delta,9876.5);
				bb_RockSmash_g.p_SpawnPlayerEngine();
			}
			if((bb_input_KeyDown(37))!=0){
				t_obj.p_SetAngle(-15.0*this.m_delta,1);
			}
			if((bb_input_KeyDown(39))!=0){
				t_obj.p_SetAngle(15.0*this.m_delta,1);
			}
			if((bb_input_KeyHit(83))!=0){
				bb_RockSmash_g.p_SpawnPlayerShot();
			}
			if(((bb_input_KeyHit(32))!=0) && bb_RockSmash_g.m_shield.m_isActive==false){
				bb_RockSmash_g.p_ActivateShield();
			}
		}
	}
	return 0;
}
c_engine.prototype.p_OnLayerUpdate=function(t_layer){
	if(t_layer==bb_RockSmash_g.m_layerGame && bb_RockSmash_g.m_gameMode==2){
		if(bb_RockSmash_g.m_lives<=0){
			bb_RockSmash_g.m_gameMode=3;
			bb_RockSmash_g.m_layerTitle.p_SetActive(true);
			bb_RockSmash_g.m_eng.m_scoreList.p_AddScore(bb_RockSmash_g.m_score,"---");
			bb_RockSmash_g.m_player.p_SetActive(false);
			bb_RockSmash_g.m_layerFX.p_RemoveAllObjects();
			t_layer.p_RemoveAllObjectsByID(2);
			bb_RockSmash_g.p_SaveHighScore();
			return 0;
		}
		if(bb_RockSmash_g.m_cometCount<=0 && bb_RockSmash_g.m_gameMode==2){
			bb_RockSmash_g.p_ActivateShield();
			bb_RockSmash_g.m_levelNumber+=1;
			bb_RockSmash_g.p_SpawnComets(4+bb_RockSmash_g.m_levelNumber);
			bb_RockSmash_g.m_lives+=1;
		}
	}
	return 0;
}
function c_ftLayer(){
	Object.call(this);
	this.m_objList=c_lObjList.m_new.call(new c_lObjList);
	this.m_engine=null;
	this.m_engineNode=null;
	this.m_isActive=true;
	this.m_inUpdate=false;
	this.m_transitionList=c_List8.m_new.call(new c_List8);
	this.m_xPos=0.0;
	this.m_yPos=0.0;
	this.m_scale=1.0;
	this.m_alpha=1.0;
	this.m_inTouch=false;
	this.m_isVisible=true;
	this.m_angle=0.0;
	this.m_isGUI=false;
}
c_ftLayer.m_new=function(){
	this.m_objList.m_layer=this;
	return this;
}
c_ftLayer.prototype.p_SetActive=function(t_activeFlag){
	this.m_isActive=t_activeFlag;
}
c_ftLayer.prototype.p_SetPos=function(t_x,t_y,t_relative){
	if(t_relative==1){
		this.m_xPos=this.m_xPos+t_x;
		this.m_yPos=this.m_yPos+t_y;
	}else{
		this.m_xPos=t_x;
		this.m_yPos=t_y;
	}
}
c_ftLayer.prototype.p_SetScale=function(t_scaleFactor,t_relative){
	if(t_relative==1){
		this.m_scale+=t_scaleFactor;
	}else{
		this.m_scale=t_scaleFactor;
	}
}
c_ftLayer.prototype.p_SetAlpha=function(t_newAlpha,t_relative){
	if(t_relative==1){
		this.m_alpha+=t_newAlpha;
	}else{
		this.m_alpha=t_newAlpha;
	}
	if(this.m_alpha<0.0){
		this.m_alpha=0.0;
	}
	if(this.m_alpha>1.0){
		this.m_alpha=1.0;
	}
}
c_ftLayer.prototype.p_CleanupLists=function(){
	var t_=this.m_transitionList.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_trans=t_.p_NextObject();
		if(t_trans.m_deleted){
			t_trans.p_Cancel();
		}
	}
	var t_2=this.m_objList.p_Backwards().p_ObjectEnumerator();
	while(t_2.p_HasNext()){
		var t_obj=t_2.p_NextObject();
		if(t_obj.m_deleted){
			t_obj.p_Remove(true);
		}
	}
}
c_ftLayer.prototype.p_Update=function(t_speed){
	this.m_inUpdate=true;
	this.m_engine.m_delta=t_speed;
	if(this.m_engine.m_isPaused==false){
		var t_=this.m_transitionList.p_ObjectEnumerator();
		while(t_.p_HasNext()){
			var t_trans=t_.p_NextObject();
			t_trans.p_Update3();
		}
	}
	var t_2=this.m_objList.p_ObjectEnumerator();
	while(t_2.p_HasNext()){
		var t_obj=t_2.p_NextObject();
		if(t_obj.m_parentObj==null){
			t_obj.p_Update(t_speed);
		}
	}
	if(this.m_engine.m_isPaused==false){
		this.m_engine.p_OnLayerUpdate(this);
	}
	this.p_CleanupLists();
	if(this.m_inTouch==false){
		this.p_CleanupLists();
	}
	this.m_inUpdate=false;
}
c_ftLayer.prototype.p_CollisionCheck=function(){
	var t_obj=null;
	var t_obj2=null;
	var t_=this.m_objList.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		t_obj=t_.p_NextObject();
		if(t_obj.m_isActive==true){
			if(t_obj.m_collGroup>0 && t_obj.m_colCheck==true){
				var t_2=this.m_objList.p_ObjectEnumerator();
				while(t_2.p_HasNext()){
					t_obj2=t_2.p_NextObject();
					if(t_obj!=t_obj2){
						if(t_obj.p_CheckCollision(t_obj2)){
							this.m_engine.p_OnObjectCollision(t_obj,t_obj2);
						}
					}
				}
			}
		}
	}
	this.p_CleanupLists();
}
c_ftLayer.prototype.p_CollisionCheck3=function(t_obj){
	var t_obj2=null;
	if(t_obj.m_isActive==true){
		if(t_obj.m_collGroup>0){
			var t_=this.m_objList.p_ObjectEnumerator();
			while(t_.p_HasNext()){
				t_obj2=t_.p_NextObject();
				if(t_obj!=t_obj2){
					if(t_obj.p_CheckCollision(t_obj2)){
						this.m_engine.p_OnObjectCollision(t_obj,t_obj2);
					}
				}
			}
		}
		if(t_obj.m_deleted==true){
			t_obj.p_Remove(true);
		}
	}
}
c_ftLayer.prototype.p_Render=function(){
	bb_graphics_PushMatrix();
	if(this.m_angle!=0.0){
		bb_cftMisc_RotateDisplay((this.m_engine.p_GetCanvasWidth())/2.0,(this.m_engine.p_GetCanvasHeight())/2.0,-this.m_angle);
	}
	this.m_engine.m_lastLayerAngle=this.m_angle;
	if(this.m_scale!=this.m_engine.m_lastLayerScale){
		bb_graphics_Scale(this.m_scale,this.m_scale);
		this.m_engine.m_lastLayerScale=this.m_scale;
	}
	if(this.m_isVisible==true){
		var t_=this.m_objList.p_ObjectEnumerator();
		while(t_.p_HasNext()){
			var t_obj=t_.p_NextObject();
			if(this.m_isGUI==true){
				if(t_obj.m_isVisible && t_obj.m_isActive && t_obj.m_parentObj==null){
					t_obj.p_Render3(this.m_xPos,this.m_yPos);
				}
			}else{
				if(t_obj.m_isVisible && t_obj.m_isActive && t_obj.m_parentObj==null){
					t_obj.p_Render3(this.m_xPos-this.m_engine.m_camX,this.m_yPos-this.m_engine.m_camY);
				}
			}
		}
	}
	bb_graphics_PopMatrix();
}
c_ftLayer.prototype.p_RemoveAllObjects=function(){
	var t_=this.m_objList.p_Backwards().p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_obj=t_.p_NextObject();
		if(this.m_inUpdate || this.m_inTouch){
			t_obj.p_Remove(false);
		}else{
			t_obj.p_Remove(true);
		}
	}
}
c_ftLayer.prototype.p_RemoveAllObjectsByID=function(t_objID){
	var t_=this.m_objList.p_Backwards().p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_obj=t_.p_NextObject();
		if(t_obj.m_id==t_objID){
			if(this.m_inUpdate || this.m_inTouch){
				t_obj.p_Remove(false);
			}else{
				t_obj.p_Remove(true);
			}
		}
	}
}
function c_ftObject(){
	Object.call(this);
	this.m_engine=null;
	this.m_xPos=0.0;
	this.m_yPos=0.0;
	this.m_type=0;
	this.m_objImg=null;
	this.m_radius=1.0;
	this.m_w=0.0;
	this.m_h=0.0;
	this.m_rw=0.0;
	this.m_rh=0.0;
	this.m_layer=null;
	this.m_layerNode=null;
	this.m_isActive=true;
	this.m_isVisible=true;
	this.m_collType=0;
	this.m_handleX=0.5;
	this.m_scaleX=1.0;
	this.m_hOffX=0.0;
	this.m_handleY=0.5;
	this.m_scaleY=1.0;
	this.m_hOffY=0.0;
	this.m_angle=0.0;
	this.m_offAngle=0.0;
	this.m_collScale=1.0;
	this.m_isFlipV=false;
	this.m_isFlipH=false;
	this.m_x1c=0.0;
	this.m_y1c=0.0;
	this.m_x2c=0.0;
	this.m_y2c=0.0;
	this.m_x3c=0.0;
	this.m_y3c=0.0;
	this.m_x4c=0.0;
	this.m_y4c=0.0;
	this.m_childObjList=c_List.m_new.call(new c_List);
	this.m_parentObj=null;
	this.m_speedSpin=0.0;
	this.m_friction=0.0;
	this.m_speedMax=9999.0;
	this.m_isWrappingX=false;
	this.m_isWrappingY=false;
	this.m_collWith=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	this.m_collGroup=0;
	this.m_colCheck=false;
	this.m_parentNode=null;
	this.m_objFont=null;
	this.m_textMode=0;
	this.m_text="";
	this.m_alpha=1.0;
	this.m_deleted=false;
	this.m_isAnimated=false;
	this.m_animTime=0.0;
	this.m_frameEnd=0.0;
	this.m_frameTime=10.0;
	this.m_frameLength=0.0;
	this.m_speed=0.0;
	this.m_speedAngle=0.0;
	this.m_speedX=0.0;
	this.m_speedY=0.0;
	this.m_transitionList=c_List8.m_new.call(new c_List8);
	this.m_timerList=c_List7.m_new.call(new c_List7);
	this.m_onUpdateEvent=true;
	this.m_marker=null;
	this.m_markerNode=null;
	this.m_onDeleteEvent=false;
	this.m_speedMin=-9999.0;
	this.m_tag=0;
	this.m_id=0;
	this.m_red=255.0;
	this.m_green=255.0;
	this.m_blue=255.0;
	this.m_blendMode=0;
	this.m_verts=[];
	this.m_frameCount=1.0;
	this.m_rox=0.0;
	this.m_roy=0.0;
	this.m_tileModSX=0.0;
	this.m_tileModSY=0.0;
	this.m_tileSizeX=0;
	this.m_tileSizeY=0;
	this.m_tileCountX=0;
	this.m_tileMap=[];
	this.m_tileCountY=0;
	this.m_onRenderEvent=false;
}
c_ftObject.m_new=function(){
	return this;
}
c_ftObject.prototype.p_SetLayer=function(t_newLayer){
	if(this.m_layer!=null){
		this.m_layerNode.p_Remove2();
	}
	if(t_newLayer!=null){
		this.m_layerNode=t_newLayer.m_objList.p_AddLast(this);
	}
	this.m_layer=t_newLayer;
}
c_ftObject.prototype.p_SetActive=function(t_activeFlag){
	this.m_isActive=t_activeFlag;
}
c_ftObject.prototype.p_SetVisible=function(t_visible){
	this.m_isVisible=t_visible;
}
c_ftObject.prototype.p_internal_RotateSpriteCol=function(t_pSprite){
	var t_cx=.0;
	var t_cy=.0;
	var t_SinVal=.0;
	var t_CosVal=.0;
	var t_xSinVal=.0;
	var t_ySinVal=.0;
	var t_xCosVal=.0;
	var t_yCosVal=.0;
	var t_ang=.0;
	this.m_hOffX=(0.5-this.m_handleX)*this.m_w*this.m_scaleX;
	this.m_hOffY=(0.5-this.m_handleY)*this.m_h*this.m_scaleY;
	t_ang=(t_pSprite.m_angle+t_pSprite.m_offAngle)*0.0174533;
	t_SinVal=Math.sin(t_ang);
	t_CosVal=Math.cos(t_ang);
	t_cx=-t_pSprite.m_w/2.0*t_pSprite.m_scaleX*t_pSprite.m_collScale;
	if(this.m_isFlipV==true){
		t_cy=t_cy*-1.0;
	}
	t_cy=t_pSprite.m_h/2.0*t_pSprite.m_scaleY*t_pSprite.m_collScale;
	if(this.m_isFlipH==true){
		t_cx=t_cx*-1.0;
	}
	t_xCosVal=t_cx*t_CosVal;
	t_yCosVal=t_cy*t_CosVal;
	t_xSinVal=t_cx*t_SinVal;
	t_ySinVal=t_cy*t_SinVal;
	t_pSprite.m_x1c=t_xCosVal-t_ySinVal+this.m_hOffX;
	t_pSprite.m_y1c=t_yCosVal+t_xSinVal+this.m_hOffY;
	t_pSprite.m_x2c=-t_xCosVal-t_ySinVal+this.m_hOffX;
	t_pSprite.m_y2c=t_yCosVal+-t_xSinVal+this.m_hOffY;
	t_pSprite.m_x3c=-t_xCosVal- -t_ySinVal+this.m_hOffX;
	t_pSprite.m_y3c=-t_yCosVal+-t_xSinVal+this.m_hOffY;
	t_pSprite.m_x4c=t_xCosVal- -t_ySinVal+this.m_hOffX;
	t_pSprite.m_y4c=-t_yCosVal+t_xSinVal+this.m_hOffY;
	return 0;
}
c_ftObject.prototype.p_SetScale=function(t_newScale,t_relative){
	var t_sd=.0;
	if(t_relative==1){
		var t_=this.m_childObjList.p_ObjectEnumerator();
		while(t_.p_HasNext()){
			var t_child=t_.p_NextObject();
			t_child.p_SetScale(t_newScale,t_relative);
		}
	}else{
		var t_2=this.m_childObjList.p_ObjectEnumerator();
		while(t_2.p_HasNext()){
			var t_child2=t_2.p_NextObject();
			t_sd=this.m_scaleX-t_child2.m_scaleX;
			t_child2.p_SetScale(t_newScale-t_sd,t_relative);
		}
	}
	if(t_relative==1){
		this.m_scaleX+=t_newScale;
		this.m_scaleY+=t_newScale;
	}else{
		this.m_scaleX=t_newScale;
		this.m_scaleY=t_newScale;
	}
	this.p_internal_RotateSpriteCol(this);
}
c_ftObject.prototype.p_GetTargetAngle=function(t_targetObj,t_relative){
	var t_xdiff=.0;
	var t_ydiff=.0;
	var t_ang=.0;
	t_xdiff=t_targetObj.m_xPos-this.m_xPos;
	t_ydiff=t_targetObj.m_yPos-this.m_yPos;
	t_ang=(Math.atan2(t_ydiff,t_xdiff)*R2D)+90.0;
	if(t_ang<0.0){
		t_ang=360.0+t_ang;
	}
	if(t_relative==1){
		t_ang-=this.m_angle;
		if(t_ang>180.0){
			t_ang-=360.0;
		}else{
			if(t_ang<-180.0){
				t_ang+=360.0;
			}
		}
	}
	return t_ang;
}
c_ftObject.prototype.p_GetRadius=function(){
	return this.m_radius*this.m_scaleX;
}
c_ftObject.prototype.p_GetTargetDist=function(t_targetObj,t_useRadius){
	var t_xdiff=.0;
	var t_ydiff=.0;
	var t_dist=.0;
	t_xdiff=t_targetObj.m_xPos-this.m_xPos;
	t_ydiff=t_targetObj.m_yPos-this.m_yPos;
	t_dist=Math.sqrt(t_xdiff*t_xdiff+t_ydiff*t_ydiff);
	if(t_useRadius==true){
		t_dist=t_dist-this.p_GetRadius()-t_targetObj.p_GetRadius();
	}
	return t_dist;
}
c_ftObject.prototype.p_GetVector=function(t_vecDistance,t_vecAngle,t_relative){
	var t_v=new_number_array(2);
	var t_a=.0;
	if(t_relative==true){
		t_a=this.m_angle+t_vecAngle;
	}else{
		t_a=t_vecAngle;
	}
	t_v[0]=this.m_xPos+Math.sin((t_a)*D2R)*t_vecDistance;
	t_v[1]=this.m_yPos-Math.cos((t_a)*D2R)*t_vecDistance;
	return t_v;
}
c_ftObject.prototype.p_SetPos=function(t_x,t_y,t_relative){
	var t_xd=.0;
	var t_yd=.0;
	if(t_relative==1){
		var t_=this.m_childObjList.p_ObjectEnumerator();
		while(t_.p_HasNext()){
			var t_child=t_.p_NextObject();
			t_child.p_SetPos(t_x,t_y,t_relative);
		}
	}else{
		var t_2=this.m_childObjList.p_ObjectEnumerator();
		while(t_2.p_HasNext()){
			var t_child2=t_2.p_NextObject();
			t_xd=this.m_xPos-t_child2.m_xPos;
			t_yd=this.m_yPos-t_child2.m_yPos;
			t_child2.p_SetPos(t_x-t_xd,t_y-t_yd,t_relative);
		}
	}
	if(t_relative==1){
		this.m_xPos=this.m_xPos+t_x;
		this.m_yPos=this.m_yPos+t_y;
	}else{
		this.m_xPos=t_x;
		this.m_yPos=t_y;
	}
}
c_ftObject.prototype.p_internal_OrbitChild=function(t_angDiff){
	var t_parObj=this.m_parentObj;
	var t_childAngle=t_parObj.p_GetTargetAngle(this,0);
	var t_childDist=t_parObj.p_GetTargetDist(this,false);
	var t_vec=t_parObj.p_GetVector(t_childDist,t_childAngle+t_angDiff,false);
	this.p_SetPos(t_vec[0],t_vec[1],0);
	return 0;
}
c_ftObject.prototype.p_SetAngle=function(t_newAngle,t_relative){
	var t_angDiff=.0;
	if(t_relative==1){
		t_angDiff=t_newAngle;
		this.m_angle=this.m_angle+t_newAngle;
	}else{
		t_angDiff=t_newAngle-this.m_angle;
		this.m_angle=t_newAngle;
	}
	var t_=this.m_childObjList.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_child=t_.p_NextObject();
		t_child.p_internal_OrbitChild(t_angDiff);
		t_child.p_SetAngle(t_newAngle,t_relative);
	}
	if(this.m_angle>360.0){
		this.m_angle=this.m_angle-360.0;
	}
	if(this.m_angle<0.0){
		this.m_angle=this.m_angle+360.0;
	}
	this.p_internal_RotateSpriteCol(this);
}
c_ftObject.prototype.p_SetSpin=function(t_newSpin,t_relative){
	if(t_relative==1){
		this.m_speedSpin=this.m_speedSpin+t_newSpin;
	}else{
		this.m_speedSpin=t_newSpin;
	}
}
c_ftObject.prototype.p_SetFriction=function(t_newFriction,t_relative){
	if(t_relative==1){
		this.m_friction+=t_newFriction;
	}else{
		this.m_friction=t_newFriction;
	}
}
c_ftObject.prototype.p_SetMaxSpeed=function(t_maxSpeed){
	this.m_speedMax=t_maxSpeed;
}
c_ftObject.prototype.p_SetWrapScreen=function(t_ws){
	this.m_isWrappingX=t_ws;
	this.m_isWrappingY=t_ws;
}
c_ftObject.prototype.p_SetColGroup=function(t_collisionGroup){
	var t_cc=this.m_collWith.length;
	if(t_collisionGroup<0 || t_collisionGroup>t_cc){
		error("\n\nError in file fantomEngine.cftObject, Method ftObject.SetColGroup(collisionGroup:Int):\n\nUsed index is wrong. Bounds are 0-"+String(t_cc)+".");
	}
	this.m_collGroup=t_collisionGroup;
}
c_ftObject.prototype.p_SetColWith=function(t_startIndex,t_endIndex,t_boolFlag){
	var t_cc=this.m_collWith.length;
	if(t_startIndex<1 || t_endIndex>t_cc || t_startIndex>t_endIndex){
		error("\n\nError in file fantomEngine.cftObject, Method ftObject.SetColWith(startIndex:Int, endIndex:Int, boolFlag:Bool):\n\nUsed index is wrong. Bounds are 1-"+String(t_cc)+".");
	}
	for(var t_i=t_startIndex-1;t_i<=t_endIndex-1;t_i=t_i+1){
		this.m_collWith[t_i]=((t_boolFlag)?1:0);
	}
	if(t_boolFlag==true){
		this.m_colCheck=true;
	}else{
		this.m_colCheck=false;
		for(var t_i2=0;t_i2<=t_cc;t_i2=t_i2+1){
			if(this.m_collWith[t_i2]==1){
				this.m_colCheck=true;
				break;
			}
		}
	}
}
c_ftObject.prototype.p_SetColWith2=function(t_index,t_boolFlag){
	var t_cc=this.m_collWith.length;
	if(t_index<1 || t_index>t_cc){
		error("\n\nError in file fantomEngine.cftObject, Method ftObject.SetColWith(index, boolFlag):\n\nUsed index ("+String(t_index)+") is out of bounds (1-"+String(t_cc)+")");
	}
	this.m_collWith[t_index-1]=t_boolFlag;
	if(t_boolFlag==1){
		this.m_colCheck=true;
	}else{
		this.m_colCheck=false;
		for(var t_i=0;t_i<=t_cc-1;t_i=t_i+1){
			if(this.m_collWith[t_i]==1){
				this.m_colCheck=true;
				break;
			}
		}
	}
}
c_ftObject.prototype.p_SetRadius=function(t_newRadius,t_relative){
	if(t_relative==1){
		this.m_radius+=t_newRadius/this.m_scaleX;
	}else{
		this.m_radius=t_newRadius/this.m_scaleX;
	}
}
c_ftObject.prototype.p_SetParent=function(t_newParent){
	if(this.m_parentObj!=null){
		this.m_parentNode.p_Remove2();
		this.m_parentNode=null;
	}
	if(t_newParent!=null){
		this.m_parentNode=t_newParent.m_childObjList.p_AddLast(this);
	}
	this.m_parentObj=t_newParent;
}
c_ftObject.prototype.p_SetText=function(t_t){
	var t_linLen=0;
	this.m_text=t_t;
	var t_lines=t_t.split("\n");
	t_linLen=t_lines.length;
	if(this.m_type==1 || this.m_type==7){
		if(t_linLen<=1 && this.m_type==1){
			this.m_w=(this.m_objFont.p_Length(t_t));
		}else{
			this.m_type=7;
			this.m_w=0.0;
			for(var t__y=1;t__y<=t_linLen;t__y=t__y+1){
				this.m_w=bb_math_Max2(this.m_w,(this.m_objFont.p_Length(t_lines[t__y-1])));
			}
		}
		this.m_h=(this.m_objFont.m_lineHeight*t_linLen);
		this.m_rh=this.m_h;
		this.m_rw=this.m_w;
		this.m_radius=bb_math_Max2(this.m_h,this.m_w)/2.0;
	}
}
c_ftObject.prototype.p_SetAlpha=function(t_newAlpha,t_relative){
	if(t_relative==1){
		this.m_alpha+=t_newAlpha;
	}else{
		this.m_alpha=t_newAlpha;
	}
	if(this.m_alpha<0.0){
		this.m_alpha=0.0;
	}
	if(this.m_alpha>1.0){
		this.m_alpha=1.0;
	}
}
c_ftObject.prototype.p_SetPosX=function(t_x,t_relative){
	var t_xd=.0;
	if(t_relative==1){
		var t_=this.m_childObjList.p_ObjectEnumerator();
		while(t_.p_HasNext()){
			var t_child=t_.p_NextObject();
			t_child.p_SetPosX(t_x,t_relative);
		}
	}else{
		var t_2=this.m_childObjList.p_ObjectEnumerator();
		while(t_2.p_HasNext()){
			var t_child2=t_2.p_NextObject();
			t_xd=this.m_xPos-t_child2.m_xPos;
			t_child2.p_SetPosX(t_x-t_xd,t_relative);
		}
	}
	if(t_relative==1){
		this.m_xPos=this.m_xPos+t_x;
	}else{
		this.m_xPos=t_x;
	}
}
c_ftObject.prototype.p_SetPosY=function(t_y,t_relative){
	var t_yd=.0;
	if(t_relative==1){
		var t_=this.m_childObjList.p_ObjectEnumerator();
		while(t_.p_HasNext()){
			var t_child=t_.p_NextObject();
			t_child.p_SetPosY(t_y,t_relative);
		}
	}else{
		var t_2=this.m_childObjList.p_ObjectEnumerator();
		while(t_2.p_HasNext()){
			var t_child2=t_2.p_NextObject();
			t_yd=this.m_yPos-t_child2.m_yPos;
			t_child2.p_SetPosY(t_y-t_yd,t_relative);
		}
	}
	if(t_relative==1){
		this.m_yPos=this.m_yPos+t_y;
	}else{
		this.m_yPos=t_y;
	}
}
c_ftObject.prototype.p_WrapScreenX=function(){
	if(this.m_xPos<0.0){
		this.p_SetPos(this.m_engine.m_canvasWidth,0.0,1);
	}
	if(this.m_xPos>this.m_engine.m_canvasWidth){
		this.p_SetPos(-this.m_engine.m_canvasWidth,0.0,1);
	}
}
c_ftObject.prototype.p_WrapScreenY=function(){
	if(this.m_yPos<0.0){
		this.p_SetPos(0.0,this.m_engine.m_canvasHeight,1);
	}
	if(this.m_yPos>this.m_engine.m_canvasHeight){
		this.p_SetPos(0.0,-this.m_engine.m_canvasHeight,1);
	}
}
c_ftObject.prototype.p_CleanupLists=function(){
	var t_a="";
	var t_=this.m_transitionList.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_trans=t_.p_NextObject();
		if(t_trans.m_deleted){
			t_trans.p_Cancel();
		}
	}
	var t_2=this.m_timerList.p_ObjectEnumerator();
	while(t_2.p_HasNext()){
		var t_timer=t_2.p_NextObject();
		if(t_timer.m_deleted){
			t_timer.p_RemoveTimer();
		}
	}
}
c_ftObject.prototype.p_Update=function(t_delta){
	if(this.m_isActive==true && this.m_deleted==false){
		if(this.m_engine.m_isPaused==false){
			if(this.m_isAnimated==true){
				this.m_animTime+=t_delta*this.m_engine.m_timeScale;
				if(this.m_animTime>this.m_frameEnd*this.m_frameTime){
					this.m_animTime-=this.m_frameLength*this.m_frameTime;
				}
			}
			var t_currSpeed=this.m_speed;
			var t_currFriction=this.m_friction*t_delta*this.m_engine.m_timeScale;
			if(t_currSpeed>=0.0){
				t_currSpeed=t_currSpeed-t_currFriction;
				if(t_currSpeed<t_currFriction){
					t_currSpeed=0.0;
				}
				this.m_speed=t_currSpeed;
				this.m_speedX=Math.sin((this.m_speedAngle)*D2R)*t_currSpeed;
				this.m_speedY=-Math.cos((this.m_speedAngle)*D2R)*t_currSpeed;
				if(this.m_speed!=0.0){
					this.p_SetPos(this.m_speedX*t_delta*this.m_engine.m_timeScale,this.m_speedY*t_delta*this.m_engine.m_timeScale,1);
				}
			}else{
				t_currSpeed=t_currSpeed+t_currFriction;
				if(t_currSpeed>t_currFriction){
					t_currSpeed=0.0;
				}
				this.m_speed=t_currSpeed;
				this.m_speedX=Math.sin((this.m_speedAngle)*D2R)*t_currSpeed;
				this.m_speedY=-Math.cos((this.m_speedAngle)*D2R)*t_currSpeed;
				if(this.m_speed!=0.0){
					this.p_SetPos(this.m_speedX*t_delta*this.m_engine.m_timeScale,this.m_speedY*t_delta*this.m_engine.m_timeScale,1);
				}
			}
			if(this.m_speedSpin!=0.0){
				var t_absSpeedSpin=this.m_speedSpin;
				if(t_absSpeedSpin<0.0){
					t_absSpeedSpin=t_absSpeedSpin*-1.0;
				}
				if(t_absSpeedSpin<t_currFriction){
					this.m_speedSpin=0.0;
				}else{
					if(this.m_speedSpin>0.0){
						this.m_speedSpin=this.m_speedSpin-t_currFriction;
					}else{
						this.m_speedSpin=this.m_speedSpin+t_currFriction;
					}
				}
			}
			if(this.m_speedSpin!=0.0){
				this.p_SetAngle(this.m_speedSpin*t_delta*this.m_engine.m_timeScale,1);
			}
			if(this.m_isWrappingX){
				this.p_WrapScreenX();
			}
			if(this.m_isWrappingY){
				this.p_WrapScreenY();
			}
		}
		var t_=this.m_childObjList.p_ObjectEnumerator();
		while(t_.p_HasNext()){
			var t_child=t_.p_NextObject();
			if(t_child.m_isActive){
				t_child.p_Update(t_delta);
			}
		}
		var t_2=this.m_transitionList.p_ObjectEnumerator();
		while(t_2.p_HasNext()){
			var t_trans=t_2.p_NextObject();
			t_trans.p_Update3();
		}
		var t_3=this.m_timerList.p_ObjectEnumerator();
		while(t_3.p_HasNext()){
			var t_timer=t_3.p_NextObject();
			t_timer.p_Update3();
		}
		if(this.m_engine.m_isPaused==false){
			if(this.m_onUpdateEvent==true){
				this.m_engine.p_OnObjectUpdate(this);
			}
		}
	}
	this.p_CleanupLists();
}
c_ftObject.prototype.p_Remove=function(t_directFlag){
	var t_=this.m_childObjList.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_child=t_.p_NextObject();
		t_child.p_Remove(t_directFlag);
	}
	var t_2=this.m_transitionList.p_ObjectEnumerator();
	while(t_2.p_HasNext()){
		var t_trans=t_2.p_NextObject();
		t_trans.p_Cancel();
	}
	var t_3=this.m_timerList.p_ObjectEnumerator();
	while(t_3.p_HasNext()){
		var t_timer=t_3.p_NextObject();
		t_timer.p_RemoveTimer();
	}
	if(t_directFlag==true){
		if(this.m_parentObj!=null){
			this.m_parentNode.p_Remove2();
			this.m_parentObj=null;
		}
		if(this.m_layer!=null){
			this.m_layerNode.p_Remove2();
			this.m_layer=null;
		}
		if(this.m_marker!=null){
			this.m_markerNode.p_Remove2();
			this.m_marker=null;
		}
		if(this.m_onDeleteEvent==true){
			this.m_engine.p_OnObjectDelete(this);
		}
	}else{
		this.m_deleted=true;
	}
}
c_ftObject.prototype.p_internal_PointToPointDist=function(t_x1,t_y1,t_x2,t_y2){
	var t_dx=.0;
	var t_dy=.0;
	t_dx=t_x1-t_x2;
	t_dy=t_y1-t_y2;
	return Math.sqrt(t_dx*t_dx+t_dy*t_dy);
}
c_ftObject.prototype.p_internal_Line2Circle=function(t_x1,t_y1,t_x2,t_y2,t_px,t_py,t_r){
	var t_sx=.0;
	var t_sy=.0;
	var t_cx=.0;
	var t_cy=.0;
	var t_q=.0;
	t_sx=t_x2-t_x1;
	t_sy=t_y2-t_y1;
	t_q=((t_px-t_x1)*(t_x2-t_x1)+(t_py-t_y1)*(t_y2-t_y1))/(t_sx*t_sx+t_sy*t_sy);
	if(t_q<0.0){
		t_q=0.0;
	}
	if(t_q>1.0){
		t_q=1.0;
	}
	t_cx=(1.0-t_q)*t_x1+t_q*t_x2;
	t_cy=(1.0-t_q)*t_y1+t_q*t_y2;
	return this.p_internal_PointToPointDist(t_px,t_py,t_cx,t_cy)<t_r;
}
c_ftObject.prototype.p_internal_Circle2LineObj=function(t_sp1,t_sp2){
	var t_rf=.0;
	var t_bp1=c_tPointS.m_new.call(new c_tPointS);
	var t_bp2=c_tPointS.m_new.call(new c_tPointS);
	var t_sp1X=.0;
	var t_sp1Y=.0;
	t_sp1X=t_sp1.m_xPos+t_sp1.m_hOffX;
	t_sp1Y=t_sp1.m_yPos+t_sp1.m_hOffY;
	t_rf=t_sp1.m_radius*t_sp1.m_scaleX*t_sp1.m_collScale;
	t_bp1.m_x=t_sp2.m_x1c+t_sp2.m_xPos;
	t_bp1.m_y=t_sp2.m_y1c+t_sp2.m_yPos;
	t_bp2.m_x=t_sp2.m_x2c+t_sp2.m_xPos;
	t_bp2.m_y=t_sp2.m_y2c+t_sp2.m_yPos;
	if(this.p_internal_Line2Circle(t_bp1.m_x,t_bp1.m_y,t_bp2.m_x,t_bp2.m_y,t_sp1X,t_sp1Y,t_rf)){
		return true;
	}
	return false;
}
c_ftObject.prototype.p_internal_PointInsidePolygon=function(t_sp,t_px,t_py){
	var t_cx=.0;
	var t_cy=.0;
	var t_SinVal=.0;
	var t_CosVal=.0;
	var t_t=.0;
	var t_b=.0;
	var t_l=.0;
	var t_r=.0;
	t_SinVal=Math.sin(-t_sp.m_angle);
	t_CosVal=Math.cos(-t_sp.m_angle);
	t_cx=t_px-t_sp.m_xPos;
	t_cy=t_py-t_sp.m_yPos;
	t_px=t_cx*t_CosVal-t_cy*t_SinVal+t_sp.m_xPos;
	t_py=t_cy*t_CosVal+t_cx*t_SinVal+t_sp.m_yPos;
	t_l=t_sp.m_xPos+t_sp.m_hOffX-t_sp.m_w*t_sp.m_scaleX*t_sp.m_collScale/2.0+1.0;
	t_r=t_l+t_sp.m_w*(t_sp.m_scaleX*t_sp.m_collScale)-2.0;
	t_t=t_sp.m_yPos+t_sp.m_hOffY-t_sp.m_h*t_sp.m_scaleY*t_sp.m_collScale/2.0+1.0;
	t_b+=t_t+t_sp.m_h*(t_sp.m_scaleY*t_sp.m_collScale)-2.0;
	if(t_px<t_l || t_px>t_r || t_py<t_t || t_py>t_b){
		return false;
	}
	return true;
}
c_ftObject.prototype.p_internal_Circle2Box=function(t_sp1,t_sp2){
	var t_rf=.0;
	var t_bp1=c_tPointS.m_new.call(new c_tPointS);
	var t_bp2=c_tPointS.m_new.call(new c_tPointS);
	var t_bp3=c_tPointS.m_new.call(new c_tPointS);
	var t_bp4=c_tPointS.m_new.call(new c_tPointS);
	var t_sp1X=.0;
	var t_sp1Y=.0;
	t_sp1X=t_sp1.m_xPos+t_sp1.m_hOffX;
	t_sp1Y=t_sp1.m_yPos+t_sp1.m_hOffY;
	if(this.p_internal_PointInsidePolygon(t_sp2,t_sp1X,t_sp1Y)){
		return true;
	}
	t_rf=t_sp1.m_radius*t_sp1.m_scaleX*t_sp1.m_collScale;
	t_bp1.m_x=t_sp2.m_x1c+t_sp2.m_xPos;
	t_bp1.m_y=t_sp2.m_y1c+t_sp2.m_yPos;
	t_bp2.m_x=t_sp2.m_x2c+t_sp2.m_xPos;
	t_bp2.m_y=t_sp2.m_y2c+t_sp2.m_yPos;
	t_bp3.m_x=t_sp2.m_x3c+t_sp2.m_xPos;
	t_bp3.m_y=t_sp2.m_y3c+t_sp2.m_yPos;
	t_bp4.m_x=t_sp2.m_x4c+t_sp2.m_xPos;
	t_bp4.m_y=t_sp2.m_y4c+t_sp2.m_yPos;
	if(this.p_internal_Line2Circle(t_bp1.m_x,t_bp1.m_y,t_bp2.m_x,t_bp2.m_y,t_sp1X,t_sp1Y,t_rf)){
		return true;
	}
	if(this.p_internal_Line2Circle(t_bp2.m_x,t_bp2.m_y,t_bp3.m_x,t_bp3.m_y,t_sp1X,t_sp1Y,t_rf)){
		return true;
	}
	if(this.p_internal_Line2Circle(t_bp3.m_x,t_bp3.m_y,t_bp4.m_x,t_bp4.m_y,t_sp1X,t_sp1Y,t_rf)){
		return true;
	}
	if(this.p_internal_Line2Circle(t_bp4.m_x,t_bp4.m_y,t_bp1.m_x,t_bp1.m_y,t_sp1X,t_sp1Y,t_rf)){
		return true;
	}
	return false;
}
c_ftObject.prototype.p_internal_Circle2Circle=function(t_sp1,t_sp2){
	var t_xf=.0;
	var t_yf=.0;
	var t_rf=.0;
	t_xf=t_sp1.m_xPos+t_sp1.m_hOffX-(t_sp2.m_xPos+t_sp2.m_hOffX);
	t_xf*=t_xf;
	t_yf=t_sp1.m_yPos+t_sp1.m_hOffY-(t_sp2.m_yPos+t_sp2.m_hOffY);
	t_yf*=t_yf;
	t_rf=t_sp1.m_radius*t_sp1.m_scaleX*t_sp1.m_collScale+t_sp2.m_radius*t_sp2.m_scaleX*t_sp2.m_collScale;
	t_rf*=t_rf;
	if(t_xf+t_yf<t_rf){
		return true;
	}
	return false;
}
c_ftObject.prototype.p_internal_Box2Circle=function(t_sp2,t_sp1){
	var t_rf=.0;
	var t_bp1=c_tPointS.m_new.call(new c_tPointS);
	var t_bp2=c_tPointS.m_new.call(new c_tPointS);
	var t_bp3=c_tPointS.m_new.call(new c_tPointS);
	var t_bp4=c_tPointS.m_new.call(new c_tPointS);
	var t_sp1X=.0;
	var t_sp1Y=.0;
	t_sp1X=t_sp1.m_xPos+t_sp1.m_hOffX;
	t_sp1Y=t_sp1.m_yPos+t_sp1.m_hOffY;
	if(this.p_internal_PointInsidePolygon(t_sp2,t_sp1X,t_sp1Y)){
		return true;
	}
	t_rf=t_sp1.m_radius*t_sp1.m_scaleX;
	t_bp1.m_x=t_sp2.m_x1c+t_sp2.m_xPos;
	t_bp1.m_y=t_sp2.m_y1c+t_sp2.m_yPos;
	t_bp2.m_x=t_sp2.m_x2c+t_sp2.m_xPos;
	t_bp2.m_y=t_sp2.m_y2c+t_sp2.m_yPos;
	t_bp3.m_x=t_sp2.m_x3c+t_sp2.m_xPos;
	t_bp3.m_y=t_sp2.m_y3c+t_sp2.m_yPos;
	t_bp4.m_x=t_sp2.m_x4c+t_sp2.m_xPos;
	t_bp4.m_y=t_sp2.m_y4c+t_sp2.m_yPos;
	if(this.p_internal_Line2Circle(t_bp1.m_x,t_bp1.m_y,t_bp2.m_x,t_bp2.m_y,t_sp1X,t_sp1Y,t_rf)){
		return true;
	}
	if(this.p_internal_Line2Circle(t_bp2.m_x,t_bp2.m_y,t_bp3.m_x,t_bp3.m_y,t_sp1X,t_sp1Y,t_rf)){
		return true;
	}
	if(this.p_internal_Line2Circle(t_bp3.m_x,t_bp3.m_y,t_bp4.m_x,t_bp4.m_y,t_sp1X,t_sp1Y,t_rf)){
		return true;
	}
	if(this.p_internal_Line2Circle(t_bp4.m_x,t_bp4.m_y,t_bp1.m_x,t_bp1.m_y,t_sp1X,t_sp1Y,t_rf)){
		return true;
	}
	return false;
}
c_ftObject.prototype.p_internal_Circle2CircleInBox=function(t_sp1,t_sp2){
	var t_xf=.0;
	var t_yf=.0;
	var t_rf=.0;
	t_xf=t_sp1.m_xPos+t_sp1.m_hOffX-(t_sp2.m_xPos+t_sp2.m_hOffX);
	t_xf*=t_xf;
	t_yf=t_sp1.m_yPos+t_sp1.m_hOffY-(t_sp2.m_yPos+t_sp2.m_hOffY);
	t_yf*=t_yf;
	t_rf=(t_sp1.m_radius*t_sp1.m_scaleX+t_sp2.m_radius*t_sp2.m_scaleX)*1.42;
	t_rf*=t_rf;
	if(t_xf+t_yf<t_rf){
		return true;
	}
	return false;
}
c_ftObject.prototype.p_internal_Vec2DotProduct=function(t_v1,t_v2){
	return t_v1.m_x*t_v2.m_x+t_v1.m_y*t_v2.m_y;
}
c_ftObject.prototype.p_internal_between=function(t_v,t_l,t_h){
	if(t_v>=t_l && t_v<=t_h){
		return true;
	}
	return false;
}
c_ftObject.prototype.p_internal_Collided_IsIn=function(t_p,t_a,t_b,t_d){
	var t_v=c_tPointS.m_new.call(new c_tPointS);
	var t_v1=c_tPointS.m_new.call(new c_tPointS);
	var t_v2=c_tPointS.m_new.call(new c_tPointS);
	t_v.m_x=t_p.m_x-t_a.m_x;
	t_v.m_y=t_p.m_y-t_a.m_y;
	t_v1.m_x=t_b.m_x-t_a.m_x;
	t_v1.m_y=t_b.m_y-t_a.m_y;
	t_v2.m_x=t_d.m_x-t_a.m_x;
	t_v2.m_y=t_d.m_y-t_a.m_y;
	if(this.p_internal_between(this.p_internal_Vec2DotProduct(t_v,t_v1),0.0,this.p_internal_Vec2DotProduct(t_v1,t_v1)) && this.p_internal_between(this.p_internal_Vec2DotProduct(t_v,t_v2),0.0,this.p_internal_Vec2DotProduct(t_v2,t_v2))){
		return true;
	}
	return false;
}
c_ftObject.prototype.p_internal_Collided_CrossDistance=function(t_l1,t_l2,t_safetyZone){
	var t_result=.0;
	var t_q2=.0;
	var t_t2=.0;
	var t_p1start=c_tPointS.m_new.call(new c_tPointS);
	var t_p1end=c_tPointS.m_new.call(new c_tPointS);
	var t_p2start=c_tPointS.m_new.call(new c_tPointS);
	var t_p2end=c_tPointS.m_new.call(new c_tPointS);
	var t_t=.0;
	var t_k1=.0;
	var t_k2=.0;
	var t_xp=.0;
	var t_yp=.0;
	var t_minx1=.0;
	var t_maxx1=.0;
	var t_miny1=.0;
	var t_maxy1=.0;
	var t_minx2=.0;
	var t_maxx2=.0;
	var t_miny2=.0;
	var t_maxy2=.0;
	var t_tmp=.0;
	var t_q1=.0;
	t_result=-1.0;
	t_p1start.m_x=t_l1.m_p1.m_x;
	t_p1start.m_y=t_l1.m_p1.m_y;
	t_p1end.m_x=t_l1.m_p2.m_x;
	t_p1end.m_y=t_l1.m_p2.m_y;
	t_p2start.m_x=t_l2.m_p1.m_x;
	t_p2start.m_y=t_l2.m_p1.m_y;
	t_p2end.m_x=t_l2.m_p2.m_x;
	t_p2end.m_y=t_l2.m_p2.m_y;
	t_t=t_p1end.m_x-t_p1start.m_x;
	if(t_t!=0.0){
		t_k1=(t_p1end.m_y-t_p1start.m_y)/t_t;
	}else{
		t_k1=100000.0;
	}
	t_q1=t_p1start.m_x-t_k1*t_p1start.m_x;
	t_t=t_p2end.m_x-t_p2start.m_x;
	if(t_t!=0.0){
		t_k2=(t_p2end.m_y-t_p2start.m_y)/t_t;
	}else{
		t_k2=100000.0;
	}
	t_q2=t_p2start.m_y-t_k2*t_p2start.m_x;
	t_t2=t_k2-t_k1;
	if(bb_math_Abs2(t_t2)<0.0001){
		t_yp=100000.0;
		t_xp=100000.0;
	}else{
		t_yp=(t_q1*t_k2-t_q2*t_k1)/t_t2;
		t_xp=(t_q1-t_q2)/t_t2;
	}
	if(t_p1end.m_x-t_p1start.m_x==0.0){
		t_xp=t_p1start.m_x;
		t_yp=t_k2*t_xp+t_q2;
	}
	if(t_p2end.m_x-t_p2start.m_x==0.0){
		t_xp=t_p2start.m_x;
		t_yp=t_k1*t_xp+t_q1;
	}
	t_minx1=bb_math_Min2(t_p1start.m_x,t_p1end.m_x);
	t_maxx1=bb_math_Max2(t_p1start.m_x,t_p1end.m_x);
	t_miny1=bb_math_Min2(t_p1start.m_y,t_p1end.m_y);
	t_maxy1=bb_math_Max2(t_p1start.m_y,t_p1end.m_y);
	t_minx2=bb_math_Min2(t_p2start.m_x,t_p2end.m_x);
	t_maxx2=bb_math_Max2(t_p2start.m_x,t_p2end.m_x);
	t_miny2=bb_math_Min2(t_p2start.m_y,t_p2end.m_y);
	t_maxy2=bb_math_Max2(t_p2start.m_y,t_p2end.m_y);
	if(t_xp+t_safetyZone<t_minx1 || t_xp-t_safetyZone>t_maxx1 || t_yp+t_safetyZone<t_miny1 || t_yp-t_safetyZone>t_maxy1 || t_xp+t_safetyZone<t_minx2 || t_xp-t_safetyZone>t_maxx2 || t_yp+t_safetyZone<t_miny2 || t_yp-t_safetyZone>t_maxy2){
		t_result=-1.0;
	}else{
		t_tmp=Math.pow(t_xp-t_p1start.m_x,2.0);
		t_tmp=t_tmp+Math.pow(t_yp-t_p1start.m_y,2.0);
		t_tmp=Math.sqrt(t_tmp);
		t_result=t_tmp;
	}
	return t_result;
}
c_ftObject.prototype.p_internal_Box2Box=function(t_pSpriteA,t_pSpriteB){
	var t_ap1=c_tPointS.m_new.call(new c_tPointS);
	var t_ap2=c_tPointS.m_new.call(new c_tPointS);
	var t_ap3=c_tPointS.m_new.call(new c_tPointS);
	var t_ap4=c_tPointS.m_new.call(new c_tPointS);
	var t_bp1=c_tPointS.m_new.call(new c_tPointS);
	var t_bp2=c_tPointS.m_new.call(new c_tPointS);
	var t_bp3=c_tPointS.m_new.call(new c_tPointS);
	var t_bp4=c_tPointS.m_new.call(new c_tPointS);
	var t_a1p1=c_tPointS.m_new.call(new c_tPointS);
	var t_a1p2=c_tPointS.m_new.call(new c_tPointS);
	var t_a2p1=c_tPointS.m_new.call(new c_tPointS);
	var t_a2p2=c_tPointS.m_new.call(new c_tPointS);
	var t_a3p1=c_tPointS.m_new.call(new c_tPointS);
	var t_a3p2=c_tPointS.m_new.call(new c_tPointS);
	var t_a4p1=c_tPointS.m_new.call(new c_tPointS);
	var t_a4p2=c_tPointS.m_new.call(new c_tPointS);
	var t_b1p1=c_tPointS.m_new.call(new c_tPointS);
	var t_b1p2=c_tPointS.m_new.call(new c_tPointS);
	var t_b2p1=c_tPointS.m_new.call(new c_tPointS);
	var t_b2p2=c_tPointS.m_new.call(new c_tPointS);
	var t_b3p1=c_tPointS.m_new.call(new c_tPointS);
	var t_b3p2=c_tPointS.m_new.call(new c_tPointS);
	var t_b4p1=c_tPointS.m_new.call(new c_tPointS);
	var t_b4p2=c_tPointS.m_new.call(new c_tPointS);
	var t_a=[c_tLine2D.m_new.call(new c_tLine2D),c_tLine2D.m_new.call(new c_tLine2D),c_tLine2D.m_new.call(new c_tLine2D),c_tLine2D.m_new.call(new c_tLine2D)];
	var t_b=[c_tLine2D.m_new.call(new c_tLine2D),c_tLine2D.m_new.call(new c_tLine2D),c_tLine2D.m_new.call(new c_tLine2D),c_tLine2D.m_new.call(new c_tLine2D)];
	var t_la=c_tLine2D.m_new.call(new c_tLine2D);
	var t_lb=c_tLine2D.m_new.call(new c_tLine2D);
	if(this.p_internal_Circle2CircleInBox(t_pSpriteA,t_pSpriteB)==false){
		return false;
	}
	t_ap1.m_x=t_pSpriteA.m_x1c+t_pSpriteA.m_xPos;
	t_ap1.m_y=t_pSpriteA.m_y1c+t_pSpriteA.m_yPos;
	t_ap2.m_x=t_pSpriteA.m_x2c+t_pSpriteA.m_xPos;
	t_ap2.m_y=t_pSpriteA.m_y2c+t_pSpriteA.m_yPos;
	t_ap3.m_x=t_pSpriteA.m_x3c+t_pSpriteA.m_xPos;
	t_ap3.m_y=t_pSpriteA.m_y3c+t_pSpriteA.m_yPos;
	t_ap4.m_x=t_pSpriteA.m_x4c+t_pSpriteA.m_xPos;
	t_ap4.m_y=t_pSpriteA.m_y4c+t_pSpriteA.m_yPos;
	t_bp1.m_x=t_pSpriteB.m_x1c+t_pSpriteB.m_xPos;
	t_bp1.m_y=t_pSpriteB.m_y1c+t_pSpriteB.m_yPos;
	t_bp2.m_x=t_pSpriteB.m_x2c+t_pSpriteB.m_xPos;
	t_bp2.m_y=t_pSpriteB.m_y2c+t_pSpriteB.m_yPos;
	t_bp3.m_x=t_pSpriteB.m_x3c+t_pSpriteB.m_xPos;
	t_bp3.m_y=t_pSpriteB.m_y3c+t_pSpriteB.m_yPos;
	t_bp4.m_x=t_pSpriteB.m_x4c+t_pSpriteB.m_xPos;
	t_bp4.m_y=t_pSpriteB.m_y4c+t_pSpriteB.m_yPos;
	if(this.p_internal_Collided_IsIn(t_bp1,t_ap1,t_ap2,t_ap4)){
		return true;
	}
	if(this.p_internal_Collided_IsIn(t_bp2,t_ap1,t_ap2,t_ap4)){
		return true;
	}
	if(this.p_internal_Collided_IsIn(t_bp3,t_ap1,t_ap2,t_ap4)){
		return true;
	}
	if(this.p_internal_Collided_IsIn(t_bp4,t_ap1,t_ap2,t_ap4)){
		return true;
	}
	if(this.p_internal_Collided_IsIn(t_ap1,t_bp1,t_bp2,t_bp4)){
		return true;
	}
	if(this.p_internal_Collided_IsIn(t_ap2,t_bp1,t_bp2,t_bp4)){
		return true;
	}
	if(this.p_internal_Collided_IsIn(t_ap3,t_bp1,t_bp2,t_bp4)){
		return true;
	}
	if(this.p_internal_Collided_IsIn(t_ap4,t_bp1,t_bp2,t_bp4)){
		return true;
	}
	t_a1p1=t_a[0].m_p1;
	t_a1p2=t_a[0].m_p2;
	t_a2p1=t_a[1].m_p1;
	t_a2p2=t_a[1].m_p2;
	t_a3p1=t_a[2].m_p1;
	t_a3p2=t_a[2].m_p2;
	t_a4p1=t_a[3].m_p1;
	t_a4p2=t_a[3].m_p2;
	t_b1p1=t_b[0].m_p1;
	t_b1p2=t_b[0].m_p2;
	t_b2p1=t_b[1].m_p1;
	t_b2p2=t_b[1].m_p2;
	t_b3p1=t_b[2].m_p1;
	t_b3p2=t_b[2].m_p2;
	t_b4p1=t_b[3].m_p1;
	t_b4p2=t_b[3].m_p2;
	t_a1p1.m_x=t_ap1.m_x;
	t_a1p1.m_y=t_ap1.m_y;
	t_a1p2.m_x=t_ap2.m_x;
	t_a1p2.m_y=t_ap2.m_y;
	t_a2p1.m_x=t_ap2.m_x;
	t_a2p1.m_y=t_ap2.m_y;
	t_a2p2.m_x=t_ap3.m_x;
	t_a2p2.m_y=t_ap3.m_y;
	t_a3p1.m_x=t_ap3.m_x;
	t_a3p1.m_y=t_ap3.m_y;
	t_a3p2.m_x=t_ap4.m_x;
	t_a3p2.m_y=t_ap4.m_y;
	t_a4p1.m_x=t_ap4.m_x;
	t_a4p1.m_y=t_ap4.m_y;
	t_a4p2.m_x=t_ap1.m_x;
	t_a4p2.m_y=t_ap1.m_y;
	t_b1p1.m_x=t_bp1.m_x;
	t_b1p1.m_y=t_bp1.m_y;
	t_b1p2.m_x=t_bp2.m_x;
	t_b1p2.m_y=t_bp2.m_y;
	t_b2p1.m_x=t_bp2.m_x;
	t_b2p1.m_y=t_bp2.m_y;
	t_b2p2.m_x=t_bp3.m_x;
	t_b2p2.m_y=t_bp3.m_y;
	t_b3p1.m_x=t_bp3.m_x;
	t_b3p1.m_y=t_bp3.m_y;
	t_b3p2.m_x=t_bp4.m_x;
	t_b3p2.m_y=t_bp4.m_y;
	t_b4p1.m_x=t_bp4.m_x;
	t_b4p1.m_y=t_bp4.m_y;
	t_b4p2.m_x=t_bp1.m_x;
	t_b4p2.m_y=t_bp1.m_y;
	for(var t_i=0;t_i<=3;t_i=t_i+1){
		for(var t_j=0;t_j<=3;t_j=t_j+1){
			t_la=t_a[t_i];
			t_lb=t_b[t_j];
			if(this.p_internal_Collided_CrossDistance(t_la,t_lb,0.0)!=-1.0){
				return true;
			}
		}
	}
	return false;
}
c_ftObject.prototype.p_internal_Bound2Bound=function(t_sp1,t_sp2){
	var t_left1=.0;
	var t_left2=.0;
	var t_right1=.0;
	var t_right2=.0;
	var t_top1=.0;
	var t_top2=.0;
	var t_bottom1=.0;
	var t_bottom2=.0;
	var t_h=.0;
	var t_w=.0;
	t_left1=t_sp1.m_xPos+t_sp1.m_hOffX-t_sp1.m_w*t_sp1.m_scaleX*t_sp1.m_collScale/2.0;
	t_right1=t_left1+t_sp1.m_w*t_sp1.m_scaleX;
	t_top1=t_sp1.m_yPos+t_sp1.m_hOffY-t_sp1.m_h*t_sp1.m_scaleY*t_sp1.m_collScale/2.0;
	t_bottom1=t_top1+t_sp1.m_h*t_sp1.m_scaleY;
	t_left2=t_sp2.m_xPos+t_sp2.m_hOffX-t_sp2.m_w*t_sp2.m_scaleX*t_sp2.m_collScale/2.0;
	t_right2=t_left2+t_sp2.m_w*t_sp2.m_scaleX;
	t_top2=t_sp2.m_yPos+t_sp2.m_hOffY-t_sp2.m_h*t_sp2.m_scaleY*t_sp2.m_collScale/2.0;
	t_bottom2=t_top2+t_sp2.m_h*t_sp2.m_scaleY;
	if(t_bottom1<t_top2){
		return false;
	}
	if(t_top1>t_bottom2){
		return false;
	}
	if(t_right1<t_left2){
		return false;
	}
	if(t_left1>t_right2){
		return false;
	}
	return true;
}
c_ftObject.prototype.p_CheckCollision=function(t_sp2){
	if(t_sp2.m_deleted==false && this.m_deleted==false){
		if(t_sp2.m_collGroup>0 && t_sp2.m_isActive){
			if(this.m_collWith[t_sp2.m_collGroup-1]>0){
				var t_1=this.m_collType;
				if(t_1==0){
					var t_2=t_sp2.m_collType;
					if(t_2==3){
						return this.p_internal_Circle2LineObj(this,t_sp2);
					}else{
						if(t_2==1 || t_2==2){
							return this.p_internal_Circle2Box(this,t_sp2);
						}else{
							return this.p_internal_Circle2Circle(this,t_sp2);
						}
					}
				}else{
					if(t_1==1){
						var t_3=t_sp2.m_collType;
						if(t_3==0){
							return this.p_internal_Box2Circle(this,t_sp2);
						}else{
							return this.p_internal_Box2Box(this,t_sp2);
						}
					}else{
						if(t_1==2){
							var t_4=t_sp2.m_collType;
							if(t_4==0){
								return this.p_internal_Box2Circle(this,t_sp2);
							}else{
								if(t_4==1 || t_4==3){
									return this.p_internal_Box2Box(this,t_sp2);
								}else{
									return this.p_internal_Bound2Bound(this,t_sp2);
								}
							}
						}else{
							if(t_1==3){
								var t_5=t_sp2.m_collType;
								if(t_5==0){
									return this.p_internal_Circle2LineObj(t_sp2,this);
								}else{
									return this.p_internal_Box2Box(this,t_sp2);
								}
							}else{
								return this.p_internal_Circle2Circle(this,t_sp2);
							}
						}
					}
				}
			}
		}
	}
	return false;
}
c_ftObject.prototype.p_SetSpeed=function(t_newSpeed,t_ang){
	var t_a=.0;
	var t_a2=.0;
	if(t_ang==9876.5){
		t_a=this.m_angle;
	}else{
		t_a=t_ang;
	}
	t_a2=t_a;
	if(t_newSpeed>this.m_speedMax){
		t_newSpeed=this.m_speedMax;
	}
	if(t_newSpeed<this.m_speedMin){
		t_newSpeed=this.m_speedMin;
	}
	this.m_speedX=Math.sin((t_a)*D2R)*t_newSpeed;
	this.m_speedY=-Math.cos((t_a)*D2R)*t_newSpeed;
	t_a=(Math.atan2(this.m_speedY,this.m_speedX)*R2D)+90.0;
	if(t_a<0.0){
		t_a=t_a+360.0;
	}else{
		if(t_a>360.0){
			t_a=t_a-360.0;
		}
	}
	this.m_speedAngle=t_a2;
	this.m_speed=t_newSpeed;
	if(this.m_speed>this.m_speedMax){
		this.m_speed=this.m_speedMax;
	}
}
c_ftObject.prototype.p_CreateTimer=function(t_timerID,t_duration,t_repeatCount){
	var t_timer=c_ftTimer.m_new.call(new c_ftTimer);
	t_timer.m_engine=this.m_engine;
	t_timer.m_currTime=this.m_engine.m_time;
	t_timer.m_duration=t_duration;
	t_timer.m_id=t_timerID;
	t_timer.m_intervall=t_duration;
	t_timer.m_loop=t_repeatCount;
	t_timer.m_obj=this;
	t_timer.m_timerNode=this.m_timerList.p_AddLast7(t_timer);
	return t_timer;
}
c_ftObject.prototype.p_SetTag=function(t_t){
	this.m_tag=t_t;
}
c_ftObject.prototype.p_SetID=function(t_i){
	this.m_id=t_i;
}
c_ftObject.prototype.p_Render3=function(t_xoff,t_yoff){
	var t_txOff=.0;
	var t_tyOff=.0;
	var t_mAlpha=.0;
	var t_tempScaleX=.0;
	var t_tempScaleY=.0;
	var t_tilePos=0;
	var t_tileIDx=0;
	var t_tlxPos=.0;
	var t_tlyPos=.0;
	var t_tlW=.0;
	var t_tlH=.0;
	var t_tlW2=.0;
	var t_tlH2=.0;
	var t_ytY=0;
	var t_ytX=0;
	var t__y=0;
	var t_px=.0;
	var t_py=.0;
	var t_tmpFrame=0;
	var t_drawAngle=.0;
	var t__cw=.0;
	var t__ch=.0;
	if(this.m_deleted==false){
		t_mAlpha=this.m_alpha*this.m_layer.m_alpha;
		if(this.m_engine.m_alpha!=t_mAlpha){
			bb_graphics_SetAlpha(t_mAlpha);
			this.m_engine.m_alpha=t_mAlpha;
		}
		if(this.m_engine.m_red!=this.m_red || this.m_engine.m_green!=this.m_green || this.m_engine.m_blue!=this.m_blue){
			bb_graphics_SetColor(this.m_red,this.m_green,this.m_blue);
			this.m_engine.m_red=this.m_red;
			this.m_engine.m_green=this.m_green;
			this.m_engine.m_blue=this.m_blue;
		}
		if(this.m_engine.m_blendMode!=this.m_blendMode){
			bb_graphics_SetBlend(this.m_blendMode);
			this.m_engine.m_blendMode=this.m_blendMode;
		}
		if(this.m_isFlipV){
			t_tempScaleY=this.m_scaleY*-1.0;
		}else{
			t_tempScaleY=this.m_scaleY;
		}
		if(this.m_isFlipH){
			t_tempScaleX=this.m_scaleX*-1.0;
		}else{
			t_tempScaleX=this.m_scaleX;
		}
		var t_11=this.m_type;
		if(t_11==8){
			bb_graphics_DrawPoint(this.m_xPos+t_xoff,this.m_yPos+t_yoff);
		}else{
			if(t_11==9){
				bb_graphics_PushMatrix();
				bb_graphics_Translate(this.m_xPos+t_xoff,this.m_yPos+t_yoff);
				bb_graphics_Rotate(360.0-this.m_angle);
				bb_graphics_Scale(this.m_scaleX,this.m_scaleY);
				bb_graphics_DrawCircle(-this.m_w*this.m_handleX+4.0,-this.m_h*this.m_handleY+4.0,4.0);
				bb_graphics_DrawLine(-this.m_w*this.m_handleX+4.0,-this.m_h*this.m_handleY+6.0,-this.m_w*this.m_handleX+4.0,-this.m_h*this.m_handleY+25.0);
				bb_graphics_DrawLine(-this.m_w*this.m_handleX+4.0,-this.m_h*this.m_handleY+14.0,-this.m_w*this.m_handleX+8.0,-this.m_h*this.m_handleY+18.0);
				bb_graphics_DrawLine(-this.m_w*this.m_handleX+4.0,-this.m_h*this.m_handleY+25.0,-this.m_w*this.m_handleX,-this.m_h*this.m_handleY+29.0);
				bb_graphics_DrawLine(-this.m_w*this.m_handleX+4.0,-this.m_h*this.m_handleY+25.0,-this.m_w*this.m_handleX+8.0,-this.m_h*this.m_handleY+29.0);
				bb_graphics_PopMatrix();
			}else{
				if(t_11==10){
					bb_graphics_PushMatrix();
					bb_graphics_Translate(this.m_xPos+t_xoff,this.m_yPos+t_yoff);
					bb_graphics_Rotate(360.0-this.m_angle);
					bb_graphics_DrawOval(-this.m_w*this.m_handleX,-this.m_h*this.m_handleY,this.m_w,this.m_h);
					bb_graphics_PopMatrix();
				}else{
					if(t_11==11){
						bb_graphics_PushMatrix();
						bb_graphics_Translate(this.m_xPos+t_xoff,this.m_yPos+t_yoff);
						bb_graphics_Rotate(360.0-this.m_angle+90.0);
						bb_graphics_DrawLine(-this.m_w*this.m_handleX,0.0,this.m_w-this.m_w*this.m_handleX,0.0);
						bb_graphics_PopMatrix();
					}else{
						if(t_11==12){
							bb_graphics_PushMatrix();
							bb_graphics_Translate(this.m_xPos+t_xoff,this.m_yPos+t_yoff);
							bb_graphics_Rotate(360.0-this.m_angle);
							bb_graphics_Scale(this.m_scaleX,this.m_scaleY);
							bb_graphics_DrawPoly(this.m_verts);
							bb_graphics_PopMatrix();
						}else{
							if(t_11==0){
								t_px=this.m_hOffX+this.m_xPos+t_xoff;
								t_py=this.m_hOffY+this.m_yPos+t_yoff;
								if(this.m_isAnimated==true){
									if(t_px+this.m_w/2.0>=0.0 && t_px-this.m_w/2.0<=(this.m_engine.p_GetCanvasWidth())){
										if(t_py+this.m_h/2.0>=0.0 && t_py-this.m_h/2.0<=(this.m_engine.p_GetCanvasHeight())){
											t_tmpFrame=((bb_math_Min2(this.m_frameCount-1.0,this.m_animTime/this.m_frameTime))|0);
											bb_graphics_DrawImageRect2(this.m_objImg.m_img,t_px,t_py,((this.m_rox)|0),((this.m_roy)|0),((this.m_rw)|0),((this.m_rh)|0),360.0-this.m_angle+this.m_offAngle,t_tempScaleX,t_tempScaleY,bb_math_Min(t_tmpFrame,this.m_objImg.m_img.p_Frames()-1));
										}
									}
								}else{
									if(t_px+this.m_w/2.0>=0.0 && t_px-this.m_w/2.0<=this.m_engine.m_canvasWidth){
										if(t_py+this.m_h/2.0>=0.0 && t_py-this.m_h/2.0<=this.m_engine.m_canvasHeight){
											bb_graphics_DrawImageRect2(this.m_objImg.m_img,t_px,t_py,((this.m_rox)|0),((this.m_roy)|0),((this.m_rw)|0),((this.m_rh)|0),360.0-this.m_angle+this.m_offAngle,t_tempScaleX,t_tempScaleY,0);
										}
									}
								}
							}else{
								if(t_11==6){
									t__cw=(this.m_engine.p_GetCanvasWidth());
									t__ch=(this.m_engine.p_GetCanvasHeight());
									t_tempScaleX=t_tempScaleX+this.m_tileModSX;
									t_tempScaleY=t_tempScaleY+this.m_tileModSY;
									t_tlW=(this.m_tileSizeX)*this.m_scaleX;
									t_tlH=(this.m_tileSizeY)*this.m_scaleY;
									t_tlW2=t_tlW/2.0;
									t_tlH2=t_tlH/2.0;
									t_drawAngle=360.0-this.m_angle;
									var t_xFirst=1;
									var t_xLast=this.m_tileCountX;
									for(t_ytX=1;t_ytX<=this.m_tileCountX;t_ytX=t_ytX+1){
										t_tlxPos=t_xoff+this.m_xPos+this.m_tileMap[t_ytX-1].m_xOff*this.m_scaleX;
										if(t_tlxPos+t_tlW2>=0.0 && t_tlxPos-t_tlW2<=t__cw){
											t_xFirst=t_ytX;
											break;
										}
									}
									for(t_ytX=t_xFirst+1;t_ytX<=this.m_tileCountX;t_ytX=t_ytX+1){
										t_tlxPos=t_xoff+this.m_xPos+this.m_tileMap[t_ytX-1].m_xOff*this.m_scaleX;
										if(t_tlxPos+t_tlW2<0.0 || t_tlxPos-t_tlW2>t__cw){
											t_xLast=t_ytX-1;
											break;
										}
									}
									var t_yFirst=1;
									var t_yLast=this.m_tileCountY;
									for(t_ytY=1;t_ytY<=this.m_tileCountY;t_ytY=t_ytY+1){
										t_tilePos=(t_ytY-1)*this.m_tileCountX;
										t_tlyPos=t_yoff+this.m_yPos+this.m_tileMap[t_tilePos].m_yOff*this.m_scaleY;
										if(t_tlyPos+t_tlH2>=0.0 && t_tlyPos-t_tlH2<=t__ch){
											t_yFirst=t_ytY;
											break;
										}
									}
									for(t_ytY=t_yFirst+1;t_ytY<=this.m_tileCountY;t_ytY=t_ytY+1){
										t_tilePos=(t_ytY-1)*this.m_tileCountX;
										t_tlyPos=t_yoff+this.m_yPos+this.m_tileMap[t_tilePos].m_yOff*this.m_scaleY;
										if(t_tlyPos+t_tlH2<0.0 || t_tlyPos-t_tlH2>t__ch){
											t_yLast=t_ytY-1;
											break;
										}
									}
									for(t_ytY=t_yFirst;t_ytY<=t_yLast;t_ytY=t_ytY+1){
										for(t_ytX=t_xFirst;t_ytX<=t_xLast;t_ytX=t_ytX+1){
											t_tilePos=t_ytX-1+(t_ytY-1)*this.m_tileCountX;
											t_tileIDx=this.m_tileMap[t_tilePos].m_tileID;
											if(t_tileIDx!=-1){
												t_tlxPos=t_xoff+this.m_xPos+this.m_tileMap[t_tilePos].m_xOff*this.m_scaleX;
												t_tlyPos=t_yoff+this.m_yPos+this.m_tileMap[t_tilePos].m_yOff*this.m_scaleY;
												bb_graphics_DrawImageRect2(this.m_objImg.m_img,t_tlxPos,t_tlyPos,((this.m_rox)|0),((this.m_roy)|0),((this.m_rw)|0),((this.m_rh)|0),t_drawAngle,t_tempScaleX,t_tempScaleY,t_tileIDx);
											}
										}
									}
								}else{
									if(t_11==2){
										bb_graphics_PushMatrix();
										bb_graphics_Translate(this.m_xPos+t_xoff,this.m_yPos+t_yoff);
										bb_graphics_Rotate(360.0-this.m_angle);
										bb_graphics_DrawCircle(-this.m_w*(this.m_handleX-0.5),-this.m_h*(this.m_handleY-0.5),this.m_radius*this.m_scaleX);
										bb_graphics_PopMatrix();
									}else{
										if(t_11==3){
											bb_graphics_PushMatrix();
											bb_graphics_Translate(this.m_xPos+t_xoff,this.m_yPos+t_yoff);
											bb_graphics_Rotate(360.0-this.m_angle);
											bb_graphics_Scale(this.m_scaleX,this.m_scaleY);
											bb_graphics_DrawRect(-this.m_w*this.m_handleX,-this.m_h*this.m_handleY,this.m_w,this.m_h);
											bb_graphics_PopMatrix();
										}else{
											if(t_11==1){
												bb_graphics_PushMatrix();
												bb_graphics_Translate(this.m_xPos+t_xoff,this.m_yPos+t_yoff);
												bb_graphics_Rotate(360.0-this.m_angle);
												bb_graphics_Scale(this.m_scaleX,this.m_scaleY);
												var t_12=this.m_textMode;
												if(t_12==0){
													t_txOff=0.0;
													t_tyOff=0.0;
												}else{
													if(t_12==1){
														t_txOff=-((this.m_objFont.p_Length(this.m_text))/2.0);
														t_tyOff=0.0;
													}else{
														if(t_12==2){
															t_txOff=(-this.m_objFont.p_Length(this.m_text));
															t_tyOff=0.0;
														}else{
															if(t_12==7){
																t_txOff=0.0;
																t_tyOff=-((this.m_objFont.p_Height())/2.0);
															}else{
																if(t_12==3){
																	t_txOff=-((this.m_objFont.p_Length(this.m_text))/2.0);
																	t_tyOff=-((this.m_objFont.p_Height())/2.0);
																}else{
																	if(t_12==4){
																		t_txOff=(-this.m_objFont.p_Length(this.m_text));
																		t_tyOff=-((this.m_objFont.p_Height())/2.0);
																	}else{
																		if(t_12==8){
																			t_txOff=0.0;
																			t_tyOff=-(this.m_objFont.p_Height());
																		}else{
																			if(t_12==5){
																				t_txOff=-((this.m_objFont.p_Length(this.m_text))/2.0);
																				t_tyOff=-(this.m_objFont.p_Height());
																			}else{
																				if(t_12==6){
																					t_txOff=(-this.m_objFont.p_Length(this.m_text));
																					t_tyOff=-(this.m_objFont.p_Height());
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
												this.m_objFont.p_Draw(this.m_text,t_txOff,t_tyOff);
												bb_graphics_PopMatrix();
											}else{
												if(t_11==7){
													bb_graphics_PushMatrix();
													bb_graphics_Translate(this.m_xPos+t_xoff,this.m_yPos+t_yoff);
													bb_graphics_Rotate(360.0-this.m_angle);
													bb_graphics_Scale(this.m_scaleX,this.m_scaleY);
													var t_lines=this.m_text.split("\n");
													var t_objFontHeight=(this.m_objFont.p_Height());
													var t_linesCount=t_lines.length;
													for(t__y=1;t__y<=t_linesCount;t__y=t__y+1){
														var t_13=this.m_textMode;
														if(t_13==0){
															t_txOff=0.0;
															t_tyOff=0.0+t_objFontHeight*(t__y-1);
														}else{
															if(t_13==1){
																t_txOff=-((this.m_objFont.p_Length(t_lines[t__y-1]))/2.0);
																t_tyOff=0.0+t_objFontHeight*(t__y-1);
															}else{
																if(t_13==2){
																	t_txOff=(-this.m_objFont.p_Length(t_lines[t__y-1]));
																	t_tyOff=0.0+t_objFontHeight*(t__y-1);
																}else{
																	if(t_13==7){
																		t_txOff=0.0;
																		t_tyOff=-(t_objFontHeight*(t_linesCount)/2.0)+t_objFontHeight*(t__y-1);
																	}else{
																		if(t_13==3){
																			t_txOff=-((this.m_objFont.p_Length(t_lines[t__y-1]))/2.0);
																			t_tyOff=-(t_objFontHeight*(t_linesCount)/2.0)+t_objFontHeight*(t__y-1);
																		}else{
																			if(t_13==4){
																				t_txOff=(-this.m_objFont.p_Length(t_lines[t__y-1]));
																				t_tyOff=-(t_objFontHeight*(t_linesCount)/2.0)+t_objFontHeight*(t__y-1);
																			}else{
																				if(t_13==8){
																					t_txOff=0.0;
																					t_tyOff=-(t_objFontHeight*(t_linesCount))+t_objFontHeight*(t__y-1);
																				}else{
																					if(t_13==5){
																						t_txOff=-((this.m_objFont.p_Length(t_lines[t__y-1]))/2.0);
																						t_tyOff=-(t_objFontHeight*(t_linesCount))+t_objFontHeight*(t__y-1);
																					}else{
																						if(t_13==6){
																							t_txOff=(-this.m_objFont.p_Length(t_lines[t__y-1]));
																							t_tyOff=-(t_objFontHeight*(t_linesCount))+t_objFontHeight*(t__y-1);
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
														this.m_objFont.p_Draw(t_lines[t__y-1],t_txOff,t_tyOff);
													}
													bb_graphics_PopMatrix();
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		if(this.m_onRenderEvent==true){
			this.m_engine.p_OnObjectRender(this);
		}
		var t_=this.m_childObjList.p_ObjectEnumerator();
		while(t_.p_HasNext()){
			var t_child=t_.p_NextObject();
			if(t_child.m_isVisible && t_child.m_isActive){
				t_child.p_Render3(t_xoff,t_yoff);
			}
		}
	}
}
c_ftObject.prototype.p_AddSpeed=function(t_sp,t_ang){
	var t_a=.0;
	if(t_ang==9876.5){
		t_a=this.m_angle;
	}else{
		t_a=t_ang;
	}
	this.m_speedX=this.m_speedX+Math.sin((t_a)*D2R)*t_sp;
	this.m_speedY=this.m_speedY-Math.cos((t_a)*D2R)*t_sp;
	t_a=(Math.atan2(this.m_speedY,this.m_speedX)*R2D)+90.0;
	if(t_a<0.0){
		t_a=t_a+360.0;
	}else{
		if(t_a>360.0){
			t_a=t_a-360.0;
		}
	}
	this.m_speedAngle=t_a;
	this.m_speed=Math.sqrt(this.m_speedX*this.m_speedX+this.m_speedY*this.m_speedY);
	if(this.m_speed>this.m_speedMax){
		this.m_speed=this.m_speedMax;
	}
}
function c_List(){
	Object.call(this);
	this.m__head=(c_HeadNode.m_new.call(new c_HeadNode));
}
c_List.m_new=function(){
	return this;
}
c_List.prototype.p_AddLast=function(t_data){
	return c_Node.m_new.call(new c_Node,this.m__head,this.m__head.m__pred,t_data);
}
c_List.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast(t_t);
	}
	return this;
}
c_List.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator2.m_new.call(new c_Enumerator2,this);
}
c_List.prototype.p_Backwards=function(){
	return c_BackwardsList2.m_new.call(new c_BackwardsList2,this);
}
function c_lObjList(){
	c_List.call(this);
	this.m_layer=null;
}
c_lObjList.prototype=extend_class(c_List);
c_lObjList.m_new=function(){
	c_List.m_new.call(this);
	return this;
}
function c_Node(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node.m_new2=function(){
	return this;
}
c_Node.prototype.p_Remove2=function(){
	this.m__succ.m__pred=this.m__pred;
	this.m__pred.m__succ=this.m__succ;
	return 0;
}
function c_HeadNode(){
	c_Node.call(this);
}
c_HeadNode.prototype=extend_class(c_Node);
c_HeadNode.m_new=function(){
	c_Node.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_List2(){
	Object.call(this);
	this.m__head=(c_HeadNode2.m_new.call(new c_HeadNode2));
}
c_List2.m_new=function(){
	return this;
}
c_List2.prototype.p_AddLast2=function(t_data){
	return c_Node2.m_new.call(new c_Node2,this.m__head,this.m__head.m__pred,t_data);
}
c_List2.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast2(t_t);
	}
	return this;
}
c_List2.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator3.m_new.call(new c_Enumerator3,this);
}
function c_Node2(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node2.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node2.m_new2=function(){
	return this;
}
function c_HeadNode2(){
	c_Node2.call(this);
}
c_HeadNode2.prototype=extend_class(c_Node2);
c_HeadNode2.m_new=function(){
	c_Node2.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_ftScene(){
	Object.call(this);
	this.m_engine=null;
	this.m_layerList=c_List2.m_new.call(new c_List2);
}
c_ftScene.m_new=function(){
	return this;
}
c_ftScene.prototype.p_AddLayer=function(t_layer){
	this.m_layerList.p_AddLast2(t_layer);
}
function c_List3(){
	Object.call(this);
	this.m__head=(c_HeadNode3.m_new.call(new c_HeadNode3));
}
c_List3.m_new=function(){
	return this;
}
c_List3.prototype.p_AddLast3=function(t_data){
	return c_Node3.m_new.call(new c_Node3,this.m__head,this.m__head.m__pred,t_data);
}
c_List3.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast3(t_t);
	}
	return this;
}
function c_Node3(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node3.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node3.m_new2=function(){
	return this;
}
function c_HeadNode3(){
	c_Node3.call(this);
}
c_HeadNode3.prototype=extend_class(c_Node3);
c_HeadNode3.m_new=function(){
	c_Node3.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function bb_app_Millisecs(){
	return bb_app__game.Millisecs();
}
function c_ftSwipe(){
	Object.call(this);
	this.m_startX=new_number_array(10);
	this.m_startY=new_number_array(10);
	this.m_endX=new_number_array(10);
	this.m_endY=new_number_array(10);
	this.m_diffX=new_number_array(10);
	this.m_diffY=new_number_array(10);
	this.m_startTime=new_number_array(10);
	this.m_endTime=new_number_array(10);
	this.m_diffTime=new_number_array(10);
	this.m_touchActive=new_bool_array(10);
	this.m_angle=new_number_array(10);
	this.m_dist=new_number_array(10);
	this.m_speed=new_number_array(10);
	this.m_engine=null;
}
c_ftSwipe.m_new=function(){
	for(var t_i=0;t_i<=9;t_i=t_i+1){
		this.m_startX[t_i]=0.0;
		this.m_startY[t_i]=0.0;
		this.m_endX[t_i]=0.0;
		this.m_endY[t_i]=0.0;
		this.m_diffX[t_i]=0.0;
		this.m_diffY[t_i]=0.0;
		this.m_startTime[t_i]=0;
		this.m_endTime[t_i]=0;
		this.m_diffTime[t_i]=0;
		this.m_touchActive[t_i]=false;
		this.m_angle[t_i]=0.0;
		this.m_dist[t_i]=0.0;
		this.m_speed[t_i]=0.0;
	}
	return this;
}
function c_ftImageManager(){
	Object.call(this);
	this.m_engine=null;
	this.m_imageList=c_List4.m_new.call(new c_List4);
}
c_ftImageManager.m_new=function(){
	return this;
}
c_ftImageManager.prototype.p_LoadImage=function(t_image){
	var t_tmpImg=null;
	var t_newImage=null;
	var t_=this.m_imageList.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_tmpImgNode=t_.p_NextObject();
		if(t_tmpImgNode.m_img==t_image){
			t_newImage=t_tmpImgNode;
			break;
		}
	}
	if(t_newImage==null){
		t_newImage=c_ftImage.m_new.call(new c_ftImage);
		t_newImage.m_engine=this.m_engine;
		t_newImage.m_path="";
		t_newImage.m_flags=c_Image.m_DefaultFlags;
		t_newImage.m_frameCount=1;
		t_newImage.m_img=t_image;
		t_newImage.m_imageNode=this.m_imageList.p_AddLast4(t_newImage);
	}
	return t_newImage;
}
c_ftImageManager.prototype.p_LoadImage2=function(t_path,t_frameCount,t_flags){
	var t_tmpImg=null;
	var t_newImage=null;
	var t_=this.m_imageList.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_tmpImgNode=t_.p_NextObject();
		if(t_tmpImgNode.m_path==t_path){
			t_newImage=t_tmpImgNode;
			break;
		}
	}
	if(t_newImage==null){
		t_newImage=c_ftImage.m_new.call(new c_ftImage);
		t_newImage.m_engine=this.m_engine;
		t_newImage.m_path=t_path;
		t_newImage.m_flags=t_flags;
		t_newImage.m_frameCount=t_frameCount;
		t_tmpImg=bb_graphics_LoadImage(t_path,t_frameCount,t_flags);
		if(t_tmpImg==null){
			error("ftImageManager.LoadImage\n\nCould not load image\n\n"+t_path);
		}
		t_newImage.m_img=t_tmpImg;
		t_newImage.m_imageNode=this.m_imageList.p_AddLast4(t_newImage);
	}
	return t_newImage;
}
c_ftImageManager.prototype.p_LoadImage3=function(t_path,t_frameWidth,t_frameHeight,t_frameCount,t_flags){
	var t_tmpImg=null;
	var t_newImage=null;
	var t_=this.m_imageList.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_tmpImgNode=t_.p_NextObject();
		if(t_tmpImgNode.m_path==t_path){
			t_newImage=t_tmpImgNode;
			break;
		}
	}
	if(t_newImage==null){
		t_newImage=c_ftImage.m_new.call(new c_ftImage);
		t_newImage.m_engine=this.m_engine;
		t_newImage.m_path=t_path;
		t_newImage.m_flags=t_flags;
		t_newImage.m_frameCount=t_frameCount;
		t_newImage.m_frameHeight=t_frameHeight;
		t_newImage.m_frameWidth=t_frameWidth;
		t_tmpImg=bb_graphics_LoadImage2(t_path,t_frameWidth,t_frameHeight,t_frameCount,t_flags);
		if(t_tmpImg==null){
			error("ftImageManager.LoadImage\n\nCould not load image\n\n"+t_path);
		}
		t_newImage.m_img=t_tmpImg;
		t_newImage.m_imageNode=this.m_imageList.p_AddLast4(t_newImage);
	}
	return t_newImage;
}
c_ftImageManager.prototype.p_GrabImage2=function(t_atlas,t_frameStartX,t_frameStartY,t_frameWidth,t_frameHeight,t_frameCount,t_flags){
	var t_tmpImg=null;
	var t_newImage=null;
	if(t_newImage==null){
		t_newImage=c_ftImage.m_new.call(new c_ftImage);
		t_newImage.m_engine=this.m_engine;
		t_newImage.m_atlas=t_atlas;
		t_newImage.m_flags=t_flags;
		t_newImage.m_frameCount=t_frameCount;
		t_newImage.m_frameHeight=t_frameHeight;
		t_newImage.m_frameWidth=t_frameWidth;
		t_newImage.m_frameStartX=t_frameStartX;
		t_newImage.m_frameStartY=t_frameStartY;
		t_newImage.m_isGrabed=true;
		t_atlas.m_isAtlas=true;
		t_tmpImg=t_atlas.m_img.p_GrabImage(t_frameStartX,t_frameStartY,t_frameWidth,t_frameHeight,t_frameCount,t_flags);
		if(t_tmpImg==null){
			error("ftImageManager.GrabImage\n\nCould not grab image from atlas\n\n");
		}
		t_newImage.m_img=t_tmpImg;
		t_newImage.m_imageNode=this.m_imageList.p_AddLast4(t_newImage);
	}
	return t_newImage;
}
c_ftImageManager.prototype.p_GrabImage3=function(t_atlas,t_frameStartX,t_frameStartY,t_frameWidth,t_frameHeight,t_frameCount,t_flags){
	var t_tmpImg=null;
	var t_newImage=null;
	if(t_newImage==null){
		t_newImage=c_ftImage.m_new.call(new c_ftImage);
		t_newImage.m_engine=this.m_engine;
		t_newImage.m_flags=t_flags;
		t_newImage.m_frameCount=t_frameCount;
		t_newImage.m_frameHeight=t_frameHeight;
		t_newImage.m_frameWidth=t_frameWidth;
		t_newImage.m_frameStartX=t_frameStartX;
		t_newImage.m_frameStartY=t_frameStartY;
		t_newImage.m_isGrabed=true;
		var t_=this.m_imageList.p_ObjectEnumerator();
		while(t_.p_HasNext()){
			var t_tmpImgNode=t_.p_NextObject();
			if(t_tmpImgNode.m_img==t_atlas){
				t_tmpImgNode.m_isAtlas=true;
				t_newImage.m_atlas=t_tmpImgNode;
				break;
			}
		}
		t_tmpImg=t_atlas.p_GrabImage(t_frameStartX,t_frameStartY,t_frameWidth,t_frameHeight,t_frameCount,t_flags);
		if(t_tmpImg==null){
			error("ftImageManager.GrabImage\n\nCould not grab image from atlas\n\n");
		}
		t_newImage.m_img=t_tmpImg;
		t_newImage.m_imageNode=this.m_imageList.p_AddLast4(t_newImage);
	}
	return t_newImage;
}
var bb_random_Seed=0;
function bb_random_Rnd(){
	bb_random_Seed=bb_random_Seed*1664525+1013904223|0;
	return (bb_random_Seed>>8&16777215)/16777216.0;
}
function bb_random_Rnd2(t_low,t_high){
	return bb_random_Rnd3(t_high-t_low)+t_low;
}
function bb_random_Rnd3(t_range){
	return bb_random_Rnd()*t_range;
}
function c_ftImage(){
	Object.call(this);
	this.m_img=null;
	this.m_engine=null;
	this.m_path="";
	this.m_flags=c_Image.m_DefaultFlags;
	this.m_frameCount=-1;
	this.m_imageNode=null;
	this.m_frameHeight=-1;
	this.m_frameWidth=-1;
	this.m_atlas=null;
	this.m_frameStartX=-1;
	this.m_frameStartY=-1;
	this.m_isGrabed=false;
	this.m_isAtlas=false;
}
c_ftImage.m_new=function(){
	return this;
}
function c_List4(){
	Object.call(this);
	this.m__head=(c_HeadNode4.m_new.call(new c_HeadNode4));
}
c_List4.m_new=function(){
	return this;
}
c_List4.prototype.p_AddLast4=function(t_data){
	return c_Node4.m_new.call(new c_Node4,this.m__head,this.m__head.m__pred,t_data);
}
c_List4.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast4(t_t);
	}
	return this;
}
c_List4.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator.m_new.call(new c_Enumerator,this);
}
function c_Node4(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node4.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node4.m_new2=function(){
	return this;
}
function c_HeadNode4(){
	c_Node4.call(this);
}
c_HeadNode4.prototype=extend_class(c_Node4);
c_HeadNode4.m_new=function(){
	c_Node4.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_Enumerator(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator.m_new2=function(){
	return this;
}
c_Enumerator.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
function bb_math_Max(t_x,t_y){
	if(t_x>t_y){
		return t_x;
	}
	return t_y;
}
function bb_math_Max2(t_x,t_y){
	if(t_x>t_y){
		return t_x;
	}
	return t_y;
}
function bb_app_LoadString(t_path){
	return bb_app__game.LoadString(bb_data_FixDataPath(t_path));
}
function c_Enumerator2(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator2.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator2.m_new2=function(){
	return this;
}
c_Enumerator2.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator2.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
function c_ftSound(){
	Object.call(this);
	this.m_engine=null;
	this.m_name="";
	this.m_loop=false;
	this.m_isMusic=false;
	this.m_sound=null;
	this.m_soundNode=null;
	this.m_channel=0;
	this.m_volume=1.0;
	this.m_pan=0.0;
	this.m_rate=1.0;
	this.m_isPaused=false;
}
c_ftSound.m_new=function(){
	return this;
}
c_ftSound.prototype.p_GetFreeSoundChannel=function(){
	var t_msc=this.m_engine.m_maxSoundChannel;
	var t_fsc=this.m_engine.m_firstSoundChannel;
	for(var t_i=t_fsc;t_i<=t_msc-1;t_i=t_i+1){
		if(bb_audio_ChannelState(t_i)==0){
			return t_i;
		}
	}
	this.m_engine.m_nextSoundChannel+=1;
	if(this.m_engine.m_nextSoundChannel>=t_msc){
		this.m_engine.m_nextSoundChannel=t_fsc;
	}
	return this.m_engine.m_nextSoundChannel;
}
c_ftSound.prototype.p_Play=function(t_c){
	if(this.m_isMusic==false){
		if(t_c==-1){
			t_c=this.p_GetFreeSoundChannel();
		}
		this.m_channel=t_c;
		if(this.m_sound!=null){
			bb_audio_PlaySound(this.m_sound,t_c,((this.m_loop)?1:0));
			bb_audio_SetChannelVolume(this.m_channel,this.m_volume*this.m_engine.m_volumeSFX);
			bb_audio_SetChannelPan(this.m_channel,this.m_pan);
			bb_audio_SetChannelRate(this.m_channel,this.m_rate);
		}
	}else{
		bb_audio_PlayMusic(this.m_name,((this.m_loop)?1:0));
		bb_audio_SetMusicVolume(this.m_volume*this.m_engine.m_volumeMUS);
	}
	this.m_isPaused=false;
	return this.m_channel;
}
function c_Sound(){
	Object.call(this);
	this.m_sample=null;
}
c_Sound.m_new=function(t_sample){
	this.m_sample=t_sample;
	return this;
}
c_Sound.m_new2=function(){
	return this;
}
function bb_audio_LoadSound(t_path){
	var t_sample=bb_audio_device.LoadSample(bb_data_FixDataPath(t_path));
	if((t_sample)!=null){
		return c_Sound.m_new.call(new c_Sound,t_sample);
	}
	return null;
}
function c_List5(){
	Object.call(this);
	this.m__head=(c_HeadNode5.m_new.call(new c_HeadNode5));
}
c_List5.m_new=function(){
	return this;
}
c_List5.prototype.p_AddLast5=function(t_data){
	return c_Node5.m_new.call(new c_Node5,this.m__head,this.m__head.m__pred,t_data);
}
c_List5.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast5(t_t);
	}
	return this;
}
function c_Node5(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node5.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node5.m_new2=function(){
	return this;
}
function c_HeadNode5(){
	c_Node5.call(this);
}
c_HeadNode5.prototype=extend_class(c_Node5);
c_HeadNode5.m_new=function(){
	c_Node5.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_ftFont(){
	Object.call(this);
	this.m_lineHeight=0;
	this.m_pageCount=0;
	this.m_pages=[];
	this.m_filename="";
	this.m_charMap=c_IntMap.m_new.call(new c_IntMap);
}
c_ftFont.m_new=function(){
	return this;
}
c_ftFont.prototype.p_Load=function(t_url){
	var t_iniText="";
	var t_pageNum=0;
	var t_idnum=0;
	var t_path="";
	var t_tmpChar=null;
	var t_plLen=0;
	if(t_url.indexOf("/",0)>-1){
		var t_pl=t_url.split("/");
		t_plLen=t_pl.length;
		for(var t_pi=0;t_pi<=t_plLen-2;t_pi=t_pi+1){
			t_path=t_path+t_pl[t_pi]+"/";
		}
	}
	var t_ts=t_url.toLowerCase();
	if(t_ts.indexOf(".txt",0)>0){
		t_iniText=bb_app_LoadString(t_url);
	}else{
		t_iniText=bb_app_LoadString(t_url+".txt");
	}
	var t_lines=t_iniText.split(String.fromCharCode(10));
	var t_=t_lines;
	var t_2=0;
	while(t_2<t_.length){
		var t_line=t_[t_2];
		t_2=t_2+1;
		t_line=string_trim(t_line);
		if(string_startswith(t_line,"info") || t_line==""){
			continue;
		}
		if(string_startswith(t_line,"padding")){
			continue;
		}
		if(string_startswith(t_line,"common")){
			var t_commondata=t_line.split(String.fromCharCode(32));
			var t_3=t_commondata;
			var t_4=0;
			while(t_4<t_3.length){
				var t_common=t_3[t_4];
				t_4=t_4+1;
				if(string_startswith(t_common,"lineHeight=")){
					var t_lnh=t_common.split("=");
					t_lnh[1]=string_trim(t_lnh[1]);
					this.m_lineHeight=parseInt((t_lnh[1]),10);
				}
				if(string_startswith(t_common,"pages=")){
					var t_lnh2=t_common.split("=");
					t_lnh2[1]=string_trim(t_lnh2[1]);
					this.m_pageCount=parseInt((t_lnh2[1]),10);
					this.m_pages=new_object_array(this.m_pageCount);
				}
			}
		}
		if(string_startswith(t_line,"page")){
			var t_pagedata=t_line.split(String.fromCharCode(32));
			var t_5=t_pagedata;
			var t_6=0;
			while(t_6<t_5.length){
				var t_data=t_5[t_6];
				t_6=t_6+1;
				if(string_startswith(t_data,"file=")){
					var t_fn=t_data.split("=");
					t_fn[1]=string_trim(t_fn[1]);
					this.m_filename=t_fn[1];
					if(this.m_filename.charCodeAt(0)==34){
						this.m_filename=this.m_filename.slice(1,this.m_filename.length-1);
					}
					this.m_filename=t_path+string_trim(this.m_filename);
					this.m_pages[t_pageNum]=bb_graphics_LoadImage(this.m_filename,1,c_Image.m_DefaultFlags);
					if(this.m_pages[t_pageNum]==null){
						error("Error in method ftFont.Load\n\nCan not load page image: "+this.m_filename);
					}
					t_pageNum=t_pageNum+1;
				}
			}
		}
		if(string_startswith(t_line,"chars")){
			continue;
		}
		if(string_startswith(t_line,"char")){
			t_tmpChar=c_ftChar.m_new.call(new c_ftChar);
			var t_linedata=t_line.split(String.fromCharCode(32));
			var t_7=t_linedata;
			var t_8=0;
			while(t_8<t_7.length){
				var t_data2=t_7[t_8];
				t_8=t_8+1;
				if(string_startswith(t_data2,"id=")){
					var t_idc=t_data2.split("=");
					t_idc[1]=string_trim(t_idc[1]);
					t_tmpChar.m_id=parseInt((t_idc[1]),10);
				}
				if(string_startswith(t_data2,"x=")){
					var t_xc=t_data2.split("=");
					t_xc[1]=string_trim(t_xc[1]);
					t_tmpChar.m_x=parseInt((t_xc[1]),10);
				}
				if(string_startswith(t_data2,"y=")){
					var t_yc=t_data2.split("=");
					t_yc[1]=string_trim(t_yc[1]);
					t_tmpChar.m_y=parseInt((t_yc[1]),10);
				}
				if(string_startswith(t_data2,"width=")){
					var t_wc=t_data2.split("=");
					t_wc[1]=string_trim(t_wc[1]);
					t_tmpChar.m_width=parseInt((t_wc[1]),10);
				}
				if(string_startswith(t_data2,"height=")){
					var t_hc=t_data2.split("=");
					t_hc[1]=string_trim(t_hc[1]);
					t_tmpChar.m_height=parseInt((t_hc[1]),10);
				}
				if(string_startswith(t_data2,"xoffset=")){
					var t_xoc=t_data2.split("=");
					t_xoc[1]=string_trim(t_xoc[1]);
					t_tmpChar.m_xoff=parseInt((t_xoc[1]),10);
				}
				if(string_startswith(t_data2,"yoffset=")){
					var t_yoc=t_data2.split("=");
					t_yoc[1]=string_trim(t_yoc[1]);
					t_tmpChar.m_yoff=parseInt((t_yoc[1]),10);
				}
				if(string_startswith(t_data2,"xadvance=")){
					var t_advc=t_data2.split("=");
					t_advc[1]=string_trim(t_advc[1]);
					t_tmpChar.m_xadv=parseInt((t_advc[1]),10);
				}
				if(string_startswith(t_data2,"page=")){
					var t_advc2=t_data2.split("=");
					t_advc2[1]=string_trim(t_advc2[1]);
					t_tmpChar.m_page=parseInt((t_advc2[1]),10);
				}
			}
			this.m_charMap.p_Add(t_tmpChar.m_id,t_tmpChar);
		}
		continue;
	}
}
c_ftFont.prototype.p_Length=function(t_t){
	var t_currx=0;
	var t_c=0;
	var t_len=t_t.length;
	var t_tmpChar=null;
	for(var t_i=1;t_i<=t_len;t_i=t_i+1){
		t_c=t_t.charCodeAt(t_i-1);
		t_tmpChar=this.m_charMap.p_Get(t_c);
		if(t_tmpChar!=null){
			t_currx+=t_tmpChar.m_xadv;
		}
	}
	return t_currx;
}
c_ftFont.prototype.p_Height=function(){
	return this.m_lineHeight;
}
c_ftFont.prototype.p_Draw=function(t_t,t_xpos,t_ypos){
	var t_currx=.0;
	var t_curry=.0;
	var t_c=0;
	var t_tmpChar=null;
	var t_len=t_t.length;
	t_currx=t_xpos;
	t_curry=t_ypos;
	for(var t_i=1;t_i<=t_len;t_i=t_i+1){
		t_c=t_t.charCodeAt(t_i-1);
		t_tmpChar=this.m_charMap.p_Get(t_c);
		if(t_tmpChar!=null){
			bb_graphics_DrawImageRect(this.m_pages[t_tmpChar.m_page],t_currx+(t_tmpChar.m_xoff),t_curry+(t_tmpChar.m_yoff),t_tmpChar.m_x,t_tmpChar.m_y,t_tmpChar.m_width,t_tmpChar.m_height,0);
			t_currx=t_currx+(t_tmpChar.m_xadv);
		}
	}
}
function c_ftChar(){
	Object.call(this);
	this.m_id=0;
	this.m_x=0;
	this.m_y=0;
	this.m_width=0;
	this.m_height=0;
	this.m_xoff=0;
	this.m_yoff=0;
	this.m_xadv=0;
	this.m_page=0;
}
c_ftChar.m_new=function(){
	return this;
}
function c_Map(){
	Object.call(this);
	this.m_root=null;
}
c_Map.m_new=function(){
	return this;
}
c_Map.prototype.p_Compare=function(t_lhs,t_rhs){
}
c_Map.prototype.p_RotateLeft=function(t_node){
	var t_child=t_node.m_right;
	t_node.m_right=t_child.m_left;
	if((t_child.m_left)!=null){
		t_child.m_left.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_left){
			t_node.m_parent.m_left=t_child;
		}else{
			t_node.m_parent.m_right=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_left=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map.prototype.p_RotateRight=function(t_node){
	var t_child=t_node.m_left;
	t_node.m_left=t_child.m_right;
	if((t_child.m_right)!=null){
		t_child.m_right.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_right){
			t_node.m_parent.m_right=t_child;
		}else{
			t_node.m_parent.m_left=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_right=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map.prototype.p_InsertFixup=function(t_node){
	while(((t_node.m_parent)!=null) && t_node.m_parent.m_color==-1 && ((t_node.m_parent.m_parent)!=null)){
		if(t_node.m_parent==t_node.m_parent.m_parent.m_left){
			var t_uncle=t_node.m_parent.m_parent.m_right;
			if(((t_uncle)!=null) && t_uncle.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle.m_color=1;
				t_uncle.m_parent.m_color=-1;
				t_node=t_uncle.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_right){
					t_node=t_node.m_parent;
					this.p_RotateLeft(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateRight(t_node.m_parent.m_parent);
			}
		}else{
			var t_uncle2=t_node.m_parent.m_parent.m_left;
			if(((t_uncle2)!=null) && t_uncle2.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle2.m_color=1;
				t_uncle2.m_parent.m_color=-1;
				t_node=t_uncle2.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_left){
					t_node=t_node.m_parent;
					this.p_RotateRight(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateLeft(t_node.m_parent.m_parent);
			}
		}
	}
	this.m_root.m_color=1;
	return 0;
}
c_Map.prototype.p_Add=function(t_key,t_value){
	var t_node=this.m_root;
	var t_parent=null;
	var t_cmp=0;
	while((t_node)!=null){
		t_parent=t_node;
		t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				return false;
			}
		}
	}
	t_node=c_Node6.m_new.call(new c_Node6,t_key,t_value,-1,t_parent);
	if((t_parent)!=null){
		if(t_cmp>0){
			t_parent.m_right=t_node;
		}else{
			t_parent.m_left=t_node;
		}
		this.p_InsertFixup(t_node);
	}else{
		this.m_root=t_node;
	}
	return true;
}
c_Map.prototype.p_FindNode=function(t_key){
	var t_node=this.m_root;
	while((t_node)!=null){
		var t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				return t_node;
			}
		}
	}
	return t_node;
}
c_Map.prototype.p_Get=function(t_key){
	var t_node=this.p_FindNode(t_key);
	if((t_node)!=null){
		return t_node.m_value;
	}
	return null;
}
function c_IntMap(){
	c_Map.call(this);
}
c_IntMap.prototype=extend_class(c_Map);
c_IntMap.m_new=function(){
	c_Map.m_new.call(this);
	return this;
}
c_IntMap.prototype.p_Compare=function(t_lhs,t_rhs){
	return t_lhs-t_rhs;
}
function c_Node6(){
	Object.call(this);
	this.m_key=0;
	this.m_right=null;
	this.m_left=null;
	this.m_value=null;
	this.m_color=0;
	this.m_parent=null;
}
c_Node6.m_new=function(t_key,t_value,t_color,t_parent){
	this.m_key=t_key;
	this.m_value=t_value;
	this.m_color=t_color;
	this.m_parent=t_parent;
	return this;
}
c_Node6.m_new2=function(){
	return this;
}
function c_List6(){
	Object.call(this);
	this.m__head=(c_HeadNode6.m_new.call(new c_HeadNode6));
}
c_List6.m_new=function(){
	return this;
}
c_List6.prototype.p_AddLast6=function(t_data){
	return c_Node7.m_new.call(new c_Node7,this.m__head,this.m__head.m__pred,t_data);
}
c_List6.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast6(t_t);
	}
	return this;
}
function c_Node7(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node7.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node7.m_new2=function(){
	return this;
}
function c_HeadNode6(){
	c_Node7.call(this);
}
c_HeadNode6.prototype=extend_class(c_Node7);
c_HeadNode6.m_new=function(){
	c_Node7.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function bb_input_KeyHit(t_key){
	return bb_input_device.p_KeyHit(t_key);
}
function c_ftTimer(){
	Object.call(this);
	this.m_deleted=false;
	this.m_duration=0;
	this.m_currTime=0;
	this.m_engine=null;
	this.m_isPaused=false;
	this.m_obj=null;
	this.m_id=0;
	this.m_loop=0;
	this.m_timerNode=null;
	this.m_intervall=0;
}
c_ftTimer.prototype.p_RemoveTimer=function(){
	if(this.m_timerNode!=null){
		this.m_timerNode.p_Remove2();
	}
	this.m_timerNode=null;
	this.m_obj=null;
	this.m_engine=null;
}
c_ftTimer.prototype.p_Update3=function(){
	var t_oldCurrTime=0;
	var t_diffTime=0;
	if(this.m_deleted==false){
		if(this.m_duration>0){
			t_oldCurrTime=this.m_currTime;
			this.m_currTime=this.m_engine.m_time;
			t_diffTime=this.m_currTime-t_oldCurrTime;
			if(this.m_isPaused!=true && this.m_engine.m_isPaused!=true){
				this.m_duration-=t_diffTime;
			}
			if(this.m_duration<=0){
				if(this.m_obj==null){
					this.m_engine.p_OnTimer(this.m_id);
				}else{
					this.m_engine.p_OnObjectTimer(this.m_id,this.m_obj);
				}
				if(this.m_loop==0){
					if(this.m_obj==null){
						this.p_RemoveTimer();
					}else{
						this.m_deleted=true;
					}
				}
				if(this.m_loop==-1){
					this.m_duration+=this.m_intervall;
				}
				if(this.m_loop>0){
					this.m_duration+=this.m_intervall;
					this.m_loop-=1;
				}
			}
		}else{
			this.m_deleted=true;
		}
	}
}
c_ftTimer.m_new=function(){
	return this;
}
function c_List7(){
	Object.call(this);
	this.m__head=(c_HeadNode7.m_new.call(new c_HeadNode7));
}
c_List7.m_new=function(){
	return this;
}
c_List7.prototype.p_AddLast7=function(t_data){
	return c_Node8.m_new.call(new c_Node8,this.m__head,this.m__head.m__pred,t_data);
}
c_List7.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast7(t_t);
	}
	return this;
}
c_List7.prototype.p_Backwards=function(){
	return c_BackwardsList.m_new.call(new c_BackwardsList,this);
}
c_List7.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator6.m_new.call(new c_Enumerator6,this);
}
function c_Node8(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node8.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node8.m_new2=function(){
	return this;
}
c_Node8.prototype.p_Remove2=function(){
	this.m__succ.m__pred=this.m__pred;
	this.m__pred.m__succ=this.m__succ;
	return 0;
}
function c_HeadNode7(){
	c_Node8.call(this);
}
c_HeadNode7.prototype=extend_class(c_Node8);
c_HeadNode7.m_new=function(){
	c_Node8.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_BackwardsList(){
	Object.call(this);
	this.m__list=null;
}
c_BackwardsList.m_new=function(t_list){
	this.m__list=t_list;
	return this;
}
c_BackwardsList.m_new2=function(){
	return this;
}
c_BackwardsList.prototype.p_ObjectEnumerator=function(){
	return c_BackwardsEnumerator.m_new.call(new c_BackwardsEnumerator,this.m__list);
}
function c_BackwardsEnumerator(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_BackwardsEnumerator.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__pred;
	return this;
}
c_BackwardsEnumerator.m_new2=function(){
	return this;
}
c_BackwardsEnumerator.prototype.p_HasNext=function(){
	while(this.m__curr.m__pred.m__succ!=this.m__curr){
		this.m__curr=this.m__curr.m__pred;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_BackwardsEnumerator.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__pred;
	return t_data;
}
function c_Enumerator3(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator3.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator3.m_new2=function(){
	return this;
}
c_Enumerator3.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator3.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
function c_ftTrans(){
	Object.call(this);
	this.m_deleted=false;
	this.m_currTime=0;
	this.m_engine=null;
	this.m_isPaused=false;
	this.m_duration=0;
	this.m_entryList=c_List9.m_new.call(new c_List9);
	this.m_tween=null;
	this.m_finishID=0;
	this.m_obj=null;
	this.m_layer=null;
	this.m_transNode=null;
}
c_ftTrans.prototype.p_Update3=function(){
	var t_oldCurrTime=0;
	var t_deltaTime=0;
	if(this.m_deleted==false){
		t_oldCurrTime=this.m_currTime;
		this.m_currTime=this.m_engine.m_time;
		t_deltaTime=this.m_currTime-t_oldCurrTime;
		if(this.m_engine.m_isPaused!=true && this.m_isPaused!=true){
			this.m_duration-=t_deltaTime;
			if(this.m_duration<=0){
				var t_=this.m_entryList.p_ObjectEnumerator();
				while(t_.p_HasNext()){
					var t_entry=t_.p_NextObject();
					t_entry.p_Update4(-1,this.m_tween);
				}
				if(this.m_finishID!=0){
					if(this.m_obj!=null){
						this.m_engine.p_OnObjectTransition(this.m_finishID,this.m_obj);
					}else{
						this.m_engine.p_OnLayerTransition(this.m_finishID,this.m_layer);
					}
				}
				this.m_deleted=true;
			}else{
				var t_2=this.m_entryList.p_ObjectEnumerator();
				while(t_2.p_HasNext()){
					var t_entry2=t_2.p_NextObject();
					t_entry2.p_Update4(t_deltaTime,this.m_tween);
				}
			}
		}
	}
}
c_ftTrans.prototype.p_Clear=function(){
	var t_=this.m_entryList.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_entry=t_.p_NextObject();
		t_entry.m_obj=null;
		t_entry.m_layer=null;
	}
	this.m_entryList.p_Clear();
}
c_ftTrans.prototype.p_Cancel=function(){
	this.p_Clear();
	this.m_transNode.p_Remove2();
	this.m_transNode=null;
	this.m_obj=null;
	this.m_engine=null;
	this.m_layer=null;
}
function c_List8(){
	Object.call(this);
	this.m__head=(c_HeadNode8.m_new.call(new c_HeadNode8));
}
c_List8.m_new=function(){
	return this;
}
c_List8.prototype.p_AddLast8=function(t_data){
	return c_Node9.m_new.call(new c_Node9,this.m__head,this.m__head.m__pred,t_data);
}
c_List8.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast8(t_t);
	}
	return this;
}
c_List8.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator4.m_new.call(new c_Enumerator4,this);
}
function c_Node9(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node9.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node9.m_new2=function(){
	return this;
}
c_Node9.prototype.p_Remove2=function(){
	this.m__succ.m__pred=this.m__pred;
	this.m__pred.m__succ=this.m__succ;
	return 0;
}
function c_HeadNode8(){
	c_Node9.call(this);
}
c_HeadNode8.prototype=extend_class(c_Node9);
c_HeadNode8.m_new=function(){
	c_Node9.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_Enumerator4(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator4.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator4.m_new2=function(){
	return this;
}
c_Enumerator4.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator4.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
function c_ftTransEntry(){
	Object.call(this);
	this.m_timeLapsed=0.0;
	this.m_obj=null;
	this.m_typ=0;
	this.m_e_x=.0;
	this.m_e_y=.0;
	this.m_e_rot=.0;
	this.m_e_scale=.0;
	this.m_e_alpha=.0;
	this.m_s_x=.0;
	this.m_duration=.0;
	this.m_s_y=.0;
	this.m_rot=.0;
	this.m_scale=.0;
	this.m_alpha=.0;
	this.m_layer=null;
	this.m_x=.0;
	this.m_y=.0;
}
c_ftTransEntry.prototype.p_Update4=function(t_delta,t_tween){
	this.m_timeLapsed=this.m_timeLapsed+(t_delta);
	if(this.m_obj!=null){
		if(t_delta==-1){
			var t_1=this.m_typ;
			if(t_1==1){
				this.m_obj.p_SetPos(this.m_e_x,this.m_e_y,0);
			}else{
				if(t_1==2){
					this.m_obj.p_SetAngle(this.m_e_rot,0);
				}else{
					if(t_1==3){
						this.m_obj.p_SetScale(this.m_e_scale,0);
					}else{
						if(t_1==4){
							this.m_obj.p_SetAlpha(this.m_e_alpha,0);
						}
					}
				}
			}
		}else{
			var t_2=this.m_typ;
			if(t_2==1){
				this.m_obj.p_SetPosX(t_tween.m_equation.p_Call(this.m_timeLapsed,this.m_s_x,this.m_e_x-this.m_s_x,this.m_duration),0);
				this.m_obj.p_SetPosY(t_tween.m_equation.p_Call(this.m_timeLapsed,this.m_s_y,this.m_e_y-this.m_s_y,this.m_duration),0);
			}else{
				if(t_2==2){
					this.m_obj.p_SetAngle(this.m_rot*(t_delta),1);
				}else{
					if(t_2==3){
						this.m_obj.p_SetScale(this.m_scale*(t_delta),1);
					}else{
						if(t_2==4){
							this.m_obj.p_SetAlpha(this.m_alpha*(t_delta),1);
						}
					}
				}
			}
		}
	}else{
		if(t_delta==-1){
			var t_3=this.m_typ;
			if(t_3==1){
				this.m_layer.p_SetPos(this.m_e_x,this.m_e_y,0);
			}else{
				if(t_3==3){
					this.m_layer.p_SetScale(this.m_e_scale,0);
				}else{
					if(t_3==4){
						this.m_layer.p_SetAlpha(this.m_e_alpha,0);
					}
				}
			}
		}else{
			var t_4=this.m_typ;
			if(t_4==1){
				this.m_layer.p_SetPos(this.m_x*(t_delta),this.m_y*(t_delta),1);
			}else{
				if(t_4==3){
					this.m_layer.p_SetScale(this.m_scale*(t_delta),1);
				}else{
					if(t_4==4){
						this.m_layer.p_SetAlpha(this.m_alpha*(t_delta),1);
					}
				}
			}
		}
	}
}
function c_List9(){
	Object.call(this);
	this.m__head=(c_HeadNode9.m_new.call(new c_HeadNode9));
}
c_List9.m_new=function(){
	return this;
}
c_List9.prototype.p_AddLast9=function(t_data){
	return c_Node10.m_new.call(new c_Node10,this.m__head,this.m__head.m__pred,t_data);
}
c_List9.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast9(t_t);
	}
	return this;
}
c_List9.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator5.m_new.call(new c_Enumerator5,this);
}
c_List9.prototype.p_Clear=function(){
	this.m__head.m__succ=this.m__head;
	this.m__head.m__pred=this.m__head;
	return 0;
}
function c_Node10(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node10.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node10.m_new2=function(){
	return this;
}
function c_HeadNode9(){
	c_Node10.call(this);
}
c_HeadNode9.prototype=extend_class(c_Node10);
c_HeadNode9.m_new=function(){
	c_Node10.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_Enumerator5(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator5.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator5.m_new2=function(){
	return this;
}
c_Enumerator5.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator5.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
function c_Tween(){
	Object.call(this);
	this.m_equation=null;
}
function c_TweenEquationCall(){
	Object.call(this);
}
c_TweenEquationCall.prototype.p_Call=function(t_t,t_b,t_c,t_d){
}
function c_Enumerator6(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator6.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator6.m_new2=function(){
	return this;
}
c_Enumerator6.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator6.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
function c_BackwardsList2(){
	Object.call(this);
	this.m__list=null;
}
c_BackwardsList2.m_new=function(t_list){
	this.m__list=t_list;
	return this;
}
c_BackwardsList2.m_new2=function(){
	return this;
}
c_BackwardsList2.prototype.p_ObjectEnumerator=function(){
	return c_BackwardsEnumerator2.m_new.call(new c_BackwardsEnumerator2,this.m__list);
}
function c_BackwardsEnumerator2(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_BackwardsEnumerator2.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__pred;
	return this;
}
c_BackwardsEnumerator2.m_new2=function(){
	return this;
}
c_BackwardsEnumerator2.prototype.p_HasNext=function(){
	while(this.m__curr.m__pred.m__succ!=this.m__curr){
		this.m__curr=this.m__curr.m__pred;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_BackwardsEnumerator2.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__pred;
	return t_data;
}
function c_ftMarker(){
	Object.call(this);
}
function c_tPointS(){
	Object.call(this);
	this.m_x=.0;
	this.m_y=.0;
}
c_tPointS.m_new=function(){
	return this;
}
function c_tLine2D(){
	Object.call(this);
	this.m_p1=null;
	this.m_p2=null;
}
c_tLine2D.m_new=function(){
	this.m_p1=c_tPointS.m_new.call(new c_tPointS);
	this.m_p2=c_tPointS.m_new.call(new c_tPointS);
	return this;
}
function bb_math_Abs(t_x){
	if(t_x>=0){
		return t_x;
	}
	return -t_x;
}
function bb_math_Abs2(t_x){
	if(t_x>=0.0){
		return t_x;
	}
	return -t_x;
}
function bb_math_Min(t_x,t_y){
	if(t_x<t_y){
		return t_x;
	}
	return t_y;
}
function bb_math_Min2(t_x,t_y){
	if(t_x<t_y){
		return t_x;
	}
	return t_y;
}
function bb_app_LoadState(){
	return bb_app__game.LoadState();
}
function c_ftHighScoreList(){
	Object.call(this);
	this.m_entryList=c_List10.m_new.call(new c_List10);
	this.m_entryCount=10;
}
c_ftHighScoreList.m_new=function(){
	return this;
}
c_ftHighScoreList.prototype.p_LoadFromString=function(t_hs){
	this.m_entryList.p_Clear();
	var t_lines=t_hs.split(String.fromCharCode(10));
	var t_=t_lines;
	var t_2=0;
	while(t_2<t_.length){
		var t_line=t_[t_2];
		t_2=t_2+1;
		if(t_line==""){
			continue;
		}
		if(string_startswith(t_line,"count=")){
			var t_ct=t_line.split("=");
			this.m_entryCount=parseInt((t_ct[1]),10);
		}else{
			var t_dt=t_line.split("=");
			var t_tempEntry=c_ftHighScoreEntry.m_new.call(new c_ftHighScoreEntry);
			t_tempEntry.m_value=parseInt((t_dt[0]),10);
			t_tempEntry.m_name=t_dt[1];
			this.m_entryList.p_AddLast10(t_tempEntry);
		}
	}
}
c_ftHighScoreList.prototype.p_Count=function(){
	return this.m_entryList.p_Count();
}
c_ftHighScoreList.prototype.p_GetValue=function(t_i){
	var t_c=0;
	var t_=this.m_entryList.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_entry=t_.p_NextObject();
		t_c+=1;
		if(t_c==t_i){
			return t_entry.m_value;
		}
	}
	return 0;
}
c_ftHighScoreList.prototype.p_SortList=function(){
	var t_tempList=new_object_array(64);
	var t_tempEntry=c_ftHighScoreEntry.m_new.call(new c_ftHighScoreEntry);
	var t_c=0;
	var t_hasSort=false;
	for(var t_z=1;t_z<=this.m_entryCount;t_z=t_z+1){
		t_tempList[t_z-1]=c_ftHighScoreEntry.m_new.call(new c_ftHighScoreEntry);
	}
	var t_=this.m_entryList.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_entry=t_.p_NextObject();
		t_c+=1;
		t_tempList[t_c-1].m_value=t_entry.m_value;
		t_tempList[t_c-1].m_name=t_entry.m_name;
	}
	do{
		t_hasSort=false;
		for(var t_i=2;t_i<=t_c;t_i=t_i+1){
			if(t_tempList[t_i-1].m_value>t_tempList[t_i-2].m_value){
				t_tempEntry.m_value=t_tempList[t_i-2].m_value;
				t_tempEntry.m_name=t_tempList[t_i-2].m_name;
				t_tempList[t_i-2].m_value=t_tempList[t_i-1].m_value;
				t_tempList[t_i-2].m_name=t_tempList[t_i-1].m_name;
				t_tempList[t_i-1].m_value=t_tempEntry.m_value;
				t_tempList[t_i-1].m_name=t_tempEntry.m_name;
				t_hasSort=true;
			}
		}
	}while(!(t_hasSort==false));
	t_c=0;
	var t_2=this.m_entryList.p_ObjectEnumerator();
	while(t_2.p_HasNext()){
		var t_entry2=t_2.p_NextObject();
		t_entry2.m_value=t_tempList[t_c].m_value;
		t_entry2.m_name=t_tempList[t_c].m_name;
		t_c+=1;
	}
}
c_ftHighScoreList.prototype.p_AddScore=function(t_value,t_n){
	var t_ret=0;
	var t_c=0;
	t_c+=1;
	var t_=this.m_entryList.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_entry=t_.p_NextObject();
		if(t_value>=t_entry.m_value){
			break;
		}else{
			t_c+=1;
		}
	}
	if(t_c<=this.m_entryCount){
		if(this.m_entryList.p_Count()==this.m_entryCount){
			this.m_entryList.p_RemoveLast();
		}
		var t_tempScore=c_ftHighScoreEntry.m_new.call(new c_ftHighScoreEntry);
		t_tempScore.m_value=t_value;
		t_tempScore.m_name=t_n;
		this.m_entryList.p_AddLast10(t_tempScore);
		t_ret=t_c;
		if(this.m_entryList.p_Count()>1){
			this.p_SortList();
		}
	}
	return t_ret;
}
c_ftHighScoreList.prototype.p_SaveToString=function(){
	var t_hs="";
	t_hs="count="+String(this.m_entryCount)+String.fromCharCode(10);
	var t_=this.m_entryList.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_entry=t_.p_NextObject();
		t_hs=t_hs+String(t_entry.m_value)+"="+t_entry.m_name+String.fromCharCode(10);
	}
	return t_hs;
}
function c_ftHighScoreEntry(){
	Object.call(this);
	this.m_value=0;
	this.m_name="";
}
c_ftHighScoreEntry.m_new=function(){
	return this;
}
function c_List10(){
	Object.call(this);
	this.m__head=(c_HeadNode10.m_new.call(new c_HeadNode10));
}
c_List10.m_new=function(){
	return this;
}
c_List10.prototype.p_AddLast10=function(t_data){
	return c_Node11.m_new.call(new c_Node11,this.m__head,this.m__head.m__pred,t_data);
}
c_List10.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast10(t_t);
	}
	return this;
}
c_List10.prototype.p_Clear=function(){
	this.m__head.m__succ=this.m__head;
	this.m__head.m__pred=this.m__head;
	return 0;
}
c_List10.prototype.p_Count=function(){
	var t_n=0;
	var t_node=this.m__head.m__succ;
	while(t_node!=this.m__head){
		t_node=t_node.m__succ;
		t_n+=1;
	}
	return t_n;
}
c_List10.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator7.m_new.call(new c_Enumerator7,this);
}
c_List10.prototype.p_RemoveLast=function(){
	var t_data=this.m__head.p_PrevNode().m__data;
	this.m__head.m__pred.p_Remove2();
	return t_data;
}
c_List10.prototype.p_Equals=function(t_lhs,t_rhs){
	return t_lhs==t_rhs;
}
c_List10.prototype.p_FindLast=function(t_value,t_start){
	while(t_start!=this.m__head){
		if(this.p_Equals(t_value,t_start.m__data)){
			return t_start;
		}
		t_start=t_start.m__pred;
	}
	return null;
}
c_List10.prototype.p_FindLast2=function(t_value){
	return this.p_FindLast(t_value,this.m__head.m__pred);
}
c_List10.prototype.p_RemoveLast2=function(t_value){
	var t_node=this.p_FindLast2(t_value);
	if((t_node)!=null){
		t_node.p_Remove2();
	}
}
function c_Node11(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node11.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node11.m_new2=function(){
	return this;
}
c_Node11.prototype.p_GetNode=function(){
	return this;
}
c_Node11.prototype.p_PrevNode=function(){
	return this.m__pred.p_GetNode();
}
c_Node11.prototype.p_Remove2=function(){
	this.m__succ.m__pred=this.m__pred;
	this.m__pred.m__succ=this.m__succ;
	return 0;
}
function c_HeadNode10(){
	c_Node11.call(this);
}
c_HeadNode10.prototype=extend_class(c_Node11);
c_HeadNode10.m_new=function(){
	c_Node11.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
c_HeadNode10.prototype.p_GetNode=function(){
	return null;
}
function c_Enumerator7(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator7.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator7.m_new2=function(){
	return this;
}
c_Enumerator7.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator7.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
function bb_graphics_Cls(t_r,t_g,t_b){
	bb_graphics_renderDevice.Cls(t_r,t_g,t_b);
	return 0;
}
function bb_graphics_PushMatrix(){
	var t_sp=bb_graphics_context.m_matrixSp;
	bb_graphics_context.m_matrixStack[t_sp+0]=bb_graphics_context.m_ix;
	bb_graphics_context.m_matrixStack[t_sp+1]=bb_graphics_context.m_iy;
	bb_graphics_context.m_matrixStack[t_sp+2]=bb_graphics_context.m_jx;
	bb_graphics_context.m_matrixStack[t_sp+3]=bb_graphics_context.m_jy;
	bb_graphics_context.m_matrixStack[t_sp+4]=bb_graphics_context.m_tx;
	bb_graphics_context.m_matrixStack[t_sp+5]=bb_graphics_context.m_ty;
	bb_graphics_context.m_matrixSp=t_sp+6;
	return 0;
}
function bb_graphics_Transform(t_ix,t_iy,t_jx,t_jy,t_tx,t_ty){
	var t_ix2=t_ix*bb_graphics_context.m_ix+t_iy*bb_graphics_context.m_jx;
	var t_iy2=t_ix*bb_graphics_context.m_iy+t_iy*bb_graphics_context.m_jy;
	var t_jx2=t_jx*bb_graphics_context.m_ix+t_jy*bb_graphics_context.m_jx;
	var t_jy2=t_jx*bb_graphics_context.m_iy+t_jy*bb_graphics_context.m_jy;
	var t_tx2=t_tx*bb_graphics_context.m_ix+t_ty*bb_graphics_context.m_jx+bb_graphics_context.m_tx;
	var t_ty2=t_tx*bb_graphics_context.m_iy+t_ty*bb_graphics_context.m_jy+bb_graphics_context.m_ty;
	bb_graphics_SetMatrix(t_ix2,t_iy2,t_jx2,t_jy2,t_tx2,t_ty2);
	return 0;
}
function bb_graphics_Transform2(t_m){
	bb_graphics_Transform(t_m[0],t_m[1],t_m[2],t_m[3],t_m[4],t_m[5]);
	return 0;
}
function bb_graphics_Translate(t_x,t_y){
	bb_graphics_Transform(1.0,0.0,0.0,1.0,t_x,t_y);
	return 0;
}
function bb_graphics_Scale(t_x,t_y){
	bb_graphics_Transform(t_x,0.0,0.0,t_y,0.0,0.0);
	return 0;
}
function bb_graphics_Rotate(t_angle){
	bb_graphics_Transform(Math.cos((t_angle)*D2R),-Math.sin((t_angle)*D2R),Math.sin((t_angle)*D2R),Math.cos((t_angle)*D2R),0.0,0.0);
	return 0;
}
function bb_cftMisc_RotateDisplay(t_X,t_Y,t_angle){
	bb_graphics_Translate(t_X,t_Y);
	bb_graphics_Rotate(t_angle);
	bb_graphics_Translate(-t_X,-t_Y);
}
function bb_graphics_DrawPoint(t_x,t_y){
	bb_graphics_context.p_Validate();
	bb_graphics_renderDevice.DrawPoint(t_x,t_y);
	return 0;
}
function bb_graphics_DrawCircle(t_x,t_y,t_r){
	bb_graphics_context.p_Validate();
	bb_graphics_renderDevice.DrawOval(t_x-t_r,t_y-t_r,t_r*2.0,t_r*2.0);
	return 0;
}
function bb_graphics_DrawLine(t_x1,t_y1,t_x2,t_y2){
	bb_graphics_context.p_Validate();
	bb_graphics_renderDevice.DrawLine(t_x1,t_y1,t_x2,t_y2);
	return 0;
}
function bb_graphics_PopMatrix(){
	var t_sp=bb_graphics_context.m_matrixSp-6;
	bb_graphics_SetMatrix(bb_graphics_context.m_matrixStack[t_sp+0],bb_graphics_context.m_matrixStack[t_sp+1],bb_graphics_context.m_matrixStack[t_sp+2],bb_graphics_context.m_matrixStack[t_sp+3],bb_graphics_context.m_matrixStack[t_sp+4],bb_graphics_context.m_matrixStack[t_sp+5]);
	bb_graphics_context.m_matrixSp=t_sp;
	return 0;
}
function bb_graphics_DrawOval(t_x,t_y,t_w,t_h){
	bb_graphics_context.p_Validate();
	bb_graphics_renderDevice.DrawOval(t_x,t_y,t_w,t_h);
	return 0;
}
function bb_graphics_DrawPoly(t_verts){
	bb_graphics_context.p_Validate();
	bb_graphics_renderDevice.DrawPoly(t_verts);
	return 0;
}
function bb_graphics_DrawPoly2(t_verts,t_image,t_frame){
	var t_f=t_image.m_frames[t_frame];
	bb_graphics_renderDevice.DrawPoly2(t_verts,t_image.m_surface,t_f.m_x,t_f.m_y);
	return 0;
}
function bb_graphics_DrawImageRect(t_image,t_x,t_y,t_srcX,t_srcY,t_srcWidth,t_srcHeight,t_frame){
	var t_f=t_image.m_frames[t_frame];
	bb_graphics_context.p_Validate();
	bb_graphics_renderDevice.DrawSurface2(t_image.m_surface,-t_image.m_tx+t_x,-t_image.m_ty+t_y,t_srcX+t_f.m_x,t_srcY+t_f.m_y,t_srcWidth,t_srcHeight);
	return 0;
}
function bb_graphics_DrawImageRect2(t_image,t_x,t_y,t_srcX,t_srcY,t_srcWidth,t_srcHeight,t_rotation,t_scaleX,t_scaleY,t_frame){
	var t_f=t_image.m_frames[t_frame];
	bb_graphics_PushMatrix();
	bb_graphics_Translate(t_x,t_y);
	bb_graphics_Rotate(t_rotation);
	bb_graphics_Scale(t_scaleX,t_scaleY);
	bb_graphics_Translate(-t_image.m_tx,-t_image.m_ty);
	bb_graphics_context.p_Validate();
	bb_graphics_renderDevice.DrawSurface2(t_image.m_surface,0.0,0.0,t_srcX+t_f.m_x,t_srcY+t_f.m_y,t_srcWidth,t_srcHeight);
	bb_graphics_PopMatrix();
	return 0;
}
function c_ftMapTile(){
	Object.call(this);
	this.m_xOff=.0;
	this.m_yOff=.0;
	this.m_tileID=0;
}
function bb_graphics_DrawRect(t_x,t_y,t_w,t_h){
	bb_graphics_context.p_Validate();
	bb_graphics_renderDevice.DrawRect(t_x,t_y,t_w,t_h);
	return 0;
}
function bb_audio_ChannelState(t_channel){
	return bb_audio_device.ChannelState(t_channel);
}
function bb_audio_PlaySound(t_sound,t_channel,t_flags){
	if(((t_sound)!=null) && ((t_sound.m_sample)!=null)){
		bb_audio_device.PlaySample(t_sound.m_sample,t_channel,t_flags);
	}
	return 0;
}
function bb_audio_SetChannelVolume(t_channel,t_volume){
	bb_audio_device.SetVolume(t_channel,t_volume);
	return 0;
}
function bb_audio_SetChannelPan(t_channel,t_pan){
	bb_audio_device.SetPan(t_channel,t_pan);
	return 0;
}
function bb_audio_SetChannelRate(t_channel,t_rate){
	bb_audio_device.SetRate(t_channel,t_rate);
	return 0;
}
function bb_audio_PlayMusic(t_path,t_flags){
	return bb_audio_device.PlayMusic(bb_data_FixDataPath(t_path),t_flags);
}
function bb_audio_SetMusicVolume(t_volume){
	bb_audio_device.SetMusicVolume(t_volume);
	return 0;
}
function bb_input_KeyDown(t_key){
	return ((bb_input_device.p_KeyDown(t_key))?1:0);
}
function bb_app_SaveState(t_state){
	return bb_app__game.SaveState(t_state);
}
function bbInit(){
	bb_app__app=null;
	bb_app__delegate=null;
	bb_app__game=BBGame.Game();
	bb_RockSmash_g=null;
	bb_graphics_device=null;
	bb_graphics_context=c_GraphicsContext.m_new.call(new c_GraphicsContext);
	c_Image.m_DefaultFlags=0;
	bb_audio_device=null;
	bb_input_device=null;
	bb_graphics_renderDevice=null;
	bb_app__updateRate=0;
	bb_random_Seed=1234;
}
//${TRANSCODE_END}
