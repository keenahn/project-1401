/* demo/test02.js */
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

	var MOD = SYSLOOP.New("Test02");
	MOD.EnableUpdate( true );

	MOD.SetHandler( 'Start', m_Start );
	MOD.SetHandler( 'Construct', m_Construct );
	MOD.SetHandler( 'Update', m_Update);


///////////////////////////////////////////////////////////////////////////////
/** PRIVATE VARS *************************************************************/

	var shipSprite;
	var starfields = [];


///////////////////////////////////////////////////////////////////////////////
/** MODULE HANDLER FUNCTIONS *************************************************/

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	function m_Start() {
	}	


///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	function m_Construct() {

		console.group("Starfield");

			/* make starfield */
			var spec = {
				color: new THREE.Color(1,1,1),
				width: 10,
				height: 10
			};
			starfields = [];
			for (var i=0;i<3;i++) {
				spec.color.multiplyScalar(0.7);
				var sf = VISUALFACTORY.MakeStarField( spec );
				sf.scale.set(1000,1000,1);
				sf.position.set(0,0,-100-i);
				RENDERER.AddBackgroundVisual(sf);
				starfields.push(sf);
			}


			/* make crixa ship */
			shipSprite = VISUALFACTORY.MakeDefaultSprite();
			RENDERER.AddWorldVisual(shipSprite);
			var seq = {
	            grid: { columns:2, rows:1, stacked:true },
	            sequences: [
	                { name: 'flicker', framecount: 2, fps:4 }
	            ]
	        };
	        shipSprite.DefineSequences(SETTINGS.GamePath('resources/crixa.png'),seq);
	        shipSprite.PlaySequence("flicker");
	        var crixa = PIECEFACTORY.NewPiece("crixa");
	        crixa.SetVisual(shipSprite);
	        crixa.SetPositionXY(0,0);


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
	function m_Update ( interval_ms ) {
		// sprite rotate by rotating the material
		var mat = shipSprite.material;
			mat.rotation -= 0.01;

		for (var i=0;i<starfields.length;i++){
			var layer = starfields.length-i-1;
			starfields[i].rotation.z += (layer*0.0005)+0.001;
		}

		counter += interval_ms;
	}


///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	return MOD;

});