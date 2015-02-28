/* demo/test01.js */
define ([
	'1401/objects/sysloop',
	'1401/settings',
	'1401/system/renderer',
	'1401/system/visualfactory',
	'1401/system/piecefactory',
], function ( 
	SYSLOOP,
	SETTINGS,
	RENDERER,
	VISUALFACTORY,
	PIECEFACTORY
) {

	var DBGOUT = true;

///////////////////////////////////////////////////////////////////////////////
/**	SUBMODULE TEST01 *********************************************************\

	This submodule of demogame constructs some test shapes. It is hooked-in
	to the master lifecycle through SYSLOOP, receiving events that it has
	opted-in to receive.

		Connect
		LoadAssets
		Initialize
		Construct
		Start
	
		GetInput
		Update
		Think
		OverThink
		Execute

	Note that the handlers for GetInput(), Update(), and the AI methods
	Think(), OverThink(), and Execute() have to be explicitly enabled. These
	events are also not passed UNLESS game-main


///////////////////////////////////////////////////////////////////////////////
/** MODULE DECLARATION *******************************************************/

	var MOD = SYSLOOP.New("Test01");
	MOD.EnableUpdate( true );

	MOD.SetHandler( 'Start', m_Start );
	MOD.SetHandler( 'Construct', m_Construct );
	MOD.SetHandler( 'Update', m_Update);
	MOD.SetHandler( 'Think', function() { console.log("think!")} );


///////////////////////////////////////////////////////////////////////////////
/** PRIVATE VARS *************************************************************/

	var spr01;
	var spr02;
	var spr03;
	var obj01;
	var obj02;


///////////////////////////////////////////////////////////////////////////////
/** MODULE HANDLER FUNCTIONS *************************************************/

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	function m_Start() {
	}	


///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	function m_Construct() {

		console.group("constructing test pieces");

			var numpieces = 100000;
			console.log("creating",numpieces,"pieces without visuals");
			for (var i=0;i<numpieces;i++) {
				var p = PIECEFACTORY.NewPiece("test");
			}

			console.log("creating testSuperPiece");
			var testSuperPiece = PIECEFACTORY.NewMovingPiece("TestSuper");

		console.groupEnd();
		
		console.group("constructing test visuals");

			spr01 = VISUALFACTORY.MakeDefaultSprite();
			spr02 = VISUALFACTORY.MakeDefaultSprite();
			spr03 = VISUALFACTORY.MakeDefaultSprite();
			spr01.position.x = -512;
			spr02.position.x = 512;

			RENDERER.AddWorldVisual(spr01);
			RENDERER.AddWorldVisual(spr02);
			RENDERER.AddWorldVisual(spr03);

			/* make crixa ship */
			var seq = {
	            grid: { columns:2, rows:1, stacked:true },
	            sequences: [
	                { name: 'flicker', framecount: 2, fps:4 }
	            ]
	        };
	        spr03.DefineSequences(SETTINGS.GamePath('resources/crixa.png'),seq);
	        spr03.PlaySequence("flicker");
	        spr03.PulseDown(1000,true);
	        var crixa = PIECEFACTORY.NewPiece("crixa");
	        crixa.SetVisual(spr03);
	        crixa.SetPositionXY(0,192);

	        /* make ground plane */
	        obj01 = VISUALFACTORY.MakeGroundPlane({
	        	width: 800,
	        	depth: 600,
	        	color: 0xFF0000
	        });
	        obj01.position.z = -200;
	        RENDERER.AddWorldVisual(obj01);

	        /* make sphere */
	        obj02 = VISUALFACTORY.MakeSphere({
	        	radius:100,
	        	color: 0x00FF00
	        });
	        obj02.position.z = -250;
	        RENDERER.AddWorldVisual(obj02);

	        /* add lights so mesh colors show */
			var ambientLight = new THREE.AmbientLight(0x222222);
	      	RENDERER.AddWorldVisual(ambientLight);

			var directionalLight = new THREE.DirectionalLight(0xffffff);
			directionalLight.position.set(1, 1, 1).normalize();
			RENDERER.AddWorldVisual(directionalLight);

		console.groupEnd();

		// console.info("NOTE: WorldCam is set between 2D and 3D modes every few seconds, which creates a visual jump\n\n");
	}


///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	var counter = 0;
	var mode3d = true;
	function m_Update ( interval_ms ) {
		// sprite rotate by rotating the material
		var mat = spr01.material;
			mat.rotation += 0.05;
			mat = spr02.material;
			mat.rotation -= 0.01;
			mat = spr03.material;
			mat.rotation -= 0.02;

		obj01.rotation.x += 0.1;

		var vp = RENDERER.GetViewport();
		var cam = vp.GetWorldCam();
		obj02.rotation.y += 0.01;

		counter += interval_ms;
		if (counter>3000) {
			counter=0;
			mode3d = !mode3d;
		}
		if (mode3d) RENDERER.SelectWorld3D();
		else RENDERER.SelectWorld2D();
	}


///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	return MOD;

});